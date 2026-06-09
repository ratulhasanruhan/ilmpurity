import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import React from 'react';
import useScreen from '../hooks/use-screen';

interface SidebarMenuProps {
   children: React.ReactNode;
   className?: string;
   drawerAction?: React.ReactNode;
}

const SidebarMenu = ({ children, className, drawerAction }: SidebarMenuProps) => {
   const { size } = useScreen();
   const [open, setOpen] = React.useState(false);

   return (
      <>
         {size === 'sm' || size === 'md' ? (
            <Sheet open={open} onOpenChange={setOpen}>
               <SheetTrigger asChild>{drawerAction}</SheetTrigger>

               <SheetContent side="left" className={cn('border-border w-[220px]', className)}>
                  {children}
               </SheetContent>
            </Sheet>
         ) : (
            <div className={cn('w-[220px]', className)}>{children}</div>
         )}
      </>
   );
};

export default SidebarMenu;
