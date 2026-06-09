import TableHeader from '@/components/table/table-header';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import { cn } from '@/lib/utils';
import { IntroPageProps } from '@/types/page';
import { usePage } from '@inertiajs/react';
import { SortingState, flexRender, getCoreRowModel, getFilteredRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table';
import * as React from 'react';
import TableColumn from './partials/courses-table-columns';
import TableFilter from './partials/table-filter';
import TableFooter from './partials/table-footer';

interface CoursesProps {
   courses: Pagination<Course>;
   selectedIds?: number[];
   onCourseSelect?: (id: number) => void;
}

const Courses = ({ courses, selectedIds = [], onCourseSelect }: CoursesProps) => {
   const page = usePage<IntroPageProps>();
   const routeName = page.props.type === 'demo' ? 'home.demo' : 'home';

   const [sorting, setSorting] = React.useState<SortingState>([]);
   const table = useReactTable({
      data: courses.data,
      columns: TableColumn(page.props.translate),
      onSortingChange: setSorting,
      getCoreRowModel: getCoreRowModel(),
      getSortedRowModel: getSortedRowModel(),
      getFilteredRowModel: getFilteredRowModel(),
      state: { sorting },
   });

   return (
      <div>
         <TableFilter
            data={courses}
            title="Courses"
            globalSearch={true}
            searchKey="course"
            tablePageSizes={[10, 15, 20, 25]}
            routeName={routeName}
            // Icon={<Users className="h-6 w-6 text-primary" />}
            // exportPath={route('users.export')}
         />

         <Table className="border-border border-y">
            <TableHeader table={table} />

            <TableBody>
               {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                     <TableRow
                        key={row.id}
                        data-state={row.getIsSelected() && 'selected'}
                        className={cn('hover:bg-muted cursor-pointer', selectedIds?.includes(Number(row.original.id)) && 'bg-secondary-light')}
                        onClick={() => onCourseSelect && onCourseSelect(Number(row.original.id))}
                     >
                        {row.getVisibleCells().map((cell) => (
                           <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                        ))}
                     </TableRow>
                  ))
               ) : (
                  <TableRow>
                     <TableCell className="h-24 text-center">No results.</TableCell>
                  </TableRow>
               )}
            </TableBody>
         </Table>

         <TableFooter className="p-4" routeName={routeName} paginationInfo={courses} />
      </div>
   );
};

export default Courses;
