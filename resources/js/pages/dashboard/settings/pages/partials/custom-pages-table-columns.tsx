import DeleteModal from '@/components/inertia/delete-modal';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { router } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { MoreVertical } from 'lucide-react';
import { toast } from 'sonner';

const TableColumn = (translate: LanguageTranslations): ColumnDef<Page>[] => {
   const { table, button } = translate;

   return [
      {
         accessorKey: 'name',
         header: () => <p className="px-3">{table.name}</p>,
         cell: ({ row }) => <div className="px-3 py-1 text-sm font-medium">{row.getValue('name')}</div>,
      },
      {
         accessorKey: 'slug',
         header: () => <p className="px-3">{table.slug}</p>,
         cell: ({ row }) => <div className="text-muted-foreground px-3 py-1 text-sm">{row.getValue('slug')}</div>,
      },
      {
         accessorKey: 'title',
         header: () => <p className="px-3">{table.title}</p>,
         cell: ({ row }) => <div className="text-muted-foreground px-3 py-1 text-sm">{row.getValue('title')}</div>,
      },
      {
         accessorKey: 'meta_description',
         header: () => <p className="px-3">{table.meta_description}</p>,
         cell: ({ row }) => <div className="text-muted-foreground px-3 py-1 text-sm">{row.getValue('meta_description')}</div>,
      },
      {
         accessorKey: 'meta_keywords',
         header: () => <p className="px-3">{table.meta_keywords}</p>,
         cell: ({ row }) => <div className="text-muted-foreground px-3 py-1 text-sm">{row.getValue('meta_keywords')}</div>,
      },
      {
         id: 'action',
         header: () => <div className="px-3 text-center">{table.action}</div>,
         cell: ({ row }) => {
            const page = row.original;
            const url = window.location.origin + '/' + page.slug;

            return (
               <Popover>
                  <div className="flex justify-end pr-4">
                     <PopoverTrigger asChild>
                        <Button
                           size="icon"
                           variant="ghost"
                           onClick={(e) => e.stopPropagation()}
                           className="bg-muted hover:!bg-muted-foreground/10 h-8 w-8"
                        >
                           <MoreVertical className="h-4 w-4" />
                        </Button>
                     </PopoverTrigger>
                  </div>

                  <PopoverContent align="end" className="flex w-[140px] flex-col space-y-1 p-2">
                     <Button
                        size="sm"
                        variant="ghost"
                        className="bg-muted hover:!bg-muted-foreground/10"
                        onClick={() => router.get(route('settings.custom-page.edit', page.id))}
                     >
                        <span>{table.edit_page}</span>
                     </Button>

                     <Button
                        size="sm"
                        variant="ghost"
                        className="bg-muted hover:!bg-muted-foreground/10"
                        onClick={() => {
                           navigator.clipboard.writeText(url);
                           toast.success('URL copied to clipboard');
                        }}
                     >
                        <span>{table.copy_url}</span>
                     </Button>

                     <Button size="sm" variant="ghost" className="bg-muted hover:!bg-muted-foreground/10">
                        <a target="_blank" href={route('inner.page', page.slug)}>
                           {table.preview_page}
                        </a>
                     </Button>

                     {page.slug !== 'about-us' && page.slug !== 'our-team' && page.slug !== 'careers' && (
                        <DeleteModal
                           routePath={route('settings.custom-page.destroy', page.id)}
                           actionComponent={
                              <Button size="sm" variant="destructive">
                                 <span>{button.delete}</span>
                              </Button>
                           }
                        />
                     )}
                  </PopoverContent>
               </Popover>
            );
         },
      },
   ];
};

export default TableColumn;
