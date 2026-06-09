import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { getQueryParams } from '@/lib/route';
import { SharedData } from '@/types/global';
import { router, usePage } from '@inertiajs/react';
import { ChevronsUpDown } from 'lucide-react';

interface Props {
   className?: string;
   pageSizeKey?: string;
   pageData: Pagination<any>;
   dropdownList: number[];
   routeName: string;
   routeParams?: Record<string, string | number>;
}

const TablePageSize = (props: Props) => {
   const page = usePage<SharedData>();
   const urlParams = getQueryParams(page.url);
   const { pageData, dropdownList, className, routeName, routeParams, pageSizeKey = 'per_page' } = props;
   const { per_page } = pageData;

   const gotoPage = (size: number) => {
      router.get(
         route(routeName, {
            ...(routeParams || {}),
            ...urlParams,
            [pageSizeKey]: size,
         }),
         {},
         { preserveState: true },
      );
   };

   return (
      <div className={`relative h-10 ${className}`}>
         <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4">
            <ChevronsUpDown className="text-muted-foreground h-3 w-3" />
         </span>

         <DropdownMenu>
            <DropdownMenuTrigger>
               <Button type="button" variant="ghost" className="hover:border-primary border-border h-10 w-[72px] justify-start border">
                  {per_page}
               </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-[72px]">
               {dropdownList.map((item) => (
                  <DropdownMenuItem key={item} onClick={() => gotoPage(item)} className={`text-center ${per_page === item && 'bg-muted'}`}>
                     {item}
                  </DropdownMenuItem>
               ))}
            </DropdownMenuContent>
         </DropdownMenu>
      </div>
   );
};

export default TablePageSize;
