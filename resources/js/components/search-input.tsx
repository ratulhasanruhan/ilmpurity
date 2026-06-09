import debounce from '@/lib/debounce';
import { getQueryParams } from '@/lib/route';
import { cn } from '@/lib/utils';
import { SharedData } from '@/types/global';
import { usePage } from '@inertiajs/react';
import { Search } from 'lucide-react';
import { useEffect, useRef } from 'react';

interface SearchInputProps {
   className?: string;
   iconPosition?: 'left' | 'right';
   placeholder?: string;
   onChangeValue: (value: string) => void;
}

const SearchInput = (props: SearchInputProps) => {
   const { className, iconPosition = 'left', placeholder = 'Search', onChangeValue } = props;
   const page = usePage<SharedData>();
   const searchRef = useRef<HTMLInputElement>(null);
   const params = getQueryParams(page.url);

   const searchHandler = debounce(async (e: React.ChangeEvent<HTMLInputElement>) => {
      const query = e.target.value;

      onChangeValue(query);
   }, 300);

   useEffect(() => {
      if (params['search'] && searchRef.current) {
         searchRef.current.focus();
      }
   }, [page, params]);

   return (
      <div className={cn('relative w-full md:max-w-[260px]', className)}>
         <input
            type="text"
            ref={searchRef}
            onChange={searchHandler}
            placeholder={placeholder}
            className={cn(
               'focus:border-input border-input focus-visible:border-ring focus-visible:ring-ring/50 h-9 w-full rounded-md border py-[15px] text-sm font-normal text-gray-500 focus:ring-0 focus:outline-0 focus-visible:ring-[3px]',
               iconPosition === 'left' ? 'pr-4 pl-12' : 'pr-12 pl-4',
            )}
            defaultValue={params['search'] ?? ''}
         />

         <Search className={cn('absolute top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-gray-700', iconPosition === 'left' ? 'left-4' : 'right-4')} />
      </div>
   );
};

export default SearchInput;
