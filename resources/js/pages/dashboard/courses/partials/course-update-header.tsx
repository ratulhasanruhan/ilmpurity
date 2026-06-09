import InputError from '@/components/input-error';
import LoadingButton from '@/components/loading-button';
import TiptapEditor from '@/components/text-editor/tiptap-editor';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { Link, router, useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { CourseUpdateProps } from '../update';

const CourseUpdateHeader = () => {
   const [open, setOpen] = useState(false);
   const { props } = usePage<CourseUpdateProps>();
   const { translate } = props;
   const { dashboard, button, input, common } = translate;
   const user = props.auth.user;
   const { course, watchHistory, approvalStatus } = props;
   const statuses = props.statuses.filter((status) => status !== course.status);
   const { approve_able, validation_messages, counts } = approvalStatus;

   const { data, put, setData, processing, errors, reset } = useForm({
      status: '',
      feedback: '',
   });

   const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();

      put(route('course.status', { id: course.id }), {
         onSuccess: () => {
            reset();
            setOpen(false);
         },
      });
   };

   return (
      <div className="flex flex-wrap items-center gap-4 md:gap-6">
         <Button>
            <Link
               href={route('course.details', {
                  slug: course.slug,
                  id: course.id,
               })}
            >
               {button.course_preview}
            </Link>
         </Button>

         {watchHistory ? (
            <Button>
               <Link
                  href={route('course.player', {
                     type: watchHistory.current_watching_type,
                     watch_history: watchHistory.id,
                     lesson_id: watchHistory.current_watching_id,
                  })}
               >
                  {button.course_player}
               </Link>
            </Button>
         ) : approve_able ? (
            <Button onClick={() => router.post(route('player.init.watch-history'), { course_id: course.id })}>{button.course_player}</Button>
         ) : (
            <Button disabled>{button.course_player}</Button>
         )}

         <Button
            className={cn('capitalize', course.status === 'approved' ? 'bg-green-500' : course.status === 'rejected' ? 'bg-red-500' : 'bg-gray-500')}
            disabled
         >
            {course.status}
         </Button>

         {user.role === 'instructor' &&
            course.status !== 'approved' &&
            course.status !== 'pending' &&
            (approve_able ? (
               <Button onClick={() => router.put(route('course.status', { id: course.id }), { status: 'pending' })}>
                  {button.submit_for_approval}
               </Button>
            ) : (
               <Dialog open={open} onOpenChange={setOpen}>
                  <DialogTrigger>
                     <Button>{button.submit_for_approval}</Button>
                  </DialogTrigger>
                  <DialogContent>
                     <DialogHeader>
                        <DialogTitle>{dashboard.course_approval_status}</DialogTitle>
                     </DialogHeader>

                     {approve_able ? (
                        <div className="text-green-600">{dashboard.course_ready_approval}</div>
                     ) : (
                        <div className="text-red-600">
                           <h3>{dashboard.course_needs_attention}</h3>
                           <ul className="list-disc pl-5">
                              {validation_messages.map((message: string, index: number) => (
                                 <li key={index}>{message}</li>
                              ))}
                           </ul>
                        </div>
                     )}

                     <div>
                        <h3 className="text-lg font-medium">{dashboard.course_content_summary}</h3>
                        <p>
                           {dashboard.sections}: {counts.sections_count}
                        </p>
                        <p>
                           {dashboard.lessons}: {counts.lessons_count}
                        </p>
                        <p>
                           {dashboard.quizzes}: {counts.quizzes_count}
                        </p>
                        <p className="font-medium">
                           {dashboard.total_content_items}: {counts.total_content_count}
                        </p>
                     </div>
                  </DialogContent>
               </Dialog>
            ))}

         {user.role === 'admin' && (
            <Dialog>
               <DialogTrigger asChild>
                  <Button className="capitalize">{button.approval_status}</Button>
               </DialogTrigger>
               <DialogContent>
                  {/* add a form where admin can select status then write a feedback and submit */}
                  <form onSubmit={handleSubmit} className="space-y-4">
                     <div>
                        <Label>{common.status}</Label>
                        <Select required value={data.status} onValueChange={(value) => setData('status', value as any)}>
                           <SelectTrigger>
                              <SelectValue placeholder={common.select_the_approval_status} />
                           </SelectTrigger>
                           <SelectContent>
                              {statuses.map((status) => (
                                 <SelectItem key={status} value={status}>
                                    {status}
                                 </SelectItem>
                              ))}
                           </SelectContent>
                        </Select>
                        <InputError message={errors.status} />
                     </div>

                     <div className="pb-6">
                        <Label>
                           {input.feedback} {`(Optional)`}
                        </Label>
                        <TiptapEditor
                           ssr={true}
                           output="html"
                           placeholder={{
                              paragraph: input.description_placeholder,
                              imageCaption: input.image_url_placeholder,
                           }}
                           contentMinHeight={256}
                           contentMaxHeight={640}
                           initialContent={data.feedback}
                           onContentChange={(value) =>
                              setData((prev) => ({
                                 ...prev,
                                 feedback: value as string,
                              }))
                           }
                        />
                        <InputError message={errors.feedback} />
                     </div>

                     <LoadingButton loading={processing} className="w-full">
                        {button.submit}
                     </LoadingButton>
                  </form>
               </DialogContent>
            </Dialog>
         )}
      </div>
   );
};

export default CourseUpdateHeader;
