import { Button } from '@/components/ui/button';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown } from 'lucide-react';

const CoursesTableColumn = (translate: LanguageTranslations): ColumnDef<Course>[] => [
   {
      accessorKey: 'title',
      header: 'Title',
      cell: ({ row }) => <div className="capitalize">{row.getValue('title')}</div>,
   },
   {
      accessorKey: 'enrollments_count',
      header: ({ column }) => (
         <div className="flex items-center justify-center">
            <Button type="button" variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
               {translate.table.enrollments}
               <ArrowUpDown />
            </Button>
         </div>
      ),
      cell: ({ row }) => (
         <div className="text-center">
            <p>{row.original.enrollments_count}</p>
         </div>
      ),
   },
   {
      accessorKey: 'average_rating',
      header: ({ column }) => (
         <div className="flex items-center justify-center">
            <Button type="button" variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
               {translate.table.rating}
               <ArrowUpDown />
            </Button>
         </div>
      ),
      cell: ({ row }) => (
         <div className="flex items-center justify-center gap-1 text-center">
            <p>{Number(row.original.average_rating).toFixed(1)}</p>
            <span className="text-yellow-500">
               <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
               </svg>
            </span>
            <span className="text-muted-foreground text-sm">({row.original.reviews_count})</span>
         </div>
      ),
   },
];

export default CoursesTableColumn;
