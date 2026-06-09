import ChunkedUploaderInput from '@/components/chunked-uploader-input';
import LoadingButton from '@/components/loading-button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useLang } from '@/hooks/use-lang';
import { onHandleChange } from '@/lib/inertia';
import { generatePropertyFields } from '@/lib/page';
import { useForm } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { useSectionEditor } from './context';
import Fields from './fields';

const EditForm = () => {
   const { input, button, frontend } = useLang();
   const { section, setOpen, isSubmit, setIsSubmit } = useSectionEditor();
   const [isFileSelected, setIsFileSelected] = useState(false);
   const [isFileUploaded, setIsFileUploaded] = useState(false);
   const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(section.thumbnail || null);
   const [backgroundPreview, setBackgroundPreview] = useState<string | null>(section.background_image || null);

   const { data, setData, post, reset, processing, errors } = useForm({
      title: section.title,
      sub_title: section.sub_title,
      description: section.description || '',
      thumbnail: null,
      video_url: section.video_url,
      background_image: null,
      background_color: section.background_color,
      properties: section.properties,
      active: section.active,
      sort: section.sort,
   });

   // Remove the array empty elements first
   // data.properties = { ...data.properties, array: removeEmptyArrayItems(data.properties.array) };
   const properties = generatePropertyFields(data.properties);
   const [propertyFields, setPropertyFields] = useState<PropertyField[]>(properties);

   useEffect(() => {
      setPropertyFields(generatePropertyFields(section.properties));
   }, [section]);

   const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();

      if (isFileSelected) {
         setIsSubmit(true);
         return;
      }

      submitForm();
   };

   const submitForm = () => {
      post(route('page.section.update', section.id), {
         onSuccess: () => {
            reset();
            setOpen(false);
            setIsSubmit(false);
         },
      });
   };

   useEffect(() => {
      if (data.video_url && isFileUploaded) {
         submitForm();
         reset('video_url');
         setIsFileUploaded(false);
      }
   }, [data.video_url]);

   const handlePropertyChange = (name: string, value: any) => {
      setData((data) => ({
         ...data,
         properties: {
            ...data.properties,
            [name]: value,
         },
      }));
   };

   useEffect(() => {
      if (!open) {
         reset();
      }
   }, [open]);

   return (
      <form onSubmit={handleSubmit}>
         <div className="space-y-6">
            {/* Basic section fields */}
            {section.flags.title && (
               <div className="space-y-2">
                  <Label htmlFor="title">{input.title}</Label>
                  <Input
                     type="text"
                     id="title"
                     name="title"
                     value={data.title}
                     onChange={(e) => onHandleChange(e, setData)}
                     placeholder={input.title_placeholder}
                  />
                  {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
               </div>
            )}

            {section.flags.sub_title && (
               <div className="space-y-2">
                  <Label htmlFor="sub_title">{input.sub_title}</Label>
                  <Input
                     type="text"
                     id="sub_title"
                     name="sub_title"
                     value={data.sub_title}
                     onChange={(e) => onHandleChange(e, setData)}
                     placeholder={input.title_placeholder}
                  />
                  {errors.sub_title && <p className="mt-1 text-sm text-red-600">{errors.sub_title}</p>}
               </div>
            )}

            {section.flags.description && (
               <div className="space-y-2">
                  <Label htmlFor="description">{input.description}</Label>
                  <Textarea
                     id="description"
                     name="description"
                     value={data.description || ''}
                     onChange={(e) => onHandleChange(e, setData)}
                     placeholder={input.description_placeholder}
                     rows={3}
                  />
                  {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
               </div>
            )}

            {section.flags.thumbnail && (
               <div className="space-y-2">
                  <Label htmlFor="thumbnail">{input.thumbnail}</Label>
                  <Input
                     type="file"
                     id="thumbnail"
                     name="thumbnail"
                     accept="image/*"
                     onChange={(e) => onHandleChange(e, setData, setThumbnailPreview)}
                     className="cursor-pointer"
                  />
                  {errors.thumbnail && <p className="mt-1 text-sm text-red-600">{errors.thumbnail}</p>}

                  {thumbnailPreview && (
                     <img src={thumbnailPreview} alt="Thumbnail Preview" className="h-32 w-auto rounded-lg border object-cover shadow-sm" />
                  )}
               </div>
            )}

            {section.flags.video_url && (
               <div className="space-y-2">
                  <Label htmlFor="video_url">{input.preview_video}</Label>

                  <ChunkedUploaderInput
                     isSubmit={isSubmit}
                     filetype={'video'}
                     delayUpload={false}
                     onFileSelected={(file) => {
                        setIsFileSelected(true);
                     }}
                     onFileUploaded={(fileData) => {
                        setIsFileUploaded(true);
                        setData('video_url', fileData.file_url);
                     }}
                     onError={(errors) => {
                        setIsSubmit(false);
                     }}
                     onCancelUpload={() => {
                        setIsSubmit(false);
                     }}
                  />

                  {errors.video_url && <p className="mt-1 text-sm text-red-600">{errors.video_url}</p>}
               </div>
            )}

            {section.flags.background_image && (
               <div className="space-y-2">
                  <Label htmlFor="background_image">{input.background_image}</Label>
                  <Input
                     type="file"
                     id="background_image"
                     name="background_image"
                     onChange={(e) => onHandleChange(e, setData, setBackgroundPreview)}
                  />
                  {errors.background_image && <p className="mt-1 text-sm text-red-600">{errors.background_image}</p>}

                  {backgroundPreview && (
                     <img src={backgroundPreview} alt="Background Image Preview" className="h-32 w-auto rounded-lg border object-cover shadow-sm" />
                  )}
               </div>
            )}

            {section.flags.background_color && (
               <div className="space-y-2">
                  <Label htmlFor="background_color">{input.background_color}</Label>
                  <Input
                     type="color"
                     id="background_color"
                     name="background_color"
                     value={data.background_color}
                     onChange={(e) => onHandleChange(e, setData)}
                  />
                  {errors.background_color && <p className="mt-1 text-sm text-red-600">{errors.background_color}</p>}
               </div>
            )}

            {/* Dynamic properties fields */}
            {propertyFields.length > 0 && (
               <div className="">
                  <h3 className="text-lg font-medium">{frontend.section_properties}</h3>

                  <div className="mt-4 space-y-6">
                     {propertyFields.map((field, index) => {
                        return <Fields key={`${field.name}-${index}`} field={field} onChange={(value) => handlePropertyChange(field.name, value)} />;
                     })}
                  </div>
               </div>
            )}
         </div>

         <div className="mt-8 flex justify-end">
            <LoadingButton loading={processing || isSubmit} disabled={processing || isSubmit}>
               {button.save}
            </LoadingButton>
         </div>
      </form>
   );
};

export default EditForm;
