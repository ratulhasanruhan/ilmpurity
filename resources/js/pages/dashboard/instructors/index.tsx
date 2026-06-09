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
import { Link } from '@inertiajs/react';
import { SortingState, flexRender, getCoreRowModel, getFilteredRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table';
import * as React from 'react';
import { ReactNode } from 'react';
import TableColumn from './Partials/instructors-table-columns';

interface Props extends SharedData {
   instructors: Pagination<Instructor>;
}

const Index = (props: Props) => {
   const { isAdmin } = useAuth();
   const [sorting, setSorting] = React.useState<SortingState>([]);
   const { translate } = props;
   const { button, dashboard } = translate;

   const table = useReactTable({
      data: props.instructors.data,
      columns: TableColumn(isAdmin, props.translate),
      onSortingChange: setSorting,
      getCoreRowModel: getCoreRowModel(),
      getSortedRowModel: getSortedRowModel(),
      getFilteredRowModel: getFilteredRowModel(),
      state: { sorting },
   });

   return (
      <div>
         <Link href={route('instructors.create')}>
            <Button>{button.add_new_instructor}</Button>
         </Link>

         <Separator className="my-6" />

         <Card>
            <TableFilter
               data={props.instructors}
               title={dashboard.instructor_list}
               globalSearch={true}
               tablePageSizes={[10, 15, 20, 25]}
               routeName="instructors.index"
               // Icon={<Users className="h-6 w-6 text-primary" />}
               // exportPath={route('users.export')}
            />

            <Table className="border-border border-y">
               <TableHeader table={table} tableHeadClass="px-6" />

               <TableBody>
                  {table.getRowModel().rows.map((row) => (
                     <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                        {row.getVisibleCells().map((cell) => (
                           <TableCell key={cell.id} className="px-6">
                              {flexRender(cell.column.columnDef.cell, cell.getContext())}
                           </TableCell>
                        ))}
                     </TableRow>
                  ))}
               </TableBody>
            </Table>

            {table.getRowModel().rows?.length <= 0 && (
               <p className="border-border w-full border-b px-6 py-10 text-center">{dashboard.no_results_found}</p>
            )}

            <TableFooter className="p-5 sm:p-7" routeName="instructors.index" paginationInfo={props.instructors} />
         </Card>
      </div>
   );
};

Index.layout = (page: ReactNode) => <DashboardLayout children={page} />;

export default Index;
