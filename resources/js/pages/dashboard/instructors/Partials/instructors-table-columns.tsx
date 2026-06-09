import DeleteModal from '@/components/inertia/delete-modal';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, Pencil, Trash2 } from 'lucide-react';
import ApplicationApproval from './application-approval';

const InstructorsTableColumn = (isAdmin: boolean, translate: LanguageTranslations): ColumnDef<Instructor>[] => {
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
         <div className="flex items-center gap-2">
            <Avatar className="h-11 w-11">
               <AvatarImage src={row.original.user.photo || ''} className="object-cover" />
               <AvatarFallback>CN</AvatarFallback>
            </Avatar>

            <div>
               <p className="mb-0.5 text-base font-medium">{row.original.user.name}</p>
               <p className="text-muted-foreground text-xs">{row.original.user.email}</p>
            </div>
         </div>
      ),
   },
   {
      accessorKey: 'courses',
      header: table.number_of_course,
      cell: ({ row }) => (
         <div className="capitalize">
            <p>{row.original.courses_count} {table.courses_count}</p>
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
      cell: ({ row }) => {
         return (
            <div className="flex justify-end gap-2 py-1">
               <ApplicationApproval
                  instructor={row.original}
                  actionComponent={
                     <Button variant="secondary" className="h-8">
                        <Pencil />
                        {table.status}
                     </Button>
                  }
               />

               {isAdmin && (
                  <DeleteModal
                     routePath={route('instructors.destroy', row.original.id)}
                     message={table.delete_instructor_warning}
                     actionComponent={
                        <Button size="icon" variant="ghost" className="bg-destructive/8 hover:bg-destructive/6 h-8 w-8 p-0">
                           <Trash2 className="text-destructive text-sm" />
                        </Button>
                     }
                  />
               )}
            </div>
         );
      },
   },
   ];
};

export default InstructorsTableColumn;
