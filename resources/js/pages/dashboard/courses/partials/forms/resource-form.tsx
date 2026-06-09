import ChunkedUploaderInput from '@/components/chunked-uploader-input';
import InputError from '@/components/input-error';
import LoadingButton from '@/components/loading-button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getFileMetadata } from '@/lib/file-metadata';
import { onHandleChange } from '@/lib/inertia';
import { useForm, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { CourseUpdateProps } from '../../update';

interface Props {
   lesson: SectionLesson;
   resource?: LessonResource;
   isSubmit: boolean;
   setIsSubmit: (value: boolean) => void;
   setIsOpen: (value: boolean) => void;
}

const ResourceForm = ({ lesson, resource, isSubmit, setIsSubmit, setIsOpen }: Props) => {
   const [isFileUploaded, setIsFileUploaded] = useState(false);

   const { props } = usePage<CourseUpdateProps>();
   const { translate } = props;
   const { input, button } = translate;

   const { data, setData, post, put, reset, processing, errors, clearErrors } = useForm({
      title: resource ? resource.title : '',
      type: resource ? resource.type : 'document',
      resource: resource ? resource.resource : '',
      resource_url: null,
      section_lesson_id: lesson.id,
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
         put(route('resources.update', resource.id), {
            preserveScroll: true,
            onSuccess: () => {
               reset();
               setIsSubmit(false);
               setIsOpen(true);
            },
         });
      } else {
         post(route('resources.store'), {
            preserveScroll: true,
            onSuccess: () => {
               reset();
               setIsSubmit(false);
               setIsOpen(true);
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
                  courseId={lesson.course_id}
                  sectionId={lesson.course_section_id}
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
   );
};

export default ResourceForm;
