import TableHeader from '@/components/table/table-header';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import DashboardLayout from '@/layouts/dashboard/layout';
import { cn } from '@/lib/utils';
import InstructorTableColumn from '@/pages/dashboard/payouts/partials/payouts-table-columns';
import AdminTableColumn from '@/pages/dashboard/payouts/partials/request-table-columns';
import { SharedData } from '@/types/global';
import { Head, Link } from '@inertiajs/react';
import { flexRender, getCoreRowModel, getFilteredRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table';
import { ReactNode, useMemo } from 'react';
import { FiBookOpen, FiUserCheck, FiUserPlus, FiUsers, FiVideo } from 'react-icons/fi';
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import RevenueChart from './partials/revenue-chart';

type StatisticsType = {
   courses: number;
   lessons: number;
   enrollments: number;
   students: number;
   instructors: number;
};

type RevenueDataType = Record<string, number>;

type CourseStatusDistributionType = Record<string, number>;

export interface DashboardProps extends SharedData {
   statistics: StatisticsType;
   revenueData: RevenueDataType;
   courseStatusDistribution: CourseStatusDistributionType;
   pendingWithdrawals: Payout[];
}

const Dashboard = (props: DashboardProps) => {
   const { auth, system, statistics, revenueData, courseStatusDistribution, pendingWithdrawals, translate } = props;
   const { frontend } = translate;
   const isAdmin = auth.user.role === 'admin';

   // Format course status data for pie chart
   const pieChartData = useMemo(() => {
      return Object.entries(courseStatusDistribution).map(([name, value]) => ({
         name,
         value,
      }));
   }, [courseStatusDistribution]);

   const table = useReactTable({
      data: pendingWithdrawals,
      columns: isAdmin ? AdminTableColumn(props.translate) : InstructorTableColumn(props.translate),
      getCoreRowModel: getCoreRowModel(),
      getSortedRowModel: getSortedRowModel(),
      getFilteredRowModel: getFilteredRowModel(),
   });

   return (
      <div className="space-y-7">
         <Head title={frontend.dashboard} />

         {/* Statistics Cards */}
         <div className={cn('grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3', isAdmin ? 'lg:grid-cols-5' : 'lg:grid-cols-4')}>
            <StatCard title={frontend.courses} value={statistics.courses} icon={<FiBookOpen className="h-6 w-6 text-blue-500" />} />
            <StatCard title={frontend.lessons} value={statistics.lessons} icon={<FiVideo className="h-6 w-6 text-green-500" />} />
            <StatCard title={frontend.enrollment} value={statistics.enrollments} icon={<FiUserCheck className="h-6 w-6 text-amber-500" />} />
            <StatCard title={frontend.students} value={statistics.students} icon={<FiUsers className="h-6 w-6 text-purple-500" />} />
            {isAdmin && <StatCard title={'Instructors'} value={statistics.instructors} icon={<FiUserPlus className="h-6 w-6 text-rose-500" />} />}
         </div>

         {/* Revenue Chart - Full Width */}
         {system.sub_type === 'collaborative' && <RevenueChart />}

         {/* Course Status Chart */}
         <div className="grid grid-cols-2 gap-6 lg:grid-cols-12">
            <Card className="col-span-full p-6 lg:col-span-4">
               <h3 className="mb-4 text-lg font-medium">{frontend.course_status}</h3>

               <div className="flex items-center justify-center">
                  <ResponsiveContainer width="100%" height={300}>
                     <PieChart>
                        <Pie
                           data={pieChartData}
                           cx="50%"
                           cy="50%"
                           innerRadius={0}
                           outerRadius={80}
                           fill="#8884d8"
                           dataKey="value"
                           paddingAngle={0}
                           label={false}
                        >
                           {pieChartData.map((entry, index) => (
                              <Cell
                                 key={`cell-${index}`}
                                 fill={
                                    [
                                       'oklch(0.8 0.14 160.7)', // Lightest variant
                                       'oklch(0.75 0.145 160.7)', // Light variant
                                       'oklch(0.65 0.145 160.7)', // Base color (secondary-foreground)
                                       'oklch(0.55 0.14 160.7)', // Dark variant
                                       'oklch(0.45 0.135 160.7)', // Darkest variant
                                    ][index % 5]
                                 }
                              />
                           ))}
                        </Pie>
                        <Legend layout="horizontal" align="center" verticalAlign="bottom" iconType="circle" />
                        <Tooltip formatter={(value) => [value, frontend.courses]} />
                     </PieChart>
                  </ResponsiveContainer>
               </div>
            </Card>

            {system.sub_type === 'collaborative' ? (
               <Card className="col-span-full lg:col-span-8">
                  <div className="flex items-center justify-between gap-6 p-6">
                     <h3 className="text-lg font-medium">{frontend.latest_pending_withdrawal_request}</h3>

                     <Button asChild variant="outline">
                        <Link href={isAdmin ? route('payouts.request.index') : route('payouts.index')}>{frontend.view_all}</Link>
                     </Button>
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
                              <TableCell className="h-24 text-center">{frontend.no_results}</TableCell>
                           </TableRow>
                        )}
                     </TableBody>
                  </Table>
               </Card>
            ) : (
               <div className="col-span-full lg:col-span-8">
                  <RevenueChart />
               </div>
            )}
         </div>
      </div>
   );
};

type StatCardProps = {
   title: string;
   value: number;
   icon: ReactNode;
};

const StatCard = ({ title, value, icon }: StatCardProps) => {
   return (
      <Card className="p-4 sm:p-6">
         <div className="flex items-center justify-between">
            <div>
               <p className="text-muted-foreground text-sm font-medium">{title}</p>
               <h4 className="mt-1 text-2xl font-semibold">{value}</h4>
            </div>
            <div className="rounded-full bg-gray-100 p-3">{icon}</div>
         </div>
      </Card>
   );
};

Dashboard.layout = (page: ReactNode) => <DashboardLayout children={page} />;

export default Dashboard;
