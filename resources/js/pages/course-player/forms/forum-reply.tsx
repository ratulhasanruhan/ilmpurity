import InputError from '@/components/input-error';
import LoadingButton from '@/components/loading-button';
import TiptapEditor from '@/components/text-editor/tiptap-editor';
import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';

interface Props {
   url: string;
   user: User;
   forum: CourseForum;
   reply?: CourseForumReply;
   actionComponent: React.ReactNode;
}

const ForumReply = ({ url, user, forum, reply, actionComponent }: Props) => {
   const [open, setOpen] = useState(false);
   const { props } = usePage();
   const { translate } = props as any;
   const { button, input, frontend } = translate;

   const { data, setData, post, put, errors, processing, reset } = useForm({
      url,
      user_id: user.id,
      course_id: forum.course_id,
      course_forum_id: forum.id,
      course_forum_user_id: forum.user_id,
      description: reply ? reply.description : '',
   });

   const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();

      if (reply) {
         put(route('course-forum-replies.update', reply.id), {
            onSuccess: () => {
               reset();
               setOpen(false);
            },
         });
      } else {
         post(route('course-forum-replies.store'), {
            onSuccess: () => {
               reset();
               setOpen(false);
            },
         });
      }
   };

   return (
      <Dialog open={open} onOpenChange={setOpen}>
         <DialogTrigger asChild>{actionComponent}</DialogTrigger>

         <DialogContent>
            <DialogHeader>
               <DialogTitle>
                  {reply ? button.edit : button.add} {frontend.forum_reply}
               </DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4 p-0.5">
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
                  <LoadingButton loading={processing}>{reply ? button.update : button.submit}</LoadingButton>

                  <DialogClose asChild>
                     <Button variant="outline">{button.cancel}</Button>
                  </DialogClose>
               </DialogFooter>
            </form>
         </DialogContent>
      </Dialog>
   );
};

export default ForumReply;
