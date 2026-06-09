import InputError from '@/components/input-error';
import LoadingButton from '@/components/loading-button';
import TiptapEditor from '@/components/text-editor/tiptap-editor';
import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { onHandleChange } from '@/lib/inertia';
import { useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { CourseUpdateProps } from '../../update';

interface Props {
   title: string;
   quiz?: SectionQuiz;
   handler: React.ReactNode;
   sectionId: string | number;
}

const QuizForm = ({ title, quiz, handler, sectionId }: Props) => {
   const [open, setOpen] = useState(false);
   const { props } = usePage<CourseUpdateProps>();
   const { translate } = props;
   const { dashboard, input, button } = translate;

   const { data, setData, post, put, reset, errors, processing } = useForm({
      title: quiz?.title || '',
      course_section_id: sectionId,
      course_id: props.course.id,
      total_mark: quiz?.total_mark || '',
      pass_mark: quiz?.pass_mark || '',
      retake: quiz?.retake || 1,
      summary: quiz?.summary || '',
      hours: quiz?.hours || '',
      minutes: quiz?.minutes || '',
      seconds: quiz?.seconds || '',
   });

   const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();

      if (quiz) {
         put(route('quiz.update', quiz.id), {
            onSuccess: () => {
               reset();
               setOpen(false);
            },
         });
      } else {
         post(route('quiz.store'), {
            onSuccess: () => {
               reset();
               setOpen(false);
            },
         });
      }
   };

   return (
      <Dialog open={open} onOpenChange={setOpen}>
         <DialogTrigger>{handler}</DialogTrigger>

         <DialogContent className="p-0">
            <ScrollArea className="max-h-[90vh] p-6">
               <DialogHeader className="mb-6">
                  <DialogTitle>{title}</DialogTitle>
               </DialogHeader>

               <form onSubmit={handleSubmit} className="space-y-4 p-0.5">
                  <div>
                     <Label>{input.title}</Label>
                     <Input
                        required
                        type="text"
                        name="title"
                        value={data.title}
                        placeholder={input.quiz_title_placeholder}
                        onChange={(e) => onHandleChange(e, setData)}
                     />
                     <InputError message={errors.title} />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                     <div>
                        <Label>{dashboard.hours}</Label>
                        <Input
                           required
                           type="number"
                           name="hours"
                           value={data.hours}
                           placeholder={input.hours_placeholder}
                           onChange={(e) => onHandleChange(e, setData)}
                        />
                        <InputError message={errors.hours} />
                     </div>
                     <div>
                        <Label>{dashboard.minutes}</Label>
                        <Input
                           required
                           type="number"
                           name="minutes"
                           value={data.minutes}
                           placeholder={input.minutes_placeholder}
                           onChange={(e) => onHandleChange(e, setData)}
                        />
                        <InputError message={errors.minutes} />
                     </div>
                     <div>
                        <Label>{dashboard.seconds}</Label>
                        <Input
                           required
                           type="number"
                           name="seconds"
                           value={data.seconds}
                           placeholder={input.seconds_placeholder}
                           onChange={(e) => onHandleChange(e, setData)}
                        />
                        <InputError message={errors.seconds} />
                     </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                     <div>
                        <Label>{dashboard.total_mark}</Label>
                        <Input required type="number" name="total_mark" value={data.total_mark} onChange={(e) => onHandleChange(e, setData)} />
                        <InputError message={errors.total_mark} />
                     </div>
                     <div>
                        <Label>{dashboard.pass_mark}</Label>
                        <Input required type="number" name="pass_mark" value={data.pass_mark} onChange={(e) => onHandleChange(e, setData)} />
                        <InputError message={errors.pass_mark} />
                     </div>
                     <div>
                        <Label>{input.retake_attempts}</Label>
                        <Input
                           min="1"
                           required
                           type="number"
                           name="retake"
                           value={data.retake}
                           placeholder="00"
                           onChange={(e) => onHandleChange(e, setData)}
                        />
                        <InputError message={errors.retake} />
                     </div>
                  </div>

                  <div>
                     <Label htmlFor="summary">{dashboard.quiz_summary}</Label>
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
                        onContentChange={(value) =>
                           setData((prev) => ({
                              ...prev,
                              summary: value as string,
                           }))
                        }
                     />
                     <InputError message={errors.summary} />
                  </div>

                  <DialogFooter className="flex justify-end space-x-2 pt-4">
                     <DialogClose asChild>
                        <Button type="button" variant="outline">
                           {button.close}
                        </Button>
                     </DialogClose>

                     <LoadingButton loading={processing}>{button.submit}</LoadingButton>
                  </DialogFooter>
               </form>
            </ScrollArea>
         </DialogContent>
      </Dialog>
   );
};

export default QuizForm;
