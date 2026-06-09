import ChunkedUploaderInput from '@/components/chunked-uploader-input';
import InputError from '@/components/input-error';
import LoadingButton from '@/components/loading-button';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from '@inertiajs/react';
import { useEffect, useState } from 'react';

interface Props {
   assignment: CourseAssignment;
   setDialogOpen: (open: boolean) => void;
}

const AssignmentSubmissionForm = ({ assignment, setDialogOpen }: Props) => {
   const [isSubmit, setIsSubmit] = useState(false);
   const [isFileUploaded, setIsFileUploaded] = useState(false);

   const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
      course_assignment_id: assignment.id,
      attachment_type: 'url',
      attachment_path: '',
      comment: '',
   });

   // Handle submission
   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();

      if (data.attachment_type === 'url') {
         submitForm();
         return;
      }

      setIsSubmit(true);
   };

   const submitForm = () => {
      clearErrors();

      post(route('assignment.submission.store'), {
         preserveScroll: true,
         onSuccess: () => {
            reset();
            setIsSubmit(false);
            setDialogOpen(false);
         },
         onError: () => {
            setIsSubmit(false);
         },
      });
   };

   useEffect(() => {
      if (data.attachment_path && isFileUploaded) {
         submitForm();
         setIsFileUploaded(false);
      }
   }, [data.attachment_path]);

   return (
      <form onSubmit={handleSubmit} className="space-y-4">
         {/* Submission Type Selection */}
         <div className="space-y-3">
            <Label>Submission Type *</Label>
            <Select required name="attachment_type" value={data.attachment_type} onValueChange={(type) => setData('attachment_type', type)}>
               <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Submission Type" />
               </SelectTrigger>
               <SelectContent>
                  <SelectItem value="url">URL Link</SelectItem>
                  <SelectItem value="file">Upload File</SelectItem>
               </SelectContent>
            </Select>
            <InputError message={errors.attachment_type} />
         </div>

         {/* URL Input */}
         {data.attachment_type === 'url' && (
            <div className="space-y-2">
               <Label htmlFor="url">URL Link *</Label>
               <Input
                  id="url"
                  type="url"
                  placeholder="Enter URL here..."
                  value={data.attachment_path}
                  onChange={(e) => setData('attachment_path', e.target.value)}
                  required
               />
               <InputError message={errors.attachment_path} />
               <p className="text-muted-foreground text-xs">Share your GitHub repository, Google Drive, or any public URL</p>
            </div>
         )}

         {/* File Upload */}
         {data.attachment_type === 'file' && (
            <div className="space-y-2">
               <Label htmlFor="file">Upload File *</Label>
               <ChunkedUploaderInput
                  isSubmit={isSubmit}
                  courseId={assignment.course_id}
                  filetype={'document'}
                  delayUpload={true}
                  onFileUploaded={(fileData) => {
                     setIsFileUploaded(true);
                     setData('attachment_path', fileData.file_url);
                  }}
                  onError={(errors) => {
                     setIsSubmit(false);
                  }}
                  onCancelUpload={() => {
                     setIsSubmit(false);
                  }}
               />
               <InputError message={errors.attachment_path} />
               <p className="text-muted-foreground mt-1 text-xs">Formats: .JPEG, .PNG, .DOC, .PDF, .ZIP (Max: 10MB)</p>
            </div>
         )}

         {/* Comment */}
         <div className="space-y-2">
            <Label htmlFor="comment">Comment (Optional)</Label>
            <Textarea
               id="comment"
               placeholder="Add any notes or comments about your submission..."
               value={data.comment}
               onChange={(e) => setData('comment', e.target.value)}
               rows={4}
            />
            <InputError message={errors.comment} />
         </div>

         {/* Submit Button */}
         <div className="flex justify-end gap-3 pt-3">
            <Button type="button" variant="outline" disabled={processing || isSubmit}>
               Cancel
            </Button>

            <LoadingButton type="submit" className="gap-2" loading={processing || isSubmit}>
               Submit Assignment
            </LoadingButton>
         </div>
      </form>
   );
};

export default AssignmentSubmissionForm;
