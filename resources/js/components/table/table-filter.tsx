import { useLang } from '@/hooks/use-lang';
import debounce from '@/lib/debounce';
import { getQueryParams } from '@/lib/route';
import { cn } from '@/lib/utils';
import { SharedData } from '@/types/global';
import { router, usePage } from '@inertiajs/react';
import { Search } from 'lucide-react';
import { ReactNode, useEffect, useRef } from 'react';
import TableDataExport from './table-data-export';
import TablePageSize from './table-page-size';

interface Props {
   data: Pagination<any>;
   title: string;
   Icon?: ReactNode;
   component?: ReactNode;
   globalSearch: boolean;
   tablePageSizes: number[];
   routeName?: string;
   routeParams?: Record<string, string | number>;
   exportPath?: string;
   className?: string;
}

const TableFilter = (props: Props) => {
   const { Icon, data, title, component, globalSearch, tablePageSizes, routeName, routeParams, exportPath, className } = props;
   const { common } = useLang();
   const page = usePage<SharedData>();
   const urlParams = getQueryParams(page.url);
   const searchRef = useRef<HTMLInputElement>(null);

   const searchHandler = debounce(async (e: any) => {
      const query = e.target.value;

      router.get(
         route(routeName || '', {
            ...(routeParams || {}),
            ...urlParams,
            search: query,
         }),
         {},
         {
            preserveState: true,
            preserveScroll: true,
            showProgress: false,
         },
      );
   }, 300);

   useEffect(() => {
      if (urlParams['search'] && searchRef.current) {
         searchRef.current.focus();
      }
   }, [props]);

   return (
      <div className={cn('items-center justify-between p-6 md:flex', className)}>
         <div className="flex items-center gap-5">
            {Icon && <div className="bg-primary-25 flex h-10 w-10 items-center justify-center rounded-md">{Icon}</div>}
            {title && <p className="mb-4 text-lg font-semibold md:mb-0">{title}</p>}
         </div>
         <div className="flex items-center justify-end gap-3">
            {globalSearch && (
               <div className="relative w-full md:max-w-[260px]">
                  <input
                     type="text"
                     ref={searchRef}
                     placeholder={common.search}
                     onChange={searchHandler}
                     className="focus:border-primary border-border h-10 w-full rounded-md border py-[15px] pr-4 pl-12 text-sm font-normal focus:ring-0 focus:outline-0"
                     defaultValue={urlParams['search'] ?? ''}
                  />
                  <Search className="text-muted-foreground absolute top-1/2 left-4 z-10 h-4 w-4 -translate-y-1/2" />
               </div>
            )}

            {routeName && <TablePageSize routeParams={routeParams} routeName={routeName} pageData={data} dropdownList={tablePageSizes} />}

            {exportPath && <TableDataExport route={exportPath} />}

            {component && component}
         </div>
      </div>
   );
};

export default TableFilter;
