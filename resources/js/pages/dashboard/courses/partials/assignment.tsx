import TableHeader from '@/components/table/table-header';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import { usePage } from '@inertiajs/react';
import { SortingState, flexRender, getCoreRowModel, getFilteredRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table';
import { Plus } from 'lucide-react';
import * as React from 'react';
import { CourseUpdateProps } from '../update';
import AssignmentTableColumn from './assignment-table-column';
import AssignmentForm from './forms/assignment-form';

const Assignment = () => {
   const { props } = usePage<CourseUpdateProps>();
   const { course, translate, tab } = props;

   const [sorting, setSorting] = React.useState<SortingState>([]);

   const table = useReactTable({
      data: course.assignments,
      columns: AssignmentTableColumn(tab as string, translate, course.enrollments_count || 0),
      onSortingChange: setSorting,
      getCoreRowModel: getCoreRowModel(),
      getSortedRowModel: getSortedRowModel(),
      getFilteredRowModel: getFilteredRowModel(),
      state: { sorting },
   });

   return (
      <div className="grid grid-cols-1">
         <Card className="space-y-6 overflow-hidden p-4 sm:p-6">
            <div className="flex items-center justify-between">
               <h2 className="text-xl font-bold">Assignments</h2>

               <AssignmentForm
                  title={'Add Assignment'}
                  handler={
                     <Button className="flex items-center gap-2">
                        <Plus className="h-4 w-4" />
                        <span>Add Assignment</span>
                     </Button>
                  }
               />
            </div>

            {/* Live Classes List */}
            <div className="space-y-4">
               <Table className="border-border min-w-3xl border-y">
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
                           <TableCell className="h-24 text-center">{translate.frontend.no_results}</TableCell>
                        </TableRow>
                     )}
                  </TableBody>
               </Table>
            </div>
         </Card>
      </div>
   );
};

export default Assignment;
