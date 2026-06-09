import TableFilter from '@/components/table/table-filter';
import TableFooter from '@/components/table/table-footer';
import TableHeader from '@/components/table/table-header';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import { Link, usePage } from '@inertiajs/react';
import { SortingState, flexRender, getCoreRowModel, getFilteredRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table';
import { ArrowLeft } from 'lucide-react';
import * as React from 'react';
import { CourseUpdateProps } from '../update';
import SubmissionsTableColumn from './submissions-table-column';

const Submissions = () => {
   const { props } = usePage<CourseUpdateProps>();
   const { course, translate, tab, submissions, assignment } = props;
   console.log(submissions);
   const [sorting, setSorting] = React.useState<SortingState>([]);

   const table = useReactTable({
      data: submissions?.data || [],
      columns: SubmissionsTableColumn(translate),
      onSortingChange: setSorting,
      getCoreRowModel: getCoreRowModel(),
      getSortedRowModel: getSortedRowModel(),
      getFilteredRowModel: getFilteredRowModel(),
      state: { sorting },
   });

   return (
      <div className="grid grid-cols-1">
         <Card className="space-y-6 p-4 sm:p-6">
            <div className="relative flex items-center justify-between gap-3">
               <TableFilter
                  data={submissions}
                  title="Assignment Submissions"
                  globalSearch={true}
                  tablePageSizes={[10, 15, 20, 25]}
                  routeName="courses.edit"
                  routeParams={{
                     course: course.id,
                     tab: tab || '',
                     assignment: assignment || '',
                  }}
                  className="w-full p-0"
                  // Icon={<Users className="h-6 w-6 text-primary" />}
                  // exportPath={route('users.export')}
               />

               <Button asChild className="absolute top-0 right-0 flex h-8 items-center gap-2 md:relative md:top-auto md:h-9">
                  <Link
                     href={route('courses.edit', {
                        course: course.id,
                        tab: tab,
                     })}
                  >
                     <ArrowLeft className="h-4 w-4" />
                     <span>Back</span>
                  </Link>
               </Button>
            </div>

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

            <TableFooter
               className=""
               paginationInfo={submissions}
               routeName="courses.edit"
               routeParams={{
                  course: course.id,
                  tab: tab || '',
                  assignment: assignment || '',
               }}
            />
         </Card>
      </div>
   );
};

export default Submissions;
