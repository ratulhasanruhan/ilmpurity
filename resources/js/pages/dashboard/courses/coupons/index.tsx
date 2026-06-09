import TableFilter from '@/components/table/table-filter';
import TableFooter from '@/components/table/table-footer';
import TableHeader from '@/components/table/table-header';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import DashboardLayout from '@/layouts/dashboard/layout';
import { Head } from '@inertiajs/react';
import { SortingState, flexRender, getCoreRowModel, getFilteredRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table';
import { Plus } from 'lucide-react';
import * as React from 'react';
import CouponForm from './coupon-form';
import CouponTableColumns from './coupon-table-columns';

interface Props {
   courses: Course[];
   coupons: Pagination<CourseCoupon>;
}

const CouponsIndex = ({ coupons, courses }: Props) => {
   const [sorting, setSorting] = React.useState<SortingState>([]);

   const table = useReactTable({
      data: coupons.data,
      columns: CouponTableColumns({ courses }),
      onSortingChange: setSorting,
      getCoreRowModel: getCoreRowModel(),
      getSortedRowModel: getSortedRowModel(),
      getFilteredRowModel: getFilteredRowModel(),
      state: { sorting },
   });

   return (
      <>
         <Head title="Course Coupons" />

         <div className="space-y-6">
            <div className="flex items-center justify-between">
               <div>
                  <h1 className="text-3xl font-bold text-gray-900">Course Coupons</h1>
                  <p className="mt-1 text-sm text-gray-600">Manage discount coupons for your Courses</p>
               </div>
               <CouponForm
                  title="Create Coupon"
                  courses={courses}
                  handler={
                     <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Coupon
                     </Button>
                  }
               />
            </div>

            <Card>
               <TableFilter
                  data={coupons}
                  title="Coupon List"
                  globalSearch={true}
                  tablePageSizes={[10, 15, 20, 25]}
                  routeName="Course-coupons.index"
               />

               <Table className="border-border border-y">
                  <TableHeader table={table} />

                  <TableBody>
                     {table.getRowModel().rows?.length ? (
                        table.getRowModel().rows.map((row) => (
                           <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                              {row.getVisibleCells().map((cell) => (
                                 <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                              ))}
                           </TableRow>
                        ))
                     ) : (
                        <TableRow>
                           <TableCell colSpan={table.getAllColumns().length} className="h-24 text-center">
                              No coupons found.
                           </TableCell>
                        </TableRow>
                     )}
                  </TableBody>
               </Table>

               <TableFooter className="p-5 sm:p-7" routeName="Course-coupons.index" paginationInfo={coupons} />
            </Card>
         </div>
      </>
   );
};

CouponsIndex.layout = (page: React.ReactNode) => <DashboardLayout>{page}</DashboardLayout>;

export default CouponsIndex;
