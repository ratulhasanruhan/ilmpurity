import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { router } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown } from 'lucide-react';

const TableColumn = (home: Settings<PageFields>, system: Settings<SystemFields>, translate: LanguageTranslations): ColumnDef<Page>[] => {
   const { table, common } = translate;

   return [
      {
         accessorKey: 'name',
         header: () => <p className="px-3">{table.name}</p>,
         cell: ({ row }) => <div className="px-3 py-1 text-sm font-medium">{row.getValue('name')}</div>,
      },
      {
         accessorKey: 'type',
         header: ({ column }) => {
            return (
               <div className="px-3">
                  <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
                     {table.type}
                     <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
               </div>
            );
         },
         cell: ({ row }) => <div className="text-muted-foreground px-3 py-1 text-sm capitalize">{row.getValue('type')}</div>,
      },
      {
         accessorKey: 'use_case',
         header: () => <p className="px-3">{table.use_case}</p>,
         cell: ({ row }) => (
            <div className="text-muted-foreground px-3 py-1 text-sm">
               {row.original.type === 'administrative' ? table.best_single_instructor : table.best_multiple_instructors}
            </div>
         ),
      },
      {
         accessorKey: 'title',
         header: () => <p className="px-3">{table.title}</p>,
         cell: ({ row }) => <div className="text-muted-foreground px-3 py-1 text-sm">{row.getValue('title')}</div>,
      },
      {
         accessorKey: 'sections',
         header: () => <p className="px-3">{table.sections}</p>,
         cell: ({ row }) => <div className="text-muted-foreground px-3 py-1 text-sm">{row.original.sections?.length || 0}</div>,
      },
      {
         id: 'action',
         header: () => <div className="px-3 text-end">{table.action}</div>,
         cell: ({ row }) => {
            const page = row.original;
            const isSelected = page.slug === home?.fields?.page_slug;

            return (
               <div className="flex items-center justify-end space-x-3 px-3 py-1">
                  <Button asChild size="sm" variant="ghost" className="border-border border">
                     <a target="_blank" href={route('home.demo', { slug: page.slug })}>
                        {common.preview}
                     </a>
                  </Button>

                  {system.sub_type === page.type && (
                     <Button
                        size="sm"
                        disabled={isSelected}
                        variant={isSelected ? 'outline' : 'secondary'}
                        className={cn('rounded-sm', isSelected ? 'border-secondary-foreground text-secondary-foreground' : '')}
                        onClick={() =>
                           isSelected
                              ? ''
                              : router.post(route('settings.home-page.update', home?.id), {
                                   page_id: page.id,
                                   page_name: page.name,
                                   page_slug: page.slug,
                                })
                        }
                     >
                        {isSelected ? table.selected : table.select}
                     </Button>
                  )}
               </div>
            );
         },
      },
   ];
};

export default TableColumn;
