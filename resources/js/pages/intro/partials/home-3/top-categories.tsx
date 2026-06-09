import CategoryCard3 from '@/components/cards/category-card-3';
import { getPageSection } from '@/lib/page';
import { IntroPageProps } from '@/types/page';
import { usePage } from '@inertiajs/react';
import Section from '../section';

const TopCategories = () => {
   const { props } = usePage<IntroPageProps>();
   const { page, customize, topCategories } = props;
   const topCategoriesSection = getPageSection(page, 'top_categories');

   return (
      <Section customize={customize} pageSection={topCategoriesSection} containerClass="py-20">
         <div className="relative z-10 mx-auto mb-10">
            <h2 className="mb-4 text-3xl font-bold sm:text-4xl">{topCategoriesSection?.title}</h2>
            <p className="text-muted-foreground">{topCategoriesSection?.description}</p>
         </div>

         <div className="relative">
            <div className="relative z-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
               {topCategories.map((category) => (
                  <CategoryCard3 key={category.id} category={category} />
               ))}
            </div>

            <div className="after:pointer-events-none after:absolute after:top-0 after:left-0 after:h-[240px] after:w-[240px] after:rounded-full after:bg-[rgba(0,167,111,1)] after:blur-[290px] after:content-['']"></div>

            <div className="after:pointer-events-none after:absolute after:right-0 after:bottom-0 after:h-[240px] after:w-[240px] after:rounded-full after:bg-[rgba(97,95,255,1))] after:blur-[290px] after:content-['']"></div>
         </div>
      </Section>
   );
};

export default TopCategories;
