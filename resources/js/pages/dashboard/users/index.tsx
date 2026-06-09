import TableFilter from '@/components/table/table-filter';
import TableFooter from '@/components/table/table-footer';
import TableHeader from '@/components/table/table-header';
import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import DashboardLayout from '@/layouts/dashboard/layout';
import { SharedData } from '@/types/global';
import { SortingState, flexRender, getCoreRowModel, getFilteredRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table';
import * as React from 'react';
import { ReactNode } from 'react';
import TableColumn from './Partials/table-columns';

interface Props extends SharedData {
   users: Pagination<User>;
}

const Index = (props: Props) => {
   const [sorting, setSorting] = React.useState<SortingState>([]);

   const table = useReactTable({
      data: props.users.data,
      columns: TableColumn(props.translate),
      onSortingChange: setSorting,
      getCoreRowModel: getCoreRowModel(),
      getSortedRowModel: getSortedRowModel(),
      getFilteredRowModel: getFilteredRowModel(),
      state: { sorting },
   });

   return (
      <Card>
         <TableFilter
            data={props.users}
            title="User List"
            globalSearch={true}
            tablePageSizes={[10, 15, 20, 25]}
            routeName="users.index"
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

         <TableFooter className="p-5 sm:p-7" routeName="users.index" paginationInfo={props.users} />
      </Card>
   );
};

Index.layout = (page: ReactNode) => <DashboardLayout children={page} />;

export default Index;
