import DeleteModal from '@/components/inertia/delete-modal';
import { Button } from '@/components/ui/button';
import { Link, router } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, Eye, Pencil, Trash2 } from 'lucide-react';

const TableColumn = (translate: LanguageTranslations): ColumnDef<Blog>[] => {
   const { table } = translate;
   
   return [
   {
      accessorKey: 'creator',
      header: ({ column }) => {
         return (
            <div className="flex items-center pl-4">
               <Button variant="ghost" className="p-0 hover:bg-transparent" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
                  {table.creator}
                  <ArrowUpDown />
               </Button>
            </div>
         );
      },
      cell: ({ row }) => (
         <div className="pl-4">
            <p className="mb-0.5 text-base font-medium">{row.original.user.name}</p>
            <p className="text-muted-foreground text-xs">{row.original.user.email}</p>
         </div>
      ),
      sortingFn: (a, b) => a.original.user.name.localeCompare(b.original.user.name),
   },
   {
      accessorKey: 'title',
      header: table.title,
      cell: ({ row }) => (
         <div className="py-1 capitalize">
            <Link href={route('blogs.edit', { blog: row.original.id })}>{row.getValue('title')}</Link>
         </div>
      ),
   },
   {
      accessorKey: 'category',
      header: () => (
         <div className="flex items-center justify-center">
            <p>{table.category}</p>
         </div>
      ),
      cell: ({ row }) => (
         <div className="py-1 text-center capitalize">
            <p>{row.original.category?.name ?? '--'}</p>
         </div>
      ),
      sortingFn: (a, b) => (a.original.category?.name || '').localeCompare(b.original.category?.name || ''),
   },
   {
      accessorKey: 'status',
      header: ({ column }) => (
         <div className="flex items-center justify-center">
            <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
               {table.status}
               <ArrowUpDown />
            </Button>
         </div>
      ),
      cell: ({ row }) => <div className="py-1 text-center capitalize">{row.getValue('status')}</div>,
   },
   {
      id: 'actions',
      header: () => <div className="pr-4 text-end">{table.action}</div>,
      cell: ({ row }) => {
         const blog = row.original;

         return (
            <div className="flex justify-end gap-2 py-1 pr-4">
               <Button asChild size="icon" variant="secondary" className="h-8 w-8">
                  <a target="_blank" href={route('blogs.preview', blog.id)}>
                     <Eye />
                  </a>
               </Button>

               <Button size="icon" variant="secondary" className="h-8 w-8" onClick={() => router.get(route('blogs.edit', blog.id))}>
                  <Pencil />
               </Button>

               <DeleteModal
                  routePath={route('blogs.destroy', blog.id)}
                  actionComponent={
                     <Button size="icon" variant="ghost" className="bg-destructive/8 hover:bg-destructive/6 h-8 w-8 p-0">
                        <Trash2 className="text-destructive text-sm" />
                     </Button>
                  }
               />
            </div>
         );
      },
   },
   ];
};

export default TableColumn;
