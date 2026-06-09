import { getPageSection, getPropertyArray } from '@/lib/page';
import { IntroPageProps } from '@/types/page';
import { usePage } from '@inertiajs/react';
import Section from '../section';

const Partners = () => {
   const { props } = usePage<IntroPageProps>();
   const { customize, page } = props;
   const partnersSection = getPageSection(page, 'partners');

   return (
      <Section customize={customize} pageSection={partnersSection} containerClass="py-20">
         <p className="text-muted-foreground mb-8 text-center">{partnersSection?.title}</p>

         <div className="flex flex-wrap justify-center gap-y-12 md:gap-y-16">
            {getPropertyArray(partnersSection).map(({ image }, index) => (
               <div key={`partner-${index}`} className="flex w-6/12 items-center justify-center px-6 md:w-3/12 md:px-8 lg:w-2/12">
                  <img src={image} alt="" className="w-full" />
               </div>
            ))}
         </div>
      </Section>
   );
};

export default Partners;
