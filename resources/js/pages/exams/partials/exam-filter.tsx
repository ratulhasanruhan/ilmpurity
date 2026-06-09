import SearchInput from '@/components/search-input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { getQueryParams } from '@/lib/route';
import { Link, router, usePage } from '@inertiajs/react';
import { ExamsIndexProps } from '..';

interface ExamFilterProps {
   setOpen?: (open: boolean) => void;
}

const ExamFilter = ({ setOpen }: ExamFilterProps) => {
   const page = usePage<ExamsIndexProps>();
   const urlParams = getQueryParams(page.url);
   const { levels, prices, categories, category, categoryChild, translate } = page.props;
   const { frontend, common } = translate;

   const getQueryRoute = (newParams: Record<string, string>, category: string, category_child?: string) => {
      const updatedParams = { ...urlParams };

      if ('search' in updatedParams) {
         delete updatedParams.search;
      }

      return route('category.exams', {
         category,
         category_child,
         ...updatedParams,
         ...newParams,
      });
   };

   return (
      <div className="space-y-6">
         <SearchInput onChangeValue={(value) => router.get(route('category.exams', { category: 'all', search: value }))} />

         {/* Categories Section */}
         <div>
            <h3 className="mb-3 font-semibold">{common.categories}</h3>
            <RadioGroup value={categoryChild ? categoryChild?.slug : category?.slug || 'all'}>
               <Link className="flex items-center" href={getQueryRoute({}, 'all')}>
                  <RadioGroupItem className="cursor-pointer" id="category" value="all" />
                  <label htmlFor="category" className="cursor-pointer pl-2">
                     {frontend.all}
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
                              {category.title}
                           </label>
                        </Link>

                        {category.category_children?.map((child, ind) => {
                           const key = `category_child${ind}`;
                           return (
                              <Link
                                 key={key}
                                 className="mt-2 flex items-center pl-3"
                                 href={getQueryRoute({}, category.slug, child.slug)}
                                 onFinish={() => !urlParams.search && setOpen && setOpen(false)}
                              >
                                 <RadioGroupItem className="cursor-pointer" id={key} value={child.slug} />
                                 <label htmlFor={key} className="cursor-pointer pl-2">
                                    {child.title}
                                 </label>
                              </Link>
                           );
                        })}
                     </div>
                  );
               })}
            </RadioGroup>
         </div>

         {/* Price Section */}
         <div>
            <h3 className="mb-3 font-semibold">{common.price}</h3>
            <RadioGroup value={urlParams['pricing_type'] || 'all'}>
               <Link
                  className="flex items-center"
                  href={getQueryRoute({ pricing_type: 'all' }, category?.slug || 'all', categoryChild?.slug)}
                  onFinish={() => !urlParams.search && setOpen && setOpen(false)}
               >
                  <RadioGroupItem className="cursor-pointer" id="price" value="all" />
                  <label htmlFor="price" className="cursor-pointer pl-2">
                     {frontend.all}
                  </label>
               </Link>

               {prices.map((price) => (
                  <Link
                     key={price}
                     className="flex items-center capitalize"
                     href={getQueryRoute({ pricing_type: price }, category?.slug || 'all', categoryChild?.slug)}
                     onFinish={() => !urlParams.search && setOpen && setOpen(false)}
                  >
                     <RadioGroupItem className="cursor-pointer" value={price} id={price} />
                     <label htmlFor={price} className="cursor-pointer pl-2">
                        {price}
                     </label>
                  </Link>
               ))}
            </RadioGroup>
         </div>

         {/* Label Section */}
         <div>
            <h3 className="mb-3 font-semibold">{common.level}</h3>
            <RadioGroup value={urlParams['level'] || 'all'}>
               <Link
                  className="flex items-center"
                  href={getQueryRoute({ level: 'all' }, category?.slug || 'all', categoryChild?.slug)}
                  onFinish={() => !urlParams.search && setOpen && setOpen(false)}
               >
                  <RadioGroupItem className="cursor-pointer" id="level" value="all" />
                  <label htmlFor="level" className="cursor-pointer pl-2">
                     {frontend.all}
                  </label>
               </Link>
               {levels.map((level) => (
                  <Link
                     key={level}
                     className="flex items-center capitalize"
                     href={getQueryRoute({ level }, category?.slug || 'all', categoryChild?.slug)}
                     onFinish={() => !urlParams.search && setOpen && setOpen(false)}
                  >
                     <RadioGroupItem className="cursor-pointer" value={level} id={level} />
                     <label htmlFor={level} className="cursor-pointer pl-2">
                        {level}
                     </label>
                  </Link>
               ))}
            </RadioGroup>
         </div>
      </div>
   );
};

export default ExamFilter;
