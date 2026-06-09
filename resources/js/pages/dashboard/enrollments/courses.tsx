import TableFilter from '@/components/table/table-filter';
import TableFooter from '@/components/table/table-footer';
import TableHeader from '@/components/table/table-header';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import { useAuth } from '@/hooks/use-auth';
import DashboardLayout from '@/layouts/dashboard/layout';
import { SharedData } from '@/types/global';
import { SortingState, flexRender, getCoreRowModel, getFilteredRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table';
import * as React from 'react';
import { ReactNode } from 'react';
import AdminTableColumn from './partials/admin-table-columns';
import EnrollmentModal from './partials/enrollment-modal';
import InstructorTableColumn from './partials/instructor-table-columns';

interface Props extends SharedData {
   enrollments: Pagination<CourseEnrollment>;
}

const Courses = (props: Props) => {
   const { isAdmin } = useAuth();
   const [sorting, setSorting] = React.useState<SortingState>([]);
   const { translate, enrollments } = props;
   const { button, dashboard } = translate;

   const table = useReactTable({
      data: enrollments.data,
      columns: isAdmin ? AdminTableColumn('course', translate) : InstructorTableColumn('course', translate),
      onSortingChange: setSorting,
      getCoreRowModel: getCoreRowModel(),
      getSortedRowModel: getSortedRowModel(),
      getFilteredRowModel: getFilteredRowModel(),
      state: { sorting },
   });

   return (
      <div>
         <EnrollmentModal type="course" title="Add New Course Enrollment" handler={<Button>{button.add_new_enrollment}</Button>} />

         <Separator className="my-6" />

         <Card>
            <TableFilter
               data={enrollments}
               title={dashboard.course_list}
               globalSearch={true}
               tablePageSizes={[10, 15, 20, 25]}
               routeName="course-enrollments.index"
               // Icon={<Users className="h-6 w-6 text-primary" />}
               // exportPath={route('users.export')}
            />

            <Table className="border-border border-y">
               <TableHeader table={table} />

               <TableBody>
                  {enrollments.data && enrollments.data.length > 0 ? (
                     table.getRowModel().rows.map((row) => (
                        <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                           {row.getVisibleCells().map((cell) => (
                              <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                           ))}
                        </TableRow>
                     ))
                  ) : (
                     <TableRow>
                        <TableCell className="h-24 text-center">{dashboard.no_results}</TableCell>
                     </TableRow>
                  )}
               </TableBody>
            </Table>

            <TableFooter className="p-5 sm:p-7" routeName="course-enrollments.index" paginationInfo={enrollments} />
         </Card>
      </div>
   );
};

Courses.layout = (page: ReactNode) => <DashboardLayout children={page} />;

export default Courses;
