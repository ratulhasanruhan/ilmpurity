import TableFilter from '@/components/table/table-filter';
import TableFooter from '@/components/table/table-footer';
import TableHeader from '@/components/table/table-header';
import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import { usePage } from '@inertiajs/react';
import { SortingState, flexRender, getCoreRowModel, getFilteredRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table';
import * as React from 'react';
import { ExamUpdateProps } from '../../update';
import ExamAttemptReview from '../exam-attempt-review';
import ExamAttemptTableColumn from '../exam-attempt-table-columns';

const Attempts = () => {
   const { attempts, exam, attempt } = usePage<ExamUpdateProps>().props;
   const [sorting, setSorting] = React.useState<SortingState>([]);

   const table = useReactTable({
      data: attempts.data,
      columns: ExamAttemptTableColumn(),
      onSortingChange: setSorting,
      getCoreRowModel: getCoreRowModel(),
      getSortedRowModel: getSortedRowModel(),
      getFilteredRowModel: getFilteredRowModel(),
      state: { sorting },
   });

   return (
      <div className="space-y-4">
         {/* Exam Attempts Summary */}
         <div className="grid gap-4 md:grid-cols-4">
            <Card className="p-4">
               <div className="space-y-1">
                  <p className="text-muted-foreground text-sm">Total Attempts</p>
                  <p className="text-2xl font-bold">{attempts.total}</p>
               </div>
            </Card>
            <Card className="p-4">
               <div className="space-y-1">
                  <p className="text-muted-foreground text-sm">Completed</p>
                  <p className="text-2xl font-bold text-green-600">{attempts.data.filter((a) => a.status === 'completed').length}</p>
               </div>
            </Card>
            <Card className="p-4">
               <div className="space-y-1">
                  <p className="text-muted-foreground text-sm">In Progress</p>
                  <p className="text-2xl font-bold text-blue-600">{attempts.data.filter((a) => a.status === 'in_progress').length}</p>
               </div>
            </Card>
            <Card className="p-4">
               <div className="space-y-1">
                  <p className="text-muted-foreground text-sm">Pass Rate</p>
                  <p className="text-2xl font-bold text-purple-600">
                     {attempts.data.length > 0
                        ? (
                             (attempts.data.filter((a) => a.is_passed && a.status === 'completed').length /
                                attempts.data.filter((a) => a.status === 'completed').length) *
                                100 || 0
                          ).toFixed(1)
                        : 0}
                     %
                  </p>
               </div>
            </Card>
         </div>

         {/* Attempts Table */}
         {attempt ? (
            <ExamAttemptReview attempt={attempt} />
         ) : (
            <Card>
               <TableFilter
                  data={attempts}
                  title="Exam Attempts"
                  globalSearch={true}
                  tablePageSizes={[10, 15, 20, 25]}
                  routeName="exams.edit"
                  routeParams={{ exam: exam.id, tab: 'attempts' }}
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
                              No exam attempts found.
                           </TableCell>
                        </TableRow>
                     )}
                  </TableBody>
               </Table>

               <TableFooter
                  className="p-5 sm:p-7"
                  routeName="exams.edit"
                  paginationInfo={attempts}
                  routeParams={{ exam: exam.id, tab: 'attempts' }}
               />
            </Card>
         )}
      </div>
   );
};

export default Attempts;
