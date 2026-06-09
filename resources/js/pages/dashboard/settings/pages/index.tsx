import TableHeader from '@/components/table/table-header';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import DashboardLayout from '@/layouts/dashboard/layout';
import { cn } from '@/lib/utils';
import { PageSelectProps } from '@/types/page';
import { Head, router } from '@inertiajs/react';
import { flexRender, getCoreRowModel, getFilteredRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table';
import * as React from 'react';
import CustomPageCreateForm from './partials/custom-page-create-form';
import CustomTableColumn from './partials/custom-pages-table-columns';
import HomeTableColumn from './partials/home-pages-table-columns';

const Pages = ({ pages, home, system, translate }: PageSelectProps) => {
   const { settings, button, common, input } = translate;
   const [modal, setModal] = React.useState<boolean>(false);
   const [systemType, setSystemType] = React.useState<string>(system.sub_type);
   // Memoize the filtered data to prevent unnecessary recalculations

   const homePages = React.useMemo(() => pages.filter((page) => page.type !== 'inner_page'), [pages]);
   const customPages = React.useMemo(() => pages.filter((page) => page.type === 'inner_page'), [pages]);

   // Memoize column definitions
   const homeColumns = React.useMemo(() => HomeTableColumn(home, system, translate), [home, system, translate]);
   const customColumns = React.useMemo(() => CustomTableColumn(translate), []);

   const homePagesTable = useReactTable({
      data: homePages,
      columns: homeColumns,
      getCoreRowModel: getCoreRowModel(),
      getSortedRowModel: getSortedRowModel(),
      getFilteredRowModel: getFilteredRowModel(),
   });

   const customPagesTable = useReactTable({
      data: customPages,
      columns: customColumns,
      getCoreRowModel: getCoreRowModel(),
      getSortedRowModel: getSortedRowModel(),
      getFilteredRowModel: getFilteredRowModel(),
   });

   return (
      <>
         <Head title={settings.page_settings} />

         <div className="mx-auto space-y-10 md:px-3">
            <div className="mb-6 flex items-center justify-between">
               <h1 className="text-2xl font-bold">{settings.page_settings}</h1>
            </div>

            <Card>
               <div className="flex items-center justify-between p-4">
                  <div>
                     <h2 className="text-lg font-medium">{settings.available_home_pages}</h2>
                     <p className="text-muted-foreground text-sm">{settings.home_pages_description}</p>
                  </div>

                  <div>
                     <Label htmlFor="system-type">{common.type}</Label>
                     <Select
                        name="system-type"
                        value={system.sub_type}
                        onValueChange={(value) => {
                           setModal(true);
                           setSystemType(value);
                        }}
                     >
                        <SelectTrigger className="cursor-pointer">
                           <SelectValue placeholder={input.system_type_placeholder} />
                        </SelectTrigger>
                        <SelectContent>
                           <SelectItem value="collaborative" className="cursor-pointer">
                              {button.collaborative}
                           </SelectItem>
                           <SelectItem value="administrative" className="cursor-pointer">
                              {button.administrative}
                           </SelectItem>
                        </SelectContent>
                     </Select>

                     <Dialog open={modal} onOpenChange={setModal}>
                        <DialogContent className={cn('px-6 py-8 sm:max-w-[425px]')}>
                           <div className="bg-destructive/5 rounded-xl p-4">
                              <p className="text-destructive text-center text-sm">{settings.update_system_type_warning}</p>
                           </div>

                           <div className="mb-0 flex items-center justify-center gap-6">
                              <Button
                                 onClick={() => setModal(false)}
                                 className="text-destructive border-destructive border bg-transparent px-5 hover:bg-transparent"
                              >
                                 Cancel
                              </Button>

                              <Button
                                 type="button"
                                 onClick={() => {
                                    router.post(
                                       route('settings.system-type.update'),
                                       {
                                          sub_type: systemType,
                                       },
                                       {
                                          onSuccess: () => {
                                             setModal(false);
                                          },
                                       },
                                    );
                                 }}
                                 className="hover:bg-primary-hover bg-primary px-5"
                              >
                                 Submit
                              </Button>
                           </div>
                        </DialogContent>
                     </Dialog>
                  </div>
               </div>

               <Table className="border-border border-y last:border-b-0">
                  <TableHeader table={homePagesTable} />

                  <TableBody>
                     {homePagesTable.getRowModel().rows?.length ? (
                        homePagesTable.getRowModel().rows.map((row) => (
                           <TableRow
                              key={row.id}
                              data-state={row.getIsSelected() && 'selected'}
                              className={cn(row.original.slug === home?.fields?.page_slug ? 'bg-secondary-lighter' : 'hover:bg-secondary-lighter')}
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
            </Card>

            <Card>
               <div className="flex flex-col items-start justify-between gap-4 p-4 md:flex-row md:items-center">
                  <div>
                     <h2 className="text-lg font-medium">{settings.custom_pages}</h2>
                     <p className="text-muted-foreground text-sm">
                        Page slug will be the page path. Example:{' '}
                        <span className="text-secondary-foreground">http://app-domain.com/cookie-policy</span>
                     </p>
                  </div>

                  <CustomPageCreateForm title="Add New Page" actionComponent={<Button>Add New Page</Button>} />
               </div>

               <Table className="border-border border-y last:border-b-0">
                  <TableHeader table={customPagesTable} />

                  <TableBody>
                     {customPagesTable.getRowModel().rows?.length ? (
                        customPagesTable.getRowModel().rows.map((row) => (
                           <TableRow
                              key={row.id}
                              data-state={row.getIsSelected() && 'selected'}
                              className={cn(row.original.slug === home?.fields?.page_slug ? 'bg-secondary-lighter' : 'hover:bg-secondary-lighter')}
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
            </Card>
         </div>
      </>
   );
};

Pages.layout = (page: React.ReactNode) => <DashboardLayout children={page} />;

export default Pages;
