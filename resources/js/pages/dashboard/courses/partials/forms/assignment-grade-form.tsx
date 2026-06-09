import InputError from '@/components/input-error';
import LoadingButton from '@/components/loading-button';
import { Button } from '@/components/ui/button';
import { DialogClose } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from '@inertiajs/react';
import { CheckCircle } from 'lucide-react';
import React from 'react';

interface Props {
   isGraded: boolean;
   isLate: boolean;
   totalMarks: number;
   submission: AssignmentSubmission;
}

const AssignmentGradeForm = ({ isGraded, isLate, totalMarks, submission }: Props) => {
   const { data, setData, post, put, processing, errors } = useForm({
      marks_obtained: submission ? submission.marks_obtained : '',
      instructor_feedback: submission ? submission.instructor_feedback : '',
      status: submission ? submission.status : 'pending',
   });

   // Handle grade submission
   const handleGradeSubmit = (e: React.FormEvent) => {
      e.preventDefault();

      if (submission) {
         put(route('assignment.submission.update', submission.id));
      } else {
         post(route('assignment.submission.store'));
      }
   };

   return (
      <form onSubmit={handleGradeSubmit} className="space-y-4 rounded-lg border p-4">
         <h3 className="flex items-center gap-2 font-semibold">
            <CheckCircle className="text-primary h-5 w-5" />
            {isGraded ? 'Update Grade' : 'Grade Submission'}
         </h3>

         <div className="grid grid-cols-2 gap-4">
            {/* Marks Obtained */}
            <div className="space-y-2">
               <Label htmlFor="marks">
                  Marks Obtained *
                  <span className="text-muted-foreground ml-1 text-xs">
                     (Max: {totalMarks}
                     {isLate && <span className="text-destructive"> - Late Submission</span>})
                  </span>
               </Label>
               <Input
                  id="marks"
                  type="number"
                  min="0"
                  max={totalMarks}
                  step="0.01"
                  placeholder="Enter marks"
                  value={data.marks_obtained}
                  onChange={(e) => setData('marks_obtained', e.target.value)}
                  required
               />
               {isLate && data.marks_obtained && parseFloat(data.marks_obtained as string) > totalMarks && (
                  <p className="text-destructive text-xs">Cannot exceed late submission maximum ({totalMarks})</p>
               )}
               <InputError message={errors.marks_obtained} />
            </div>

            {/* Status (Auto-set to graded) */}
            <div className="space-y-2">
               <Label htmlFor="status">Status</Label>
               <Select value={data.status} onValueChange={(value: any) => setData('status', value)}>
                  <SelectTrigger>
                     <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                     <SelectItem value="pending">Pending</SelectItem>
                     <SelectItem value="graded">Graded</SelectItem>
                     <SelectItem value="resubmitted">Resubmitted</SelectItem>
                  </SelectContent>
               </Select>
               <InputError message={errors.status} />
            </div>
         </div>

         {/* Instructor Feedback */}
         <div className="space-y-2">
            <Label htmlFor="feedback">Instructor Feedback (Optional)</Label>
            <Textarea
               id="feedback"
               placeholder="Provide feedback to the student..."
               value={data.instructor_feedback || ''}
               onChange={(e) => setData('instructor_feedback', e.target.value)}
               rows={4}
            />
            <InputError message={errors.instructor_feedback} />
         </div>

         {/* Current Grade Display (if already graded) */}
         {data.status === 'graded' && submission?.grader && (
            <div className="rounded-lg border border-green-200 bg-green-50 p-3 dark:border-green-800 dark:bg-green-950">
               <p className="text-sm">
                  <span className="font-medium">Previously graded:</span> {submission.marks_obtained} / {totalMarks}
               </p>
               {submission.instructor_feedback && (
                  <p className="text-muted-foreground mt-1 text-sm">Previous feedback: {submission.instructor_feedback}</p>
               )}
            </div>
         )}

         {/* Action Buttons */}
         <div className="flex justify-end gap-3 pt-4">
            <DialogClose asChild>
               <Button variant="outline">Cancel</Button>
            </DialogClose>
            <LoadingButton type="submit" className="gap-2" loading={processing} disabled={processing || !data.marks_obtained}>
               <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  {isGraded ? 'Update Grade' : 'Submit Grade'}
               </div>
            </LoadingButton>
         </div>
      </form>
   );
};

export default AssignmentGradeForm;
