import SearchInput from '@/components/search-input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { getQueryParams } from '@/lib/route';
import { Link, router, usePage } from '@inertiajs/react';
import { BlogsIndexProps } from '..';

interface BlogFilterProps {
   setOpen?: (open: boolean) => void;
}

const BlogFilter = ({ setOpen }: BlogFilterProps) => {
   const page = usePage<BlogsIndexProps>();
   const urlParams = getQueryParams(page.url);
   const { category, categories, translate } = page.props;
   const { frontend, common } = translate;

   const getQueryRoute = (newParams: Record<string, string>, category: string, category_child?: string) => {
      const updatedParams = { ...urlParams };

      if ('search' in updatedParams) {
         delete updatedParams.search;
      }

      return route('blogs.guest', {
         category,
         category_child,
         ...updatedParams,
         ...newParams,
      });
   };

   return (
      <div className="space-y-6">
         <SearchInput onChangeValue={(value) => router.get(route('blogs.guest', { category: 'all', search: value }))} />

         {/* Categories Section */}
         <div>
            <h3 className="mb-3 font-semibold">{common.categories}</h3>
            <RadioGroup value={category?.slug || 'all'} className="space-y-2">
               <Link className="flex items-center" href={getQueryRoute({}, 'all')}>
                  <RadioGroupItem className="cursor-pointer" id="category" value="all" />
                  <label htmlFor="category" className="cursor-pointer pl-2">
                     {frontend.all_blogs}
                  </label>
               </Link>

               {categories.map((category, ind) => {
                  const key = `category${ind}`;
                  if (category.slug === 'default') return null;

                  return (
                     <div key={key} className="capitalize">
                        <Link
                           className="flex items-center"
                           href={getQueryRoute({}, category.slug)}
                           onFinish={() => !urlParams.search && setOpen && setOpen(false)}
                        >
                           <RadioGroupItem className="cursor-pointer" id={key} value={category.slug} />
                           <label htmlFor={key} className="cursor-pointer pl-2">
                              {category.name}
                           </label>
                        </Link>
                     </div>
                  );
               })}
            </RadioGroup>
         </div>
      </div>
   );
};

export default BlogFilter;
