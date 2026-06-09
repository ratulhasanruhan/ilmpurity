import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useLang } from '@/hooks/use-lang';
import { useState } from 'react';
import IconPicker from './icon-picker';
import { Input } from './ui/input';
import { ScrollArea } from './ui/scroll-area';
import { TooltipProvider } from './ui/tooltip';

interface IconPickerDialogProps {
   name: string;
   value: string;
   placeholder?: string;
   onSelect: (icon: string) => void;
}

const IconPickerDialog = ({ onSelect, value, name, placeholder }: IconPickerDialogProps) => {
   const [openIcon, setOpenIcon] = useState(false);
   const { dashboard } = useLang();

   return (
      <>
         <Input required readOnly type="text" name={name} value={value} placeholder={placeholder || name} onClick={() => setOpenIcon(true)} />

         <TooltipProvider delayDuration={0}>
            <Dialog open={openIcon} onOpenChange={setOpenIcon}>
               <DialogContent className="p-0">
                  <ScrollArea className="max-h-[90vh] p-6">
                     <DialogHeader className="mb-6">
                        <DialogTitle>{dashboard.icon_picker}</DialogTitle>
                     </DialogHeader>

                     <IconPicker
                        onSelect={(icon) => {
                           onSelect(icon);
                           setOpenIcon(false);
                        }}
                     />
                  </ScrollArea>
               </DialogContent>
            </Dialog>
         </TooltipProvider>
      </>
   );
};

export default IconPickerDialog;
