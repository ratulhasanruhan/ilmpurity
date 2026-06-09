import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { SharedData } from '@/types/global';
import { router, usePage } from '@inertiajs/react';
import { useState } from 'react';

interface Props {
   message?: string;
   routePath: string;
   actionComponent: React.ReactNode;
}

const DeleteModal = (props: Props) => {
   const page = usePage<SharedData>();
   const { button, frontend } = page.props.translate;

   const { message, routePath, actionComponent } = props;
   const [modal, setModal] = useState<boolean>(false);

   const handleOpen = () => {
      setModal((prev) => !prev);
   };

   const deleteHandler = () => {
      router.delete(routePath, {
         preserveScroll: true,
         onSuccess: () => {
            setModal(false);
         },
      });
   };

   return (
      <Dialog open={modal} onOpenChange={setModal}>
         <DialogTrigger asChild>{actionComponent}</DialogTrigger>

         <DialogContent className={cn('px-6 py-8 sm:max-w-[425px]', message ? 'space-y-4' : 'space-y-8')}>
            <h6 className="text-destructive text-center text-xl">{frontend.delete_warning}</h6>

            {message && (
               <div className="bg-destructive/5 rounded-xl p-4">
                  <p className="text-destructive text-center text-sm">{message}</p>
               </div>
            )}

            <div className="mb-0 flex items-center justify-center gap-6">
               <Button onClick={handleOpen} className="text-destructive border-destructive border bg-transparent px-5 hover:bg-transparent">
                  {button.cancel}
               </Button>

               <Button type="button" onClick={deleteHandler} className="hover:bg-primary-hover bg-primary px-5">
                  {button.delete}
               </Button>
            </div>
         </DialogContent>
      </Dialog>
   );
};

export default DeleteModal;
