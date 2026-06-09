import InputError from '@/components/input-error';
import LoadingButton from '@/components/loading-button';
import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLang } from '@/hooks/use-lang';
import { useForm } from '@inertiajs/react';
import { Send } from 'lucide-react';
import { useState } from 'react';

const NewsletterSend = ({ id, translate }: { id: string | number; translate?: LanguageTranslations }) => {
   const [open, setOpen] = useState(false);
   const { dashboard, button } = useLang();

   const { data, setData, post, errors, processing } = useForm({
      user_type: '',
      newsletter_id: id,
   });

   const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();

      post(route('newsletters.send'), {
         onSuccess: () => setOpen(false),
      });
   };

   const users = [
      { title: dashboard.all, value: 'all' },
      { title: dashboard.student, value: 'student' },
      { title: button.instructor, value: 'instructor' },
   ];

   return (
      <Dialog open={open} onOpenChange={setOpen}>
         <DialogTrigger>
            <Button size="icon" variant="secondary" className="h-7 w-7">
               <Send className="h-3 w-3" />
            </Button>
         </DialogTrigger>

         <DialogContent className="p-0">
            <ScrollArea className="max-h-[90vh] p-6">
               <DialogHeader className="mb-6">
                  <DialogTitle>{dashboard.send_newsletter}</DialogTitle>
               </DialogHeader>

               <form onSubmit={handleSubmit} className="space-y-4 p-0.5">
                  <div>
                     <Label>{dashboard.send_to}</Label>
                     <Select value={data.user_type} onValueChange={(value) => setData('user_type', value)}>
                        <SelectTrigger>
                           <SelectValue placeholder={dashboard.select_user_type} />
                        </SelectTrigger>
                        <SelectContent>
                           {users.map(({ title, value }) => (
                              <SelectItem key={value} value={value} className="capitalize">
                                 {title}
                              </SelectItem>
                           ))}
                        </SelectContent>
                     </Select>
                     <InputError message={errors.user_type} />
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

export default NewsletterSend;
