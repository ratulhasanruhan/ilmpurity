import CategoryCard1 from '@/components/cards/category-card-1';
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
      <Section customize={customize} pageSection={topCategoriesSection} containerClass="z-10 py-20">
         <div className="bg-secondary/10 mx-auto mb-10 text-center md:max-w-2xl">
            <p className="text-secondary-foreground mb-1 font-medium">{topCategoriesSection?.title}</p>
            <h2 className="mb-4 text-3xl font-bold sm:text-4xl">{topCategoriesSection?.sub_title}</h2>
            <p className="text-muted-foreground">{topCategoriesSection?.description}</p>
         </div>

         <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {topCategories.map((category, index) => {
               // Cycle through colors array - when index exceeds array length, start from beginning
               const colorIndex = index % colors.length;
               const currentColor = colors[colorIndex];

               return (
                  <CategoryCard1
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
      </Section>
   );
};

export default TopCategories;
