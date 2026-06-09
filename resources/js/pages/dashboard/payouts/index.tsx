import TableFilter from '@/components/table/table-filter';
import TableFooter from '@/components/table/table-footer';
import TableHeader from '@/components/table/table-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import DashboardLayout from '@/layouts/dashboard/layout';
import { SharedData } from '@/types/global';
import { flexRender, getCoreRowModel, getFilteredRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table';
import { CircleDollarSign, DollarSign, Plus, Wallet } from 'lucide-react';
import { ReactNode } from 'react';
import TableColumn from './partials/payouts-table-columns';
import WithdrawForm from './partials/withdraw-form';

interface Props extends SharedData {
   payouts: Pagination<Payout>;
   totalEarnings: number;
   totalPayouts: number;
   pendingPayouts: number;
   availableForWithdrawal: number;
}

const Index = (props: Props) => {
   const { payouts, totalEarnings, totalPayouts, pendingPayouts, availableForWithdrawal, translate } = props;
   const { dashboard, button, common } = translate;
   const table = useReactTable({
      data: payouts.data,
      columns: TableColumn(props.translate),
      getCoreRowModel: getCoreRowModel(),
      getSortedRowModel: getSortedRowModel(),
      getFilteredRowModel: getFilteredRowModel(),
   });

   return (
      <>
         <div className="mb-6 grid gap-6 sm:grid-cols-2 md:grid-cols-4">
            <Card>
               <CardContent className="flex items-center gap-4 p-6">
                  <div className="bg-primary/10 rounded-lg p-2">
                     <CircleDollarSign className="text-primary h-6 w-6" />
                  </div>
                  <div>
                     <CardTitle className="text-base font-medium">{dashboard.total_earnings}</CardTitle>
                     <p className="mt-1 text-2xl font-bold">{totalEarnings} $</p>
                  </div>
               </CardContent>
            </Card>

            <Card>
               <CardContent className="flex items-center gap-4 p-6">
                  <div className="bg-primary/10 rounded-lg p-2">
                     <Wallet className="text-primary h-6 w-6" />
                  </div>
                  <div>
                     <CardTitle className="text-base font-medium">{dashboard.available}</CardTitle>
                     <p className="mt-1 text-2xl font-bold">{availableForWithdrawal} $</p>
                  </div>
               </CardContent>
            </Card>

            <Card>
               <CardContent className="flex items-center gap-4 p-6">
                  <div className="bg-primary/10 rounded-lg p-2">
                     <DollarSign className="text-primary h-6 w-6" />
                  </div>
                  <div>
                     <CardTitle className="text-base font-medium">{dashboard.total_payout}</CardTitle>
                     <p className="mt-1 text-2xl font-bold">{totalPayouts} $</p>
                  </div>
               </CardContent>
            </Card>

            <Card>
               <CardContent className="flex items-center gap-4 p-6">
                  <div className="bg-primary/10 rounded-lg p-2">
                     <CircleDollarSign className="text-primary h-6 w-6" />
                  </div>
                  <div>
                     <CardTitle className="text-base font-medium">{dashboard.requested}</CardTitle>
                     <p className="mt-1 text-2xl font-bold">{pendingPayouts} $</p>
                  </div>
               </CardContent>
            </Card>
         </div>

         <Card className="gap-0 py-0">
            <div className="relative flex items-center justify-between">
               <TableFilter
                  data={payouts}
                  title={dashboard.withdraw_list}
                  globalSearch={true}
                  tablePageSizes={[10, 15, 20, 25]}
                  routeName="payouts.index"
                  className="w-full md:pr-3"
               />

               <WithdrawForm
                  title={button.withdraw}
                  handler={
                     <Button variant="outline" className="absolute top-5 right-6 md:static md:mr-6 md:mb-1">
                        <Plus />
                        <span>{button.payout_request}</span>
                     </Button>
                  }
               />
            </div>

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
                        <TableCell className="h-24 text-center">{common.no_results_found}</TableCell>
                     </TableRow>
                  )}
               </TableBody>
            </Table>

            <TableFooter className="mt-1 p-5 sm:p-7" routeName="payouts.index" paginationInfo={payouts} />
         </Card>
      </>
   );
};

Index.layout = (children: ReactNode) => <DashboardLayout>{children}</DashboardLayout>;

export default Index;
