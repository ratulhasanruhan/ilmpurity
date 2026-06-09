import DraggableContainer from '@/components/draggable-container';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useState } from 'react';

interface Props {
   data: Array<{
      id: number | string;
      sort: number;
      [key: string]: any;
   }>;
   title: string;
   handler: React.ReactNode;
   renderContent: (item: any) => React.ReactNode;
   onOrderChange: (newOrder: any[], setOpen?: (open: boolean) => void) => void;
   translate?: any;
}

const DataSortModal = ({ title, data, handler, renderContent, onOrderChange, translate }: Props) => {
   const [open, setOpen] = useState(false);

   const handleOrderChange = (newOrder: typeof data) => {
      onOrderChange(newOrder, setOpen);
   };

   return (
      <Dialog open={open} onOpenChange={setOpen}>
         <DialogTrigger asChild>{handler}</DialogTrigger>

         <DialogContent className="p-0">
            <ScrollArea className="max-h-[90vh] p-6">
               <DialogHeader className="mb-6">
                  <DialogTitle>{title}</DialogTitle>
               </DialogHeader>

               {data.length > 0 ? (
                  <DraggableContainer
                     items={data}
                     onOrderChange={handleOrderChange}
                     containerClassName="space-y-2"
                     renderItem={(item) => renderContent(item)}
                  />
               ) : (
                  <div className="px-4 py-3 text-center">
                     <p>{translate?.frontend?.no_element_available || "No element available"}</p>
                  </div>
               )}
            </ScrollArea>
         </DialogContent>
      </Dialog>
   );
};

export default DataSortModal;
