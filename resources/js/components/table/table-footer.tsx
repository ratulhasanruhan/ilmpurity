import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useLang } from '@/hooks/use-lang';
import { getQueryParams } from '@/lib/route';
import { SharedData } from '@/types/global';
import { router, usePage } from '@inertiajs/react';
import { Button } from '../ui/button';
import { ScrollArea } from '../ui/scroll-area';

interface Props {
   className: string;
   routeName: string;
   routeParams?: Record<string, string | number>;
   paginationInfo: Pagination<any>;
}

const TableFooter = (props: Props) => {
   const { routeName, routeParams, className, paginationInfo } = props;
   const { table, common } = useLang();
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
         route(routeName, {
            ...(routeParams || {}),
            ...urlParams,
            page: pageNumber,
         }),
      );
   };

   const gotoRoute = (path: string) => {
      const pathParams = getQueryParams(path);

      router.get(
         route(routeName, {
            ...(routeParams || {}),
            ...urlParams,
            ...pathParams,
         }),
      );
   };

   const menuItem = (e: number) => {
      return `text-center py-1 ${current_page === e && 'bg-primary-50'}`;
   };

   return (
      <div className={`${className}`}>
         <div className="mb-4 flex items-center justify-center md:hidden">
            <span className="mr-1">
               <strong>
                  {current_page} {common.of} {last_page}
               </strong>
            </span>
            <span className="mr-3">| {table.go_to_page}</span>
            <DropdownMenu>
               <DropdownMenuTrigger>
                  <Button variant="secondary" className="hover:border-primary h-8 w-[60px] rounded-md border border-gray-200 text-gray-700">
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
               variant="ghost"
               disabled={!prev_page_url}
               onClick={() => gotoRoute(first_page_url as string)}
               className="bg-muted border-border h-8 border px-2 text-xs sm:px-3"
            >
               {common.first}
            </Button>

            <Button
               variant="ghost"
               disabled={!prev_page_url}
               onClick={() => gotoRoute(prev_page_url as string)}
               className="bg-muted border-border mx-3 h-8 border px-2 text-xs sm:px-3"
            >
               {table.previous}
            </Button>

            <div className="hidden items-center md:flex">
               <span className="mr-1">
                  {common.page}{' '}
                  <strong>
                     {current_page} {common.of} {last_page}
                  </strong>
               </span>
               <span className="mr-3">| {table.go_to_page}</span>
               <DropdownMenu>
                  <DropdownMenuTrigger>
                     <Button variant="ghost" className="border-border h-8 w-[60px] rounded-md border">
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

            <Button
               variant="ghost"
               disabled={!next_page_url}
               onClick={() => gotoRoute(next_page_url as string)}
               className="bg-muted border-border mx-3 h-8 border px-2 text-xs sm:px-3"
            >
               {common.next}
            </Button>

            <Button
               variant="ghost"
               disabled={!next_page_url}
               onClick={() => gotoRoute(last_page_url as string)}
               className="bg-muted border-border h-8 border px-2 text-xs sm:px-3"
            >
               {common.last}
            </Button>
         </div>
      </div>
   );
};

export default TableFooter;
