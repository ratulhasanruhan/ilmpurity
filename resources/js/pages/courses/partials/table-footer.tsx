import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { ScrollArea } from '@/components/ui/scroll-area';
import { getQueryParams } from '@/lib/route';
import { SharedData } from '@/types/global';
import { router, usePage } from '@inertiajs/react';
import { CoursesIndexProps } from '..';

interface Props {
   className: string;
   routeName: string;
   routeParams?: Record<string, string | number>;
   paginationInfo: Pagination<any>;
}

const TableFooter = (props: Props) => {
   const { props: pageProps } = usePage<SharedData>();
   const { translate } = pageProps;
   const { frontend, common } = translate;
   const { current_page, last_page, first_page_url, last_page_url, next_page_url, prev_page_url } = props.paginationInfo;
   const page = usePage<CoursesIndexProps>();
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
            page: pageNumber,
         }),
      );
   };

   const gotoRoute = (path: string) => {
      const pathParams = getQueryParams(path);

      router.get(
         route(props.routeName, {
            category: page.props.category?.id,
            category_child: page.props.categoryChild?.id,
            ...(props.routeParams || {}),
            ...urlParams,
            ...pathParams,
         }),
      );
   };

   const menuItem = (e: number) => {
      return `text-center py-1 ${current_page === e && 'bg-primary-50'}`;
   };

   return (
      <div className={`${props.className}`}>
         <div className="mb-4 flex items-center justify-center md:hidden">
            <span className="mr-1">
               <strong>
                  {current_page} {common.of} {last_page}
               </strong>
            </span>
            <span className="mr-3">| {frontend.go_to_page_colon}</span>
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
            <Button color="white" disabled={!prev_page_url} onClick={() => gotoRoute(first_page_url as string)} className="h-8 px-2 text-xs sm:px-3">
               {'<<First'}
            </Button>

            <Button
               color="white"
               disabled={!prev_page_url}
               onClick={() => gotoRoute(prev_page_url as string)}
               className="mx-3 h-8 px-2 text-xs sm:px-3"
            >
               {frontend.prev}
            </Button>

            <div className="hidden items-center md:flex">
               <span className="mr-1">
                  {common.page}{' '}
                  <strong>
                     {current_page} {common.of} {last_page}
                  </strong>
               </span>
               <span className="mr-3">| {frontend.go_to_page_colon}</span>
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

            <Button
               color="white"
               disabled={!next_page_url}
               onClick={() => gotoRoute(next_page_url as string)}
               className="mx-3 h-8 px-2 text-xs sm:px-3"
            >
               {frontend.next}
            </Button>

            <Button color="white" disabled={!next_page_url} onClick={() => gotoRoute(last_page_url as string)} className="h-8 px-2 text-xs sm:px-3">
               {'Last>>'}
            </Button>
         </div>
      </div>
   );
};

export default TableFooter;
