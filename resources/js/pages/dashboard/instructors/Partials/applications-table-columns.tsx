import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import DocumentViewer from '@/pages/course-player/partials/document-viewer';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, Edit } from 'lucide-react';
import ApplicationApproval from './application-approval';

const ApplicationsTableColumn = (translate: LanguageTranslations): ColumnDef<Instructor>[] => {
   const { table } = translate;

   return [
      {
         accessorKey: 'name',
         header: ({ column }) => {
            return (
               <div className="flex items-center">
                  <Button variant="ghost" className="p-0 hover:bg-transparent" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
                     {table.name}
                     <ArrowUpDown />
                  </Button>
               </div>
            );
         },
         cell: ({ row }) => (
            <div className="capitalize">
               <p>{row.original.user.name}</p>
            </div>
         ),
      },
      {
         accessorKey: 'resume',
         header: table.resume,
         cell: ({ row }) => (
            <div className="capitalize">
               <Dialog>
                  <DialogTrigger>
                     <Button>{table.view_resume}</Button>
                  </DialogTrigger>

                  <DialogContent className="max-w-2xl p-0">
                     <ScrollArea className="min-h-[90vh]">
                        <DialogHeader className="p-6">
                           <DialogTitle>{table.resume}</DialogTitle>
                        </DialogHeader>

                        <DocumentViewer src={row.original.resume || ''} className="min-h-[80vh]" />
                     </ScrollArea>
                  </DialogContent>
               </Dialog>
            </div>
         ),
      },
      {
         accessorKey: 'status',
         header: table.status,
         cell: ({ row }) => (
            <div className="capitalize">
               <span>{row.original.status}</span>
            </div>
         ),
      },
      {
         id: 'actions',
         header: () => <div className="text-end">{table.action}</div>,
         cell: ({ row }) => (
            <div className="flex items-center justify-end">
               <ApplicationApproval
                  instructor={row.original}
                  actionComponent={
                     <Button size="icon" variant="secondary">
                        <Edit />
                     </Button>
                  }
               />
            </div>
         ),
      },
   ];
};

export default ApplicationsTableColumn;
