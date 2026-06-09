import ChunkedUploaderInput from '@/components/chunked-uploader-input';
import InputError from '@/components/input-error';
import LoadingButton from '@/components/loading-button';
import Tabs from '@/components/tabs';
import TiptapEditor from '@/components/text-editor/tiptap-editor';
import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { getFileMetadata } from '@/lib/file-metadata';
import { onHandleChange } from '@/lib/inertia';
import { cn } from '@/lib/utils';
import { useForm, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { CourseUpdateProps } from '../../update';

const getLessonTypes = (translate: any) => [
   // { value: 'vimeo', label: 'Vimeo Video', flag: true },
   // { value: 'drive', label: 'Google drive video', flag: true },
   { value: 'video', label: translate.dashboard.video_file, flag: false },
   { value: 'video_url', label: translate.dashboard.video_url, flag: false },
   { value: 'document', label: translate.dashboard.document_file, flag: false },
   { value: 'image', label: translate.dashboard.image_file, flag: false },
   { value: 'text', label: translate.dashboard.text_content, flag: false },
   { value: 'embed', label: translate.dashboard.embed_source, flag: false },
];

interface Props {
   title: string;
   lesson?: SectionLesson;
   handler: React.ReactNode;
   sectionId: string | number;
}

const LessonForm = ({ title, handler, lesson, sectionId }: Props) => {
   const [open, setOpen] = useState(false);
   const [isSubmit, setIsSubmit] = useState(false);
   const [lessonType, setLessonType] = useState('type');
   const [isFileSelected, setIsFileSelected] = useState(false);
   const [isFileUploaded, setIsFileUploaded] = useState(false);

   const { props } = usePage<CourseUpdateProps>();
   const { translate } = props;
   const { dashboard, input, button } = translate;

   const lessonTypes = getLessonTypes(translate);

   const { data, setData, post, put, reset, processing, errors, clearErrors } = useForm({
      title: lesson ? lesson.title : '',
      status: lesson ? lesson.status : '',
      is_free: lesson ? lesson.is_free : 0,
      description: lesson ? lesson.description : '',
      sort: lesson ? lesson.sort : props.lastLessonSort + 1,
      lesson_type: lesson ? lesson.lesson_type : 'video',
      lesson_provider: lesson ? lesson.lesson_provider : '',
      lesson_src: lesson ? lesson.lesson_src : '',
      lesson_src_new: null,
      embed_source: lesson ? lesson.embed_source : '',
      duration: lesson ? lesson.duration : '00:00:00',
      summary: lesson ? lesson.summary : '',
      course_id: lesson ? lesson.course_id : props.course.id,
      course_section_id: sectionId,
   });

   const isFileUpload = ['video', 'document', 'image'].includes(data.lesson_type);

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();

      if (isFileUpload && isFileSelected) {
         setIsSubmit(true);
         return;
      }

      submitForm();
   };

   const submitForm = () => {
      clearErrors();

      if (lesson) {
         put(route('lesson.update', { id: lesson.id }), {
            preserveScroll: true,
            onSuccess: () => {
               reset();
               setOpen(false);
               setIsSubmit(false);
            },
         });
      } else {
         post(route('lesson.store'), {
            preserveScroll: true,
            onSuccess: () => {
               reset();
               setOpen(false);
               setIsSubmit(false);
            },
         });
      }
   };

   useEffect(() => {
      if (data.lesson_src_new && isFileUploaded) {
         submitForm();
         reset('lesson_src_new');
         setIsFileUploaded(false);
      }
   }, [data.lesson_src_new]);

   useEffect(() => {
      if (!open) {
         reset();
         setLessonType('type');
      }
   }, [open]);

   const onDurationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;

      // Ensure the value is in the HH:mm:ss format
      const formattedTime = value.match(/^([0-2]?[0-9]):([0-5]?[0-9]):([0-5]?[0-9])$/);

      if (formattedTime) {
         setData('duration', value);
      }
   };

   return (
      <Dialog open={open} onOpenChange={() => (isSubmit ? setOpen(true) : setOpen((prev) => !prev))}>
         <DialogTrigger>{handler}</DialogTrigger>

         <DialogContent className="p-0">
            <ScrollArea className="max-h-[90vh] p-6">
               <DialogHeader className="mb-6">
                  <DialogTitle>{title}</DialogTitle>
               </DialogHeader>

               <form onSubmit={handleSubmit}>
                  <Tabs value={lesson ? 'form' : lessonType} onValueChange={setLessonType}>
                     <TabsContent value="type">
                        <div className="space-y-1">
                           <Label className="font-semibold">{input.lesson_type}</Label>
                           <RadioGroup
                              value={data.lesson_type}
                              onValueChange={(lesson) => setData('lesson_type', lesson)}
                              className="grid grid-cols-2 gap-3"
                           >
                              {lessonTypes.map((type) => (
                                 <Label
                                    key={type.value}
                                    className={cn(
                                       'flex items-center space-x-2 rounded-lg border p-2',
                                       type.flag ? 'cursor-not-allowed' : 'cursor-pointer',
                                    )}
                                 >
                                    <RadioGroupItem className="cursor-pointer" value={type.value} disabled={type.flag} />
                                    <span>{type.label}</span>
                                 </Label>
                              ))}
                           </RadioGroup>
                        </div>
                     </TabsContent>

                     <TabsContent value="form" className="space-y-4 p-0.5">
                        <div>
                           <Label>{input.title} *</Label>
                           <Input required name="title" value={data.title} placeholder={input.title} onChange={(e) => onHandleChange(e, setData)} />
                           <InputError message={errors.title} />
                        </div>

                        {/* Conditional Fields */}
                        {['video_url'].includes(data.lesson_type) && (
                           <>
                              <div>
                                 <Label htmlFor="lesson_provider">{input.video_url_provider}</Label>
                                 <Select
                                    required
                                    name="lesson_provider"
                                    value={data.lesson_provider}
                                    onValueChange={(provider) => setData('lesson_provider', provider)}
                                 >
                                    <SelectTrigger className="w-full">
                                       <SelectValue placeholder={input.provider_placeholder} />
                                    </SelectTrigger>
                                    <SelectContent>
                                       <SelectItem value="youtube">YouTube</SelectItem>
                                    </SelectContent>
                                 </Select>
                              </div>

                              <div>
                                 <Label>
                                    Video URL
                                    <span className="text-xs text-gray-500">(Provide the shareable url only)</span>
                                 </Label>
                                 <Input
                                    required
                                    name="lesson_src"
                                    value={data.lesson_src || ''}
                                    placeholder={`Type your ${data.lesson_provider} video url`}
                                    onChange={(e) => onHandleChange(e, setData)}
                                 />
                                 <InputError message={errors.lesson_src} />
                              </div>
                           </>
                        )}

                        {['video', 'document', 'image'].includes(data.lesson_type) && (
                           <div>
                              <Label>
                                 {input.select} {data.lesson_type}
                              </Label>

                              <ChunkedUploaderInput
                                 isSubmit={isSubmit}
                                 courseId={data.course_id || ''}
                                 sectionId={data.course_section_id || ''}
                                 filetype={data.lesson_type}
                                 delayUpload={true}
                                 onFileSelected={(file) => {
                                    setIsFileSelected(true);
                                    getFileMetadata(file).then((metadata) => {
                                       setData('title', metadata.name);
                                       setData('duration', metadata.duration || '00:00:00');
                                    });
                                 }}
                                 onFileUploaded={(fileData) => {
                                    setIsFileUploaded(true);
                                    setData('lesson_src_new', fileData.file_url);
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

                        {data.lesson_type === 'embed' && (
                           <div>
                              <Label>
                                 Embed source
                                 <span className="text-xs text-gray-500">(Provide the source url only)</span>
                              </Label>
                              <Textarea
                                 required
                                 name="embed_source"
                                 placeholder={input.embed_source_placeholder}
                                 value={data.embed_source}
                                 rows={4}
                                 onChange={(e) => onHandleChange(e, setData)}
                              />
                              <InputError message={errors.embed_source} />
                           </div>
                        )}

                        {data.lesson_type === 'text' && (
                           <div>
                              <Label>{input.your_text}</Label>
                              <TiptapEditor
                                 ssr={true}
                                 output="html"
                                 placeholder={{
                                    paragraph: 'Type your content here...',
                                    imageCaption: 'Type caption for image (optional)',
                                 }}
                                 contentMinHeight={256}
                                 contentMaxHeight={640}
                                 initialContent={data.lesson_src}
                                 onContentChange={(value) =>
                                    setData((prev) => ({
                                       ...prev,
                                       lesson_src: value as string,
                                    }))
                                 }
                              />
                              <InputError message={errors.lesson_src} />
                           </div>
                        )}

                        {['video_url', 'video'].includes(data.lesson_type) && (
                           <div>
                              <Label htmlFor="duration">{input.duration}</Label>
                              <Input
                                 required
                                 maxLength={8}
                                 type="text"
                                 name="duration"
                                 value={data.duration}
                                 placeholder="00:00:00"
                                 onChange={onDurationChange}
                                 readOnly={data.lesson_type === 'video'}
                              />
                              <InputError message={errors.duration} />
                           </div>
                        )}

                        <div>
                           <Label htmlFor="summary">Summary</Label>
                           <TiptapEditor
                              ssr={true}
                              output="html"
                              placeholder={{
                                 paragraph: 'Type your content here...',
                                 imageCaption: 'Type caption for image (optional)',
                              }}
                              contentMinHeight={256}
                              contentMaxHeight={640}
                              initialContent={data.summary}
                              onContentChange={(value) => setData('summary', value as string)}
                           />
                           <InputError message={errors.summary} />
                        </div>

                        <div>
                           <Label>Lesson type</Label>
                           <RadioGroup
                              required
                              defaultValue={data.is_free ? 'free' : 'paid'}
                              className="flex items-center space-x-4 pt-2 pb-1"
                              onValueChange={(value) => setData('is_free', value === 'free' ? 1 : 0)}
                           >
                              {props.prices.map((price) => (
                                 <div key={price} className="flex items-center space-x-2">
                                    <RadioGroupItem className="cursor-pointer" id={price} value={price} />
                                    <Label htmlFor={price} className="capitalize">
                                       {price}
                                    </Label>
                                 </div>
                              ))}
                           </RadioGroup>
                           <InputError message={errors.is_free} />
                        </div>
                     </TabsContent>
                     <DialogFooter className="w-full justify-between space-x-2 pt-8">
                        <div className="flex w-full items-center gap-4">
                           <DialogClose asChild>
                              <Button type="button" variant="outline">
                                 {button.close}
                              </Button>
                           </DialogClose>

                           {!lesson && (
                              <TabsList className="p-0">
                                 <TabsTrigger asChild value="form" className={cn(lessonType === 'form' ? 'hidden' : 'block')}>
                                    <Button>{button.next}</Button>
                                 </TabsTrigger>

                                 <TabsTrigger asChild value="type" className={cn(lessonType === 'type' ? 'hidden' : 'block')}>
                                    <Button>{button.back}</Button>
                                 </TabsTrigger>
                              </TabsList>
                           )}
                        </div>

                        {(lesson || lessonType === 'form') && (
                           <LoadingButton loading={processing || isSubmit} disabled={processing || isSubmit}>
                              {isSubmit ? 'Uploading...' : button.submit}
                           </LoadingButton>
                        )}
                     </DialogFooter>
                  </Tabs>
               </form>
            </ScrollArea>
         </DialogContent>
      </Dialog>
   );
};

export default LessonForm;
