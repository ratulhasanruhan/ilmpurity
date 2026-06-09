import DeleteModal from '@/components/inertia/delete-modal';
import { Button } from '@/components/ui/button';
import { Link, router } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, Pencil, Trash2 } from 'lucide-react';
import CourseStatusFilter from './course-status-filter';

const TableColumn = (isAdmin: boolean, translate: LanguageTranslations): ColumnDef<Course>[] => {
   const { table } = translate;
   
   return [
   {
      accessorKey: 'name',
      header: ({ column }) => {
         return (
            <div className="flex items-center pl-4">
               <Button variant="ghost" className="p-0 hover:bg-transparent" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
                  {table.instructor}
                  <ArrowUpDown />
               </Button>
            </div>
         );
      },
      cell: ({ row }) => (
         <div className="pl-4">
            <p className="mb-0.5 text-base font-medium">{row.original.instructor.user.name}</p>
            <p className="text-muted-foreground text-xs">{row.original.instructor.user.email}</p>
         </div>
      ),
   },
   {
      accessorKey: 'title',
      header: table.course_title,
      cell: ({ row }) => (
         <div className="py-1 capitalize">
            <Link
               href={route('courses.edit', {
                  course: row.original.id,
               })}
            >
               {row.getValue('title')}
            </Link>
         </div>
      ),
   },
   {
      accessorKey: 'status',
      header: ({ column }) => (
         <div className="flex justify-center">
            <CourseStatusFilter />
         </div>
      ),
      cell: ({ row }) => <div className="py-1 text-center capitalize">{row.getValue('status')}</div>,
   },
   {
      accessorKey: 'category',
      header: ({ column }) => {
         return (
            <div className="flex items-center justify-center">
               <p>{table.category}</p>
            </div>
         );
      },
      cell: ({ row }) => (
         <div className="py-1 text-center capitalize">
            <p>{row.original.course_category.title}</p>
         </div>
      ),
   },
   {
      accessorKey: 'category_child',
      header: ({ column }) => {
         return (
            <div className="flex items-center justify-center">
               <p>{table.category_child}</p>
            </div>
         );
      },
      cell: ({ row }) => (
         <div className="py-1 text-center capitalize">
            <p>{row.original.course_category_child?.title || '--'}</p>
         </div>
      ),
   },
   {
      accessorKey: 'price',
      header: ({ column }) => (
         <div className="flex items-center justify-center">
            <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
               {table.price}
               <ArrowUpDown />
            </Button>
         </div>
      ),
      cell: ({ row }) => (
         <div className="py-1 text-center capitalize">
            <p>{row.original.price ?? table.free}</p>
         </div>
      ),
   },
   {
      id: 'actions',
      header: () => <div className="pr-4 text-end">{table.action}</div>,
      cell: ({ row }) => {
         const course = row.original;

         return (
            <div className="flex justify-end gap-2 py-1 pr-4">
               <Button
                  size="icon"
                  variant="secondary"
                  className="h-8 w-8"
                  onClick={() =>
                     router.get(
                        route('courses.edit', {
                           course: course.id,
                        }),
                     )
                  }
               >
                  <Pencil />
               </Button>

               {isAdmin && (
                  <DeleteModal
                     routePath={route('courses.destroy', course.id)}
                     message={table.delete_course_warning}
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

export default TableColumn;
