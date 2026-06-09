import TablePageSize from '@/components/table/table-page-size';
import debounce from '@/lib/debounce';
import { getQueryParams } from '@/lib/route';
import { cn } from '@/lib/utils';
import { SharedData } from '@/types/global';
import { router, usePage } from '@inertiajs/react';
import { Search } from 'lucide-react';
import { ReactNode, useEffect, useRef } from 'react';

interface Props {
   data: Pagination<any>;
   title: string;
   Icon?: ReactNode;
   component?: ReactNode;
   searchKey?: string;
   globalSearch: boolean;
   tablePageSizes: number[];
   routeName?: string;
   className?: string;
}

const TableFilter = (props: Props) => {
   const { Icon, data, title, component, globalSearch, tablePageSizes, routeName, className, searchKey = 'search' } = props;
   const page = usePage<SharedData>();
   const urlParams = getQueryParams(page.url);
   const searchRef = useRef<HTMLInputElement>(null);

   const searchHandler = debounce(async (e: any) => {
      const query = e.target.value;

      router.get(
         route(routeName || '', {
            ...urlParams,
            [searchKey]: query,
         }),
         {},
         { preserveState: true }, // This preserves component state across navigation
      );
   }, 300);

   useEffect(() => {
      if (urlParams[searchKey] && searchRef.current) {
         searchRef.current.focus();
      }
   }, [props]);

   return (
      <div className={cn('items-center justify-between p-6 md:flex', className)}>
         <div className="flex items-center gap-5">
            {Icon && <div className="bg-primary-25 flex h-10 w-10 items-center justify-center rounded-md">{Icon}</div>}
            {title && <p className="mb-4 text-lg font-semibold md:mb-0">{title}</p>}
         </div>
         <div className="flex items-center justify-end">
            {globalSearch && (
               <div className="relative w-full md:max-w-[260px]">
                  <input
                     type="text"
                     ref={searchRef}
                     placeholder="Search"
                     onChange={searchHandler}
                     className="focus:border-primary border-border h-10 w-full rounded-md border py-[15px] pr-4 pl-12 text-sm font-normal focus:ring-0 focus:outline-0"
                     defaultValue={urlParams[searchKey] ?? ''}
                  />
                  <Search className="absolute top-3 left-4 z-10 h-4 w-4" />
               </div>
            )}

            {routeName && (
               <TablePageSize
                  routeName={routeName}
                  pageData={data}
                  dropdownList={tablePageSizes}
                  pageSizeKey={`${searchKey}_per_page`}
                  className="ml-3"
               />
            )}

            {component && component}
         </div>
      </div>
   );
};

export default TableFilter;
