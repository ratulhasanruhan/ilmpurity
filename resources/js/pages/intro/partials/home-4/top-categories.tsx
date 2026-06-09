import CategoryCard4 from '@/components/cards/category-card-4';
import { getPageSection } from '@/lib/page';
import { getColorWithOpacity } from '@/lib/utils';
import { IntroPageProps } from '@/types/page';
import { usePage } from '@inertiajs/react';
import Section from '../section';

const TopCategories = () => {
   const { props } = usePage<IntroPageProps>();
   const { page, customize, topCategories } = props;
   const topCategoriesSection = getPageSection(page, 'top_categories');

   const colors = [
      'rgba(79,57,246,1)',
      'rgba(0,122,85,1)',
      'rgba(255,171,0,1)',
      'rgba(236,0,63,1)',
      'rgba(255,171,0,1)',
      // 'rgba(236,0,63,1)',
      // 'rgba(79,57,246,1)',
      // 'rgba(0,122,85,1)',
   ];

   return (
      <Section customize={customize} pageSection={topCategoriesSection} containerClass="mt-20 py-20" contentClass="relative">
         <div className="relative z-10 flex flex-col items-center justify-between gap-8 md:flex-row">
            <div className="w-full md:max-w-[306px]">
               <h2 className="mb-2 text-3xl font-bold sm:text-4xl">{topCategoriesSection?.title}</h2>
               <p className="text-muted-foreground">{topCategoriesSection?.description}</p>
            </div>

            <div className="z-10 grid w-full grid-cols-1 gap-7 md:grid-cols-2 lg:grid-cols-3">
               {topCategories.map((category, index) => {
                  const colorIndex = index % colors.length;
                  const currentColor = colors[colorIndex];

                  return (
                     <CategoryCard4
                        key={category.id}
                        category={category}
                        style={{
                           color: currentColor,
                           borderColor: getColorWithOpacity(currentColor, 0.15),
                           backgroundColor: getColorWithOpacity(currentColor, 0.04),
                        }}
                     />
                  );
               })}
            </div>
         </div>
      </Section>
   );
};

export default TopCategories;
