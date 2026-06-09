import TableHeader from '@/components/table/table-header';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import { StudentCourseProps } from '@/types/page';
import { usePage } from '@inertiajs/react';
import { SortingState, flexRender, getCoreRowModel, getFilteredRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table';
import { useMemo, useState } from 'react';
import { AssignmentColumns } from '../partials/assignment-columns';

const CourseAssignments = () => {
   const { props } = usePage<StudentCourseProps>();
   const { assignments } = props;

   const [sorting, setSorting] = useState<SortingState>([]);
   const assignmentColumns = useMemo(() => AssignmentColumns, []);

   const table = useReactTable({
      data: assignments,
      columns: assignmentColumns,
      onSortingChange: setSorting,
      getCoreRowModel: getCoreRowModel(),
      getSortedRowModel: getSortedRowModel(),
      getFilteredRowModel: getFilteredRowModel(),
      state: { sorting },
   });

   return (
      <div className="space-y-6">
         {assignments && assignments.length > 0 ? (
            <div className="overflow-hidden rounded-lg border">
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
                           <TableCell className="h-24 text-center">No assignments found.</TableCell>
                        </TableRow>
                     )}
                  </TableBody>
               </Table>
            </div>
         ) : (
            <div className="py-12 text-center">
               <p className="text-muted-foreground text-lg">No assignments available for this course yet.</p>
            </div>
         )}
      </div>
   );
};

export default CourseAssignments;
