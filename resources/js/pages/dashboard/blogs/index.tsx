import TableFilter from '@/components/table/table-filter';
import TableFooter from '@/components/table/table-footer';
import TableHeader from '@/components/table/table-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import DashboardLayout from '@/layouts/dashboard/layout';
import { SharedData } from '@/types/global';
import { Head, Link, usePage } from '@inertiajs/react';
import { SortingState, flexRender, getCoreRowModel, getFilteredRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table';
import { Archive, BookOpen, Edit, Eye, Plus } from 'lucide-react';
import * as React from 'react';
import { ReactNode } from 'react';
import TableColumn from './partials/table-columns';

interface BlogsPageProps extends SharedData {
   blogs: Pagination<Blog>;
   categories: BlogCategory[];
   statuses: Record<string, string>;
   statistics: {
      total: number;
      published: number;
      draft: number;
      archived: number;
      popular: number;
   };
}

const BlogsIndex = () => {
   const { props } = usePage<BlogsPageProps>();
   const { blogs, statistics, translate } = props;
   const { dashboard, frontend } = translate;

   const [sorting, setSorting] = React.useState<SortingState>([]);

   const table = useReactTable({
      data: blogs.data,
      columns: TableColumn(props.translate),
      onSortingChange: setSorting,
      getCoreRowModel: getCoreRowModel(),
      getSortedRowModel: getSortedRowModel(),
      getFilteredRowModel: getFilteredRowModel(),
      state: { sorting },
   });

   return (
      <>
         <Head title={dashboard.blog} />

         <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
               <h1 className="text-xl font-semibold">{dashboard.blog}</h1>

               <Button asChild>
                  <Link href={route('blogs.create')}>
                     <Plus className="mr-2 h-4 w-4" />
                     {dashboard.add_new_blog}
                  </Link>
               </Button>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
               <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                     <CardTitle className="text-sm font-medium">{dashboard.total_blogs}</CardTitle>
                     <BookOpen className="text-muted-foreground h-4 w-4" />
                  </CardHeader>
                  <CardContent>
                     <div className="text-2xl font-bold">{statistics.total}</div>
                  </CardContent>
               </Card>

               <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                     <CardTitle className="text-sm font-medium">{dashboard.published}</CardTitle>
                     <Eye className="h-4 w-4 text-green-600" />
                  </CardHeader>
                  <CardContent>
                     <div className="text-2xl font-bold text-green-600">{statistics.published}</div>
                  </CardContent>
               </Card>

               <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                     <CardTitle className="text-sm font-medium">{dashboard.draft}</CardTitle>
                     <Edit className="h-4 w-4 text-yellow-600" />
                  </CardHeader>
                  <CardContent>
                     <div className="text-2xl font-bold text-yellow-600">{statistics.draft}</div>
                  </CardContent>
               </Card>

               <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                     <CardTitle className="text-sm font-medium">{dashboard.archived}</CardTitle>
                     <Archive className="h-4 w-4 text-gray-600" />
                  </CardHeader>
                  <CardContent>
                     <div className="text-2xl font-bold text-gray-600">{statistics.archived}</div>
                  </CardContent>
               </Card>
            </div>

            {/* Blogs Table */}
            <Card>
               <TableFilter data={blogs} title={dashboard.blog} globalSearch={true} tablePageSizes={[10, 15, 20, 25]} routeName="blogs.index" />

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
                              {frontend.no_results}
                           </TableCell>
                        </TableRow>
                     )}
                  </TableBody>
               </Table>

               <TableFooter className="p-5 sm:p-7" routeName="blogs.index" paginationInfo={blogs} />
            </Card>
         </div>
      </>
   );
};

BlogsIndex.layout = (page: ReactNode) => <DashboardLayout children={page} />;

export default BlogsIndex;
