import DeleteModal from '@/components/inertia/delete-modal';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { getQueryParams } from '@/lib/route';
import { cn } from '@/lib/utils';
import { Link, router, usePage } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, ChevronsUpDown, Eye, Pencil, Trash2 } from 'lucide-react';

const ExamTableColumn = (isAdmin: boolean): ColumnDef<Exam>[] => {
   const page = usePage();
   const urlParams = getQueryParams(page.url);
   const statuses = ['all', 'draft', 'published', 'archived'];

   return [
      {
         accessorKey: 'instructor',
         header: ({ column }) => {
            return (
               <div className="flex items-center pl-4">
                  <Button variant="ghost" className="p-0 hover:bg-transparent" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
                     Instructor
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
         header: 'Exam Title',
         cell: ({ row }) => (
            <div className="py-1">
               <Link href={route('exams.details', { slug: row.original.slug, id: row.original.id })} className="font-medium hover:underline">
                  {row.getValue('title')}
               </Link>
               <p className="text-muted-foreground text-xs">{row.original.exam_category.title}</p>
            </div>
         ),
      },
      {
         accessorKey: 'status',
         header: ({ column }) => (
            <div className="flex justify-center">
               <DropdownMenu>
                  <DropdownMenuTrigger className="flex items-center justify-center">
                     <Button variant="ghost" className="text-muted-foreground capitalize">
                        <span>{urlParams['status'] ?? 'Status'}</span>
                        <ChevronsUpDown className="h-3 w-3 text-gray-700" />
                     </Button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent align="center" className="min-w-[72px]">
                     {statuses.map((status) => (
                        <DropdownMenuItem
                           key={status}
                           onClick={() =>
                              router.get(
                                 route('exams.index', {
                                    ...urlParams,
                                    status: status,
                                 }),
                              )
                           }
                           className={cn('cursor-pointer text-center capitalize', urlParams['status'] === status && 'bg-gray-100')}
                        >
                           {status}
                        </DropdownMenuItem>
                     ))}
                  </DropdownMenuContent>
               </DropdownMenu>
            </div>
         ),
         cell: ({ row }) => (
            <div className="flex justify-center py-1">
               <Badge variant={row.getValue('status') === 'published' ? 'default' : 'secondary'} className="capitalize">
                  {row.getValue('status')}
               </Badge>
            </div>
         ),
      },
      {
         accessorKey: 'level',
         header: () => <div className="text-center">Level</div>,
         cell: ({ row }) => (
            <div className="py-1 text-center">
               {row.getValue('level') ? (
                  <Badge variant="outline" className="capitalize">
                     {row.getValue('level')}
                  </Badge>
               ) : (
                  '--'
               )}
            </div>
         ),
      },
      {
         accessorKey: 'total_questions',
         header: () => <div className="text-center">Questions</div>,
         cell: ({ row }) => <div className="py-1 text-center">{row.getValue('total_questions')}</div>,
      },
      {
         accessorKey: 'total_marks',
         header: () => <div className="text-center">Total Marks</div>,
         cell: ({ row }) => <div className="py-1 text-center">{row.getValue('total_marks')}</div>,
      },
      {
         accessorKey: 'enrollments_count',
         header: ({ column }) => (
            <div className="flex items-center justify-center">
               <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
                  Enrollments
                  <ArrowUpDown />
               </Button>
            </div>
         ),
         cell: ({ row }) => <div className="py-1 text-center">{row.getValue('enrollments_count') || 0}</div>,
      },
      {
         accessorKey: 'pricing_type',
         header: () => <div className="text-center">Price</div>,
         cell: ({ row }) => {
            const discountPrice = row.original.discount_price ? Number(row.original.discount_price) : null;
            const price = row.original.price ? Number(row.original.price) : 0;
            const displayPrice = discountPrice || price;

            return (
               <div className="py-1 text-center">
                  {row.original.pricing_type === 'paid' ? (
                     <span className="font-semibold">${displayPrice.toFixed(2)}</span>
                  ) : (
                     <Badge variant="outline" className="bg-green-50 text-green-600">
                        Free
                     </Badge>
                  )}
               </div>
            );
         },
      },
      {
         id: 'actions',
         header: () => <div className="pr-4 text-end">Actions</div>,
         cell: ({ row }) => {
            const exam = row.original;

            return (
               <div className="flex justify-end gap-2 py-1 pr-4">
                  <Button
                     size="icon"
                     variant="ghost"
                     className="h-8 w-8"
                     onClick={() => router.get(route('exams.details', { slug: exam.slug, id: exam.id }))}
                  >
                     <Eye className="h-4 w-4" />
                  </Button>

                  <Button size="icon" variant="secondary" className="h-8 w-8" onClick={() => router.get(route('exams.edit', exam.id))}>
                     <Pencil />
                  </Button>

                  {isAdmin && (
                     <DeleteModal
                        routePath={route('exams.destroy', exam.id)}
                        message={`Are you sure you want to delete "${exam.title}"? This action cannot be undone.`}
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

export default ExamTableColumn;
