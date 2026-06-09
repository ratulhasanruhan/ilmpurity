import InputError from '@/components/input-error';
import LoadingButton from '@/components/loading-button';
import TiptapEditor from '@/components/text-editor/tiptap-editor';
import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { onHandleChange } from '@/lib/inertia';
import { useForm, usePage } from '@inertiajs/react';
import { SquarePen } from 'lucide-react';
import { useState } from 'react';

const ForumEdit = ({ url, forum }: { url: string; forum: CourseForum }) => {
   const [open, setOpen] = useState(false);
   const { props } = usePage();
   const { translate } = props as any;
   const { button, input, frontend } = translate;

   const { data, setData, put, errors, processing, reset } = useForm({
      url,
      title: forum.title,
      description: forum.description,
   });

   const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();

      put(route('course-forums.update', forum.id), {
         onSuccess: () => {
            reset();
            setOpen(false);
         },
      });
   };

   return (
      <Dialog open={open} onOpenChange={setOpen}>
         <DialogTrigger asChild>
            <Button size="sm" variant="ghost" className="w-full cursor-pointer justify-start px-2">
               <SquarePen className="h-4 w-4" />
               <span>{button.edit}</span>
            </Button>
         </DialogTrigger>

         <DialogContent>
            <DialogHeader>
               <DialogTitle>{frontend.edit_forum_question}</DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4 p-0.5">
               <div>
                  <Label>{input.question_title}</Label>
                  <Input
                     required
                     type="text"
                     name="title"
                     value={data.title}
                     placeholder={input.question_title_placeholder}
                     onChange={(e) => onHandleChange(e, setData)}
                  />
                  <InputError message={errors.title} />
               </div>

               <div>
                  <Label>{input.description}</Label>
                  <TiptapEditor
                     ssr={true}
                     output="html"
                     placeholder={{
                        paragraph: input.content_placeholder,
                        imageCaption: input.image_caption_placeholder,
                     }}
                     contentMinHeight={260}
                     contentMaxHeight={600}
                     initialContent={data.description}
                     onContentChange={(value) => setData('description', value as string)}
                  />
                  <InputError message={errors.description} />
               </div>

               <DialogFooter>
                  <LoadingButton loading={processing}>{button.update}</LoadingButton>

                  <DialogClose asChild>
                     <Button variant="outline">{button.cancel}</Button>
                  </DialogClose>
               </DialogFooter>
            </form>
         </DialogContent>
      </Dialog>
   );
};

export default ForumEdit;
