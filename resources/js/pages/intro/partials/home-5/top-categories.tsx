import CategoryCard4 from '@/components/cards/category-card-4';
import { getPageSection } from '@/lib/page';
import { IntroPageProps } from '@/types/page';
import { usePage } from '@inertiajs/react';
import Section from '../section';

const TopCategories = () => {
   const { props } = usePage<IntroPageProps>();
   const { page, customize, topCategories } = props;
   const topCategoriesSection = getPageSection(page, 'top_categories');

   return (
      <Section customize={customize} pageSection={topCategoriesSection} containerClass="py-20" contentClass="relative">
         <div className="relative z-10 flex flex-col items-center justify-between gap-10 md:flex-row">
            <div className="w-full md:max-w-[360px]">
               <p className="text-secondary-foreground mb-1 font-medium">{topCategoriesSection?.title}</p>
               <h2 className="mb-4 text-2xl font-bold sm:text-3xl">{topCategoriesSection?.sub_title}</h2>
               <p className="text-muted-foreground">{topCategoriesSection?.description}</p>
            </div>

            <div className="z-10 grid w-full max-w-[800px] grid-cols-1 gap-7 md:grid-cols-2 lg:grid-cols-3">
               {topCategories.map((category) => (
                  <CategoryCard4 key={category.id} category={category} />
               ))}
            </div>
         </div>

         <div className="after:pointer-events-none after:absolute after:top-1/2 after:left-1/2 after:h-[200px] after:w-[200px] after:-translate-x-1/2 after:-translate-y-1/2 after:rounded-full after:bg-[rgba(97,95,255,1))] after:blur-[290px] after:content-['']"></div>
      </Section>
   );
};

export default TopCategories;
