import { Button } from '@/components/ui/button';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown } from 'lucide-react';

// Use a generic type that matches what comes from the backend
export type CategoryData = {
   id: number;
   title: string;
   icon?: string | null;
   slug?: string | null;
   courses_count: number;
   [key: string]: any; // Allow any additional properties
};

const CategoriesTableColumn = (translate: LanguageTranslations): ColumnDef<CategoryData>[] => {
   const { table } = translate;

   return [
      {
         accessorKey: 'title',
         header: ({ column }) => (
            <Button type="button" variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
               {table.category_name}
               <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
         ),
         cell: ({ row }) => <div className="capitalize">{row.getValue('title')}</div>,
      },
      {
         accessorKey: 'courses_count',
         header: ({ column }) => (
            <div className="flex items-center justify-center">
               <Button type="button" variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
                  {table.courses}
                  <ArrowUpDown className="ml-2 h-4 w-4" />
               </Button>
            </div>
         ),
         cell: ({ row }) => (
            <div className="text-center">
               <p>{row.original.courses_count}</p>
            </div>
         ),
      },
   ];
};

export default CategoriesTableColumn;
