import InputError from '@/components/input-error';
import LoadingButton from '@/components/loading-button';
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
   handler: React.ReactNode;
   section?: CourseSection;
}

const SectionForm = ({ title, section, handler }: Props) => {
   const [open, setOpen] = useState(false);
   const { props } = usePage<CourseUpdateProps>();
   const { translate } = props;
   const { dashboard, input, button } = translate;

   const { data, setData, post, put, errors, processing } = useForm({
      title: section ? section.title : '',
      sort: section ? section.sort : props.lastSectionSort + 1,
      course_id: props.course.id,
   });

   const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();

      if (section) {
         put(route('section.update', { id: section.id }), {
            onSuccess: () => setOpen(false),
         });
      } else {
         post(route('section.store'), {
            onSuccess: () => setOpen(false),
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
                     <Label>{dashboard.section_title}</Label>
                     <Input
                        required
                        type="text"
                        name="title"
                        value={data.title}
                        placeholder={input.section_title_placeholder}
                        onChange={(e) => onHandleChange(e, setData)}
                     />
                     <InputError message={errors.title} />
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

export default SectionForm;
