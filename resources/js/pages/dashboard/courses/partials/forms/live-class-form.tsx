import { DateTimePicker } from '@/components/datetime-picker';
import InputError from '@/components/input-error';
import TiptapEditor from '@/components/text-editor/tiptap-editor';
import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { SharedData } from '@/types/global';
import { useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';

interface Props {
   title: string;
   handler: React.ReactNode;
   liveClass?: CourseLiveClass;
   courseId: string | number;
}

const LiveClassForm = ({ title, liveClass, handler, courseId }: Props) => {
   const [open, setOpen] = useState(false);
   const { props } = usePage<SharedData>();
   const { translate } = props;
   const { dashboard, input, button } = translate;

   const { data, setData, post, put, reset, errors, processing } = useForm({
      course_id: courseId,
      class_topic: liveClass?.class_topic || '',
      class_note: liveClass?.class_note || '',
      class_date_and_time: liveClass?.class_date_and_time ? new Date(liveClass.class_date_and_time) : new Date(),
   });

   const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();

      if (liveClass) {
         put(route('live-class.update', liveClass.id), {
            onSuccess: () => setOpen(false),
         });
      } else {
         post(route('live-class.store'), {
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

               <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                     <Label>{dashboard.class_topic} *</Label>
                     <Input
                        type="text"
                        value={data.class_topic}
                        onChange={(e) => setData('class_topic', e.target.value)}
                        placeholder={input.class_topic}
                        required
                     />
                     <InputError message={errors.class_topic} />
                  </div>

                  <div>
                     <Label>{dashboard.start_date_time} *</Label>
                     <DateTimePicker date={data.class_date_and_time} setDate={(date) => setData('class_date_and_time', date)} />
                     <InputError message={errors.class_date_and_time} />
                  </div>

                  <div>
                     <Label>{dashboard.class_notes}</Label>
                     <TiptapEditor
                        output="html"
                        placeholder={{
                           paragraph: input.description,
                           imageCaption: input.image_url_placeholder,
                        }}
                        contentMinHeight={256}
                        contentMaxHeight={640}
                        initialContent={data.class_note}
                        onContentChange={(value) =>
                           setData((prev) => ({
                              ...prev,
                              class_note: value as string,
                           }))
                        }
                     />
                     <InputError message={errors.class_note} />
                  </div>

                  <div className="flex justify-end gap-3">
                     <DialogClose asChild>
                        <Button type="button" variant="outline">
                           {button.cancel}
                        </Button>
                     </DialogClose>

                     <Button type="submit" disabled={processing}>
                        {processing ? dashboard.scheduling : button.schedule_class}
                     </Button>
                  </div>
               </form>
            </ScrollArea>
         </DialogContent>
      </Dialog>
   );
};

export default LiveClassForm;
