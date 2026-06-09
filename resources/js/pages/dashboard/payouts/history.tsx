import TableFilter from '@/components/table/table-filter';
import TableFooter from '@/components/table/table-footer';
import TableHeader from '@/components/table/table-header';
import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import DashboardLayout from '@/layouts/dashboard/layout';
import { SharedData } from '@/types/global';
import { flexRender, getCoreRowModel, getFilteredRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table';
import { ReactNode } from 'react';
import TableColumn from './partials/history-table-columns';

interface Props extends SharedData {
   payouts: Pagination<Payout>;
}

const History = ({ payouts, translate }: Props) => {
   const { dashboard } = translate;
   
   const table = useReactTable({
      data: payouts.data,
      columns: TableColumn(translate),
      getCoreRowModel: getCoreRowModel(),
      getSortedRowModel: getSortedRowModel(),
      getFilteredRowModel: getFilteredRowModel(),
   });

   return (
      <Card>
         <TableFilter
            data={payouts}
            title={dashboard.payout_history}
            globalSearch={true}
            tablePageSizes={[10, 15, 20, 25]}
            routeName="payouts.history.index"
            className="w-full"
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
                     <TableCell className="h-24 text-center">{dashboard.no_results}</TableCell>
                  </TableRow>
               )}
            </TableBody>
         </Table>

         <TableFooter className="mt-1 p-5 sm:p-7" routeName="payouts.history.index" paginationInfo={payouts} />
      </Card>
   );
};

History.layout = (children: ReactNode) => <DashboardLayout>{children}</DashboardLayout>;

export default History;
