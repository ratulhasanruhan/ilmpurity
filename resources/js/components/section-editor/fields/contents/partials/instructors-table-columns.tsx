import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, Star } from 'lucide-react';

const InstructorsTableColumn = (translate: LanguageTranslations): ColumnDef<Instructor>[] => [
   {
      accessorKey: 'user.name',
      header: ({ column }) => (
         <Button type="button" variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
            {translate.table.instructor}
            <ArrowUpDown className="ml-2 h-4 w-4" />
         </Button>
      ),
      cell: ({ row }) => (
         <div className="flex items-center space-x-2">
            <Avatar className="h-8 w-8">
               <AvatarImage src={row.original.user.photo || ''} alt={row.original.user.name} className="object-cover" />
               <AvatarFallback>{row.original.user.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <span className="capitalize">{row.original.user.name}</span>
         </div>
      ),
   },
   {
      accessorKey: 'total_enrollments',
      header: ({ column }) => (
         <div className="flex items-center justify-center">
            <Button type="button" variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
               {translate.table.enrollments}
               <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
         </div>
      ),
      cell: ({ row }) => (
         <div className="text-center">
            <p>{row.original.total_enrollments_count}</p>
         </div>
      ),
   },
   {
      accessorKey: 'average_rating',
      header: ({ column }) => (
         <div className="flex items-center justify-center">
            <Button type="button" variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
               {translate.table.rating}
               <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
         </div>
      ),
      cell: ({ row }) => (
         <div className="flex items-center justify-center gap-1 text-center">
            <p>{Number(row.original.total_average_rating).toFixed(1)}</p>
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="text-muted-foreground text-sm">({row.original.total_reviews_count})</span>
         </div>
      ),
   },
];

export default InstructorsTableColumn;
