import CategoryCard2 from '@/components/cards/category-card-2';
import { getPageSection } from '@/lib/page';
import { IntroPageProps } from '@/types/page';
import { usePage } from '@inertiajs/react';
import Section from '../section';

const TopCategories = () => {
   const { props } = usePage<IntroPageProps>();
   const { page, customize, topCategories } = props;
   const topCategoriesSection = getPageSection(page, 'top_categories');

   return (
      <Section customize={customize} pageSection={topCategoriesSection} containerClass="relative z-10 py-20">
         <div className="mx-auto mb-10 text-center md:max-w-2xl">
            <p className="text-secondary-foreground mb-1 font-medium">{topCategoriesSection?.title}</p>
            <h2 className="mb-4 text-3xl font-bold sm:text-4xl">{topCategoriesSection?.sub_title}</h2>
            <p className="text-muted-foreground">{topCategoriesSection?.description}</p>
         </div>

         <div className="relative z-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {topCategories.map((category) => (
               <CategoryCard2 key={category.id} category={category} />
            ))}
         </div>

         <div className="after:pointer-events-none after:absolute after:right-5 after:-bottom-10 after:h-[200px] after:w-[200px] after:rounded-full after:bg-[#FFF5CC] after:blur-[250px] after:content-[''] md:after:h-[310px] md:after:w-[310px] dark:after:bg-[#fff5cc6d]"></div>
      </Section>
   );
};

export default TopCategories;
