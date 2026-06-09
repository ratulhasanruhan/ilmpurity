import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useLang } from '@/hooks/use-lang';
import { Download } from 'lucide-react';

interface Props {
   route: string;
   className?: string;
}

const TableDataExport = (props: Props) => {
   const { className } = props;
   const { table } = useLang();

   const dataExport = () => {};

   return (
      <div className={`relative ml-3 ${className}`}>
         <DropdownMenu>
            <DropdownMenuTrigger>
               <Button size="icon" variant="secondary" className="group h-10 w-11 rounded-md border border-gray-200 p-0 hover:border-blue-500">
                  <Download className="h-4 w-4 text-gray-700 group-hover:text-blue-500" />
               </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
               <ScrollArea className="max-h-[198px]">
                  <DropdownMenuItem onClick={dataExport} className="text-center">
                     {table.csv}
                  </DropdownMenuItem>
               </ScrollArea>
            </DropdownMenuContent>
         </DropdownMenu>
      </div>
   );
};

export default TableDataExport;
