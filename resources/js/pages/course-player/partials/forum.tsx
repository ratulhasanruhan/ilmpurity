import DeleteModal from '@/components/inertia/delete-modal';
import InputError from '@/components/input-error';
import LoadingButton from '@/components/loading-button';
import TiptapEditor from '@/components/text-editor/tiptap-editor';
import TiptapRenderer from '@/components/text-editor/tiptap-renderer/client-renderer';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { onHandleChange } from '@/lib/inertia';
import { CoursePlayerProps } from '@/types/page';
import { useForm, usePage } from '@inertiajs/react';
import { format } from 'date-fns';
import { EllipsisVertical, MessageCircle, SquarePen, Trash } from 'lucide-react';
import ForumEdit from '../forms/forum-edit';
import ForumReply from '../forms/forum-reply';

const Forum = () => {
   const { props, url } = usePage<CoursePlayerProps>();
   const { translate } = props;
   const { button, input, frontend } = translate;
   const lesson = props.watching as SectionLesson;

   const { data, setData, post, errors, processing, reset } = useForm({
      url,
      title: '',
      description: '',
      user_id: props.auth.user.id,
      course_id: props.course.id,
      section_lesson_id: props.watching.id,
   });

   const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();

      post(route('course-forums.store'), {
         onSuccess: () => {
            reset();
         },
      });
   };

   return (
      <div>
         <form onSubmit={handleSubmit} className="space-y-4 p-0.5">
            <div>
               <Label>{input.title}</Label>
               <Input
                  required
                  type="text"
                  name="title"
                  value={data.title}
                  placeholder={input.title_placeholder}
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
                     paragraph: input.description,
                     imageCaption: input.image_url_placeholder,
                  }}
                  contentMinHeight={160}
                  contentMaxHeight={400}
                  initialContent={data.description}
                  onContentChange={(value) => setData('description', value as string)}
               />
               <InputError message={errors.description} />
            </div>

            <LoadingButton loading={processing}>{button.submit}</LoadingButton>
         </form>

         <Separator className="my-6" />

         {lesson.forums.map((forum) => (
            <div key={forum.id} className="space-y-4 rounded-lg border p-6">
               <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                     <Avatar className="h-8 w-8">
                        <AvatarImage src={forum.user.photo || ''} alt={forum.user.name} className="object-cover" />
                        <AvatarFallback>{forum.user.name.charAt(0)}</AvatarFallback>
                     </Avatar>
                     <div>
                        <p className="font-semibold">{forum.user.name}</p>
                        <p className="text-muted-foreground text-xs">{format(new Date(forum.created_at), 'MMM d, yyyy h:mm a')}</p>
                     </div>
                  </div>

                  {forum.user_id === props.auth.user.id && (
                     <DropdownMenu>
                        <DropdownMenuTrigger>
                           <Button variant="secondary" size="icon" className="size-8">
                              <EllipsisVertical />
                           </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                           <DropdownMenuItem asChild>
                              <ForumEdit url={url} forum={forum} />
                           </DropdownMenuItem>
                           <DropdownMenuItem asChild>
                              <DeleteModal
                                 routePath={route('course-forums.destroy', forum.id)}
                                 actionComponent={
                                    <Button size="sm" variant="ghost" className="w-full cursor-pointer justify-start px-2">
                                       <Trash className="h-4 w-4" />
                                       <span>{button.delete}</span>
                                    </Button>
                                 }
                              />
                           </DropdownMenuItem>
                        </DropdownMenuContent>
                     </DropdownMenu>
                  )}
               </div>
               <div>
                  <p className="text-lg font-medium">{forum.title}</p>
                  <TiptapRenderer>{forum.description}</TiptapRenderer>
               </div>
               <div className="flex items-center justify-between">
                  <ForumReply
                     url={url}
                     forum={forum}
                     user={props.auth.user}
                     actionComponent={
                        <Button variant="outline" size="sm" className="flex items-center gap-2 shadow-none">
                           <MessageCircle className="h-4 w-4" />
                           <span>{button.reply}</span>
                        </Button>
                     }
                  />

                  <p className="text-muted-foreground text-xs">
                     {forum.replies.length} {frontend.replies}
                  </p>
               </div>

               <Separator className="my-6" />

               <div className="space-y-8 pl-6">
                  {forum.replies.map((reply) => (
                     <div key={reply.id} className="space-y-2">
                        <div className="flex items-center justify-between">
                           <div className="flex items-center gap-2">
                              <Avatar className="h-8 w-8">
                                 <AvatarImage src={reply.user.photo || ''} alt={reply.user.name} className="object-cover" />
                                 <AvatarFallback>{reply.user.name.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <div>
                                 <p className="font-semibold">{reply.user.name}</p>
                                 <p className="text-muted-foreground text-xs">{format(new Date(reply.created_at), 'MMM d, yyyy h:mm a')}</p>
                              </div>
                           </div>

                           {reply.user_id === props.auth.user.id && (
                              <DropdownMenu>
                                 <DropdownMenuTrigger>
                                    <Button variant="secondary" size="icon" className="size-8">
                                       <EllipsisVertical />
                                    </Button>
                                 </DropdownMenuTrigger>
                                 <DropdownMenuContent align="end">
                                    <DropdownMenuItem asChild>
                                       <ForumReply
                                          url={url}
                                          forum={forum}
                                          reply={reply}
                                          user={props.auth.user}
                                          actionComponent={
                                             <Button size="sm" variant="ghost" className="w-full cursor-pointer justify-start px-2">
                                                <SquarePen className="h-4 w-4" />
                                                <span>{button.edit}</span>
                                             </Button>
                                          }
                                       />
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild>
                                       <DeleteModal
                                          routePath={route('course-forum-replies.destroy', reply.id)}
                                          actionComponent={
                                             <Button size="sm" variant="ghost" className="w-full cursor-pointer justify-start px-2">
                                                <Trash className="h-4 w-4" />
                                                <span>Delete</span>
                                             </Button>
                                          }
                                       />
                                    </DropdownMenuItem>
                                 </DropdownMenuContent>
                              </DropdownMenu>
                           )}
                        </div>

                        <TiptapRenderer>{reply.description}</TiptapRenderer>
                     </div>
                  ))}
               </div>
            </div>
         ))}
      </div>
   );
};

export default Forum;
