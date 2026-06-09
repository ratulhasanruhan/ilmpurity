import ChunkedUploaderInput from '@/components/chunked-uploader-input';
import InputError from '@/components/input-error';
import LoadingButton from '@/components/loading-button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getFileMetadata } from '@/lib/file-metadata';
import { onHandleChange } from '@/lib/inertia';
import { useForm, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { ExamUpdateProps } from '../../update';

interface Props {
   title: string;
   handler: React.ReactNode;
   resource?: ExamResource;
}

const ResourceForm = ({ title, handler, resource }: Props) => {
   const [open, setOpen] = useState(false);
   const [isSubmit, setIsSubmit] = useState(false);
   const [isFileUploaded, setIsFileUploaded] = useState(false);

   const { exam, translate } = usePage<ExamUpdateProps>().props;
   const { input, button } = translate;

   const { data, setData, post, put, reset, processing, errors, clearErrors } = useForm({
      title: resource ? resource.title : '',
      type: resource ? resource.type : 'document',
      resource: resource ? resource.resource : '',
      resource_url: null,
      exam_id: exam.id,
   });

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();

      if (data.type === 'link') {
         submitForm();
         return;
      }

      setIsSubmit(true);
   };

   const submitForm = () => {
      clearErrors();

      if (resource) {
         put(route('exam-resources.update', resource.id), {
            preserveScroll: true,
            onSuccess: () => {
               reset();
               setIsSubmit(false);
               setOpen(true);
            },
         });
      } else {
         post(route('exam-resources.store'), {
            preserveScroll: true,
            onSuccess: () => {
               reset();
               setIsSubmit(false);
               setOpen(true);
            },
         });
      }
   };

   useEffect(() => {
      if (data.resource_url && isFileUploaded) {
         submitForm();
         reset('resource_url');
         setIsFileUploaded(false);
      }
   }, [data.resource_url]);

   const resourceTypes = [
      { label: 'Document', value: 'document' },
      { label: 'Image File', value: 'image' },
      { label: 'Video File', value: 'video' },
      { label: 'Zip/Archive', value: 'zip' },
      { label: 'External Link', value: 'link' },
   ];

   return (
      <Dialog open={open} onOpenChange={setOpen}>
         <DialogTrigger>{handler}</DialogTrigger>

         <DialogContent className="p-0">
            <ScrollArea className="max-h-[90vh] p-6">
               <DialogHeader className="mb-6">
                  <DialogTitle>{title}</DialogTitle>
               </DialogHeader>

               <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                     <Label>{input.title}</Label>
                     <Input required name="title" value={data.title} placeholder={input.title} onChange={(e) => onHandleChange(e, setData)} />
                     <InputError message={errors.title} />
                  </div>

                  <div>
                     <Label>Resource Type</Label>
                     <Select required name="type" value={data.type} onValueChange={(type) => setData('type', type)}>
                        <SelectTrigger className="w-full">
                           <SelectValue placeholder={input.select} />
                        </SelectTrigger>
                        <SelectContent>
                           {resourceTypes.map((type) => (
                              <SelectItem key={type.value} value={type.value}>
                                 {type.label}
                              </SelectItem>
                           ))}
                        </SelectContent>
                     </Select>
                  </div>

                  {data.type === 'link' ? (
                     <div>
                        <Label>Resource</Label>
                        <Input
                           required
                           type="url"
                           name="resource"
                           value={data.resource}
                           placeholder={input.url}
                           onChange={(e) => onHandleChange(e, setData)}
                        />
                        <InputError message={errors.resource} />
                     </div>
                  ) : (
                     <div>
                        <Label>Resource</Label>

                        <ChunkedUploaderInput
                           isSubmit={isSubmit}
                           // courseId={lesson.course_id}
                           // sectionId={lesson.course_section_id}
                           filetype={data.type}
                           delayUpload={true}
                           onFileSelected={(file) => {
                              getFileMetadata(file).then((metadata) => {
                                 setData('title', metadata.name);
                              });
                           }}
                           onFileUploaded={(fileData) => {
                              setIsFileUploaded(true);
                              setData('resource_url', fileData.file_url);
                           }}
                           onError={(errors) => {
                              setIsSubmit(false);
                           }}
                           onCancelUpload={() => {
                              setIsSubmit(false);
                           }}
                        />
                     </div>
                  )}

                  <LoadingButton loading={processing || isSubmit} disabled={processing || isSubmit}>
                     {resource ? 'Update' : button.submit}
                  </LoadingButton>
               </form>
            </ScrollArea>
         </DialogContent>
      </Dialog>
   );
};

export default ResourceForm;
