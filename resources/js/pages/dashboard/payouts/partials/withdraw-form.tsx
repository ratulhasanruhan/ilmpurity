import InputError from '@/components/input-error';
import LoadingButton from '@/components/loading-button';
import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useLang } from '@/hooks/use-lang';
import { onHandleChange } from '@/lib/inertia';
import { useForm } from '@inertiajs/react';
import { useState } from 'react';

interface Props {
   title: string;
   handler: React.ReactNode;
}

const WithdrawForm = ({ title, handler }: Props) => {
   const [open, setOpen] = useState(false);
   const { input, button } = useLang();

   const { data, setData, post, errors, processing } = useForm({
      amount: '',
   });

   const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();

      post(route('payouts.store'), {
         onSuccess: () => setOpen(false),
      });
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
                     <Label>{input.amount}</Label>
                     <Input
                        required
                        type="number"
                        name="amount"
                        value={data.amount}
                        placeholder={input.your_amount_placeholder}
                        onChange={(e) => onHandleChange(e, setData)}
                     />
                     <InputError message={errors.amount} />
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

export default WithdrawForm;
