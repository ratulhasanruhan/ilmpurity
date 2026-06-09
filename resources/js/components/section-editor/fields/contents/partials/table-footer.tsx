import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { ScrollArea } from '@/components/ui/scroll-area';
import { getQueryParams } from '@/lib/route';
import { SharedData } from '@/types/global';
import { router, usePage } from '@inertiajs/react';

interface Props {
   className: string;
   routeName: string;
   paginationKey?: string;
   routeParams?: Record<string, string | number>;
   paginationInfo: Pagination<any>;
}

const TableFooter = (props: Props) => {
   const { paginationInfo, paginationKey = 'page' } = props;
   const { current_page, last_page, first_page_url, last_page_url, next_page_url, prev_page_url } = paginationInfo;
   const page = usePage<SharedData>();
   const urlParams = getQueryParams(page.url);

   const dropdownList = [];
   if (last_page > 0) {
      for (let i = 1; i <= last_page; i++) {
         dropdownList.push({
            key: `${i}`,
            value: i,
         });
      }
   } else {
      dropdownList.push({
         key: '1',
         value: 1,
      });
   }

   const gotoPage = (pageNumber: number) => {
      router.get(
         route(props.routeName, {
            ...(props.routeParams || {}),
            ...urlParams,
            [paginationKey]: pageNumber,
         }),
         {},
         { preserveState: true },
      );
   };

   const gotoRoute = (path: string) => {
      const pathParams = getQueryParams(path);

      router.get(
         route(props.routeName, {
            ...(props.routeParams || {}),
            ...urlParams,
            [paginationKey]: pathParams.page,
         }),
         {},
         { preserveState: true },
      );
   };

   const menuItem = (e: number) => {
      return `text-center py-1 ${current_page === e && 'bg-primary-50'}`;
   };

   return (
      <div className={`space-y-4 ${props.className}`}>
         <div className="flex items-center justify-center">
            <span className="mr-1">
               <strong>
                  {current_page} of {last_page}
               </strong>
            </span>
            <span className="mr-3">| Go to page:</span>
            <DropdownMenu>
               <DropdownMenuTrigger>
                  <Button type="button" variant="outline" className="h-8 w-[60px] rounded-md border">
                     {current_page}
                  </Button>
               </DropdownMenuTrigger>
               <DropdownMenuContent align="end" className="min-w-[60px]">
                  <ScrollArea className="">
                     {dropdownList.map((item) => (
                        <DropdownMenuItem key={item.key} onClick={() => gotoPage(item.value)} className={menuItem(item.value)}>
                           {item.value}
                        </DropdownMenuItem>
                     ))}
                  </ScrollArea>
               </DropdownMenuContent>
            </DropdownMenu>
         </div>

         <div className="flex items-center justify-center">
            <Button
               type="button"
               variant="ghost"
               disabled={!prev_page_url}
               onClick={() => gotoRoute(first_page_url as string)}
               className="bg-muted border-border h-8 border px-2 text-xs sm:px-3"
            >
               {'<<First'}
            </Button>

            <Button
               type="button"
               variant="ghost"
               disabled={!prev_page_url}
               onClick={() => gotoRoute(prev_page_url as string)}
               className="bg-muted border-border mx-3 h-8 border px-2 text-xs sm:px-3"
            >
               Prev
            </Button>

            <Button
               type="button"
               variant="ghost"
               disabled={!next_page_url}
               onClick={() => gotoRoute(next_page_url as string)}
               className="bg-muted border-border mx-3 h-8 border px-2 text-xs sm:px-3"
            >
               Next
            </Button>

            <Button
               type="button"
               variant="ghost"
               disabled={!next_page_url}
               onClick={() => gotoRoute(last_page_url as string)}
               className="bg-muted border-border h-8 border px-2 text-xs sm:px-3"
            >
               {'Last>>'}
            </Button>
         </div>
      </div>
   );
};

export default TableFooter;
