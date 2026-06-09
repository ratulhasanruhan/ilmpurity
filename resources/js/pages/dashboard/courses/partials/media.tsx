import ChunkedUploaderInput from '@/components/chunked-uploader-input';
import InputError from '@/components/input-error';
import LoadingButton from '@/components/loading-button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import VideoPlayer from '@/components/video-player';
import DashboardLayout from '@/layouts/dashboard/layout';
import { onHandleChange } from '@/lib/inertia';
import { useForm, usePage } from '@inertiajs/react';
import { ReactNode, useEffect, useMemo, useState } from 'react';
import { CourseUpdateProps } from '../update';

const Media = () => {
   const { props } = usePage<CourseUpdateProps>();
   const { translate } = props;
   const { dashboard, input, button } = translate;
   const { tab, course } = props;

   const [isSubmit, setIsSubmit] = useState(false);
   const [isFileSelected, setIsFileSelected] = useState(false);
   const [isFileUploaded, setIsFileUploaded] = useState(false);

   const [previewBanner, setPreviewBanner] = useState(course.banner);
   const [thumbnailBanner, setThumbnailBanner] = useState(course.thumbnail);

   const { data, setData, post, errors, reset, processing } = useForm({
      tab: tab,
      thumbnail: null,
      banner: null,
      preview: course.preview,
      preview_type: 'video_url',
   });

   // Memoize the entire VideoPlayer component to prevent re-renders
   const memoizedVideoPlayer = useMemo(() => {
      if (!course.preview) return null;

      return (
         <Card className="mt-2 flex max-h-[580px] items-center justify-center !overflow-hidden border-none">
            <VideoPlayer
               source={{
                  type: 'video' as const,
                  sources: [
                     {
                        src: course.preview || '',
                        type: 'video/mp4' as const,
                     },
                  ],
               }}
            />
         </Card>
      );
   }, [course.preview]);

   // Handle form submission
   const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();

      if (isFileSelected) {
         setIsSubmit(true);
         return;
      }

      submitForm();
   };

   const submitForm = () => {
      post(route('courses.update', { id: course.id }), {
         onSuccess() {
            reset();
         },
      });
   };

   useEffect(() => {
      if (isSubmit && data.preview && isFileUploaded) {
         submitForm();
         reset();
         setIsSubmit(false);
         setIsFileUploaded(false);
      }
   }, [isSubmit, data.preview]);

   return (
      <Card className="container p-4 sm:p-6">
         <form onSubmit={handleSubmit} className="space-y-4">
            <div>
               <Label>{dashboard.thumbnail}</Label>
               <Input type="file" name="thumbnail" onChange={(e) => onHandleChange(e, setData, setThumbnailBanner)} />
               <InputError message={errors.thumbnail} />

               <img src={thumbnailBanner || '/assets/images/blank-image.jpg'} alt="" className="mt-2 w-full max-w-sm rounded-md" />
            </div>

            <div>
               <Label>{dashboard.banner}</Label>
               <Input type="file" name="banner" onChange={(e) => onHandleChange(e, setData, setPreviewBanner)} />
               <InputError message={errors.banner} />

               <img src={previewBanner || '/assets/images/blank-image.jpg'} alt="" className="mt-2 w-full max-w-sm rounded-md" />
            </div>

            <Separator />

            <div>
               <Label>{dashboard.preview_video_type}</Label>
               <RadioGroup
                  defaultValue={data.preview_type}
                  onValueChange={(value) => setData('preview_type', value)}
                  className="flex flex-wrap items-center gap-5 pt-3"
               >
                  <div className="flex items-center space-x-2">
                     <RadioGroupItem className="cursor-pointer" id="video_url" value="video_url" />
                     <Label htmlFor="video_url" className="capitalize">
                        {dashboard.video_url}
                     </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                     <RadioGroupItem className="cursor-pointer" id="video" value="video" />
                     <Label htmlFor="video" className="capitalize">
                        {dashboard.video_file}
                     </Label>
                  </div>
               </RadioGroup>
               <InputError message={errors.preview_type} />
            </div>

            <div>
               <Label>Preview Video</Label>
               {data.preview_type === 'video_url' ? (
                  <Input
                     type="url"
                     name="preview"
                     value={data.preview}
                     placeholder={input.video_url_placeholder}
                     onChange={(e) => onHandleChange(e, setData)}
                  />
               ) : (
                  <ChunkedUploaderInput
                     isSubmit={isSubmit}
                     courseId={course.id || ''}
                     sectionId={course.course_section_id || ''}
                     filetype={data.preview_type}
                     delayUpload={true}
                     onFileSelected={(file) => {
                        setIsFileSelected(true);
                     }}
                     onFileUploaded={(fileData) => {
                        setIsFileUploaded(true);
                        setData('preview', fileData.file_url);
                     }}
                     onError={(errors) => {
                        setIsSubmit(false);
                     }}
                     onCancelUpload={() => {
                        setIsSubmit(false);
                     }}
                  />
               )}
               <InputError message={errors.preview} />
               <p className="text-xs text-gray-500">
                  {data.preview_type === 'video_url' ? 'Supported URL: youtube or vimeo' : 'Supported Video file: .mp4 or .webm or .ogg'}
               </p>

               {/* <video src={course.preview}></video> */}
               {memoizedVideoPlayer}
            </div>

            <div className="mt-8">
               <LoadingButton loading={processing || isSubmit} disabled={processing || isSubmit}>
                  {button.save_changes}
               </LoadingButton>
            </div>
         </form>
      </Card>
   );
};

Media.layout = (page: ReactNode) => <DashboardLayout children={page} />;

export default Media;
