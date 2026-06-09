import { Toaster } from '@/components/ui/sonner';
import { SharedData } from '@/types/global';
import { usePage } from '@inertiajs/react';
import { PropsWithChildren, useEffect } from 'react';
import { toast } from 'sonner';

const Main = ({ children }: PropsWithChildren) => {
   const { props } = usePage<SharedData>();

   useEffect(() => {
      if (props.flash.error) {
         toast.error(props.flash.error);
      }

      if (props.flash.success || props.flash.warning) {
         toast.success(props.flash.success || props.flash.warning);
      }
   }, [props.flash]);

   return (
      <>
         <Toaster />

         {children}
      </>
   );
};

export default Main;
