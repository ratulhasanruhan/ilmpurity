import TableHeader from '@/components/table/table-header';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import ExamAttemptColumn from '@/pages/student/partials/exam-attempt-columns';
import { StudentExamProps } from '@/types/page';
import { usePage } from '@inertiajs/react';
import { SortingState, flexRender, getCoreRowModel, getFilteredRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table';
import { Award, Clock } from 'lucide-react';
import * as React from 'react';

const ExamAttempts = () => {
   const { exam, attempts, bestAttempt } = usePage<StudentExamProps>().props;
   const [sorting, setSorting] = React.useState<SortingState>([]);

   const table = useReactTable({
      data: attempts || [],
      columns: ExamAttemptColumn(exam?.id ?? 0, bestAttempt?.id),
      onSortingChange: setSorting,
      getCoreRowModel: getCoreRowModel(),
      getSortedRowModel: getSortedRowModel(),
      getFilteredRowModel: getFilteredRowModel(),
      state: { sorting },
   });

   if (!attempts || attempts.length === 0) {
      return (
         <div className="flex h-full items-center justify-center rounded-lg border border-dashed text-center">
            <div className="space-y-2 p-10">
               <Clock className="text-muted-foreground mx-auto h-10 w-10" />
               <h2 className="text-xl font-semibold">No attempts yet</h2>
               <p className="text-muted-foreground text-sm">Your exam attempts will appear here once you start the exam.</p>
            </div>
         </div>
      );
   }

   return (
      <div className="space-y-4">
         {/* Exam Attempts Summary */}
         <div className="grid gap-4 md:grid-cols-4">
            <Card className="p-4">
               <div className="space-y-1">
                  <p className="text-muted-foreground text-sm">Total Attempts</p>
                  <p className="text-2xl font-bold">{attempts.length}</p>
               </div>
            </Card>
            <Card className="p-4">
               <div className="space-y-1">
                  <p className="text-muted-foreground text-sm">Completed</p>
                  <p className="text-2xl font-bold text-green-600">{attempts.filter((a: ExamAttempt) => a.status === 'completed').length}</p>
               </div>
            </Card>
            <Card className="p-4">
               <div className="space-y-1">
                  <p className="text-muted-foreground text-sm">In Progress</p>
                  <p className="text-2xl font-bold text-blue-600">{attempts.filter((a: ExamAttempt) => a.status === 'in_progress').length}</p>
               </div>
            </Card>
            <Card className="p-4">
               <div className="space-y-1">
                  <p className="text-muted-foreground text-sm">Best Score</p>
                  <div className="flex items-center gap-2">
                     <p className="text-2xl font-bold text-purple-600">{bestAttempt?.obtained_marks}</p>
                     {bestAttempt && <Award className="h-5 w-5 text-amber-500" />}
                  </div>
               </div>
            </Card>
         </div>

         {/* Attempts Table */}
         <Card>
            <CardHeader className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
               <CardTitle className="text-xl font-semibold">Exam Attempts</CardTitle>

               {bestAttempt && (
                  <Badge variant="secondary" className="flex items-center gap-1 bg-amber-100 text-amber-700">
                     <Award className="h-4 w-4" />
                     Best Score {bestAttempt.obtained_marks}
                  </Badge>
               )}
            </CardHeader>
            <CardContent className="p-0">
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
            </CardContent>
         </Card>
      </div>
   );
};

export default ExamAttempts;
