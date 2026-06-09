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
import { ExamUpdateProps } from '../update';

const ExamUpdateHeader = () => {
   const [open, setOpen] = useState(false);
   const { props } = usePage<ExamUpdateProps>();

   const user = props.auth.user;
   const { exam } = props;
   const statuses = ['draft', 'published', 'archived'].filter((status) => status !== exam.status);

   const { data, post, setData, processing, errors, reset } = useForm({
      tab: 'status',
      status: '',
      feedback: '',
   });

   const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();

      post(route('exams.update', exam.id), {
         onSuccess: () => {
            reset();
            setOpen(false);
         },
      });
   };

   return (
      <div className="flex flex-wrap items-center gap-4 md:gap-6">
         <Button>
            <Link href={route('exams.details', { slug: exam.slug, id: exam.id })}>View Exam</Link>
         </Button>

         <Button
            className={cn(
               'capitalize',
               exam.status === 'published'
                  ? 'bg-green-500 hover:bg-green-600'
                  : exam.status === 'archived'
                    ? 'bg-red-500 hover:bg-red-600'
                    : 'bg-gray-500 hover:bg-gray-600',
            )}
            disabled
         >
            {exam.status}
         </Button>

         {user.role === 'instructor' && exam.status !== 'published' && (
            <Button onClick={() => router.put(route('exams.status', { exam: exam.id }), { status: 'published' })}>Submit for Review</Button>
         )}

         {user.role === 'admin' && (
            <Dialog open={open} onOpenChange={setOpen}>
               <DialogTrigger asChild>
                  <Button className="capitalize">Change Status</Button>
               </DialogTrigger>
               <DialogContent>
                  <DialogHeader>
                     <DialogTitle>Change Exam Status</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleSubmit} className="space-y-4">
                     <div>
                        <Label>Status</Label>
                        <Select required value={data.status} onValueChange={(value) => setData('status', value as any)}>
                           <SelectTrigger>
                              <SelectValue placeholder="Select status" />
                           </SelectTrigger>
                           <SelectContent>
                              {statuses.map((status) => (
                                 <SelectItem key={status} value={status} className="capitalize">
                                    {status}
                                 </SelectItem>
                              ))}
                           </SelectContent>
                        </Select>
                        <InputError message={errors.status} />
                     </div>

                     <div className="pb-6">
                        <Label>
                           Feedback <span className="text-gray-500">(Optional)</span>
                        </Label>
                        <TiptapEditor
                           ssr={true}
                           output="html"
                           placeholder={{
                              paragraph: 'Enter feedback for instructor...',
                              imageCaption: 'Enter image caption...',
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
                        Update Status
                     </LoadingButton>
                  </form>
               </DialogContent>
            </Dialog>
         )}
      </div>
   );
};

export default ExamUpdateHeader;
