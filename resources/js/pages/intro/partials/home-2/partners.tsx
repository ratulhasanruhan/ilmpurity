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
         <div className="mx-auto mb-10 text-center md:max-w-xl">
            <p className="text-secondary-foreground mb-1 font-medium">{partnersSection?.title}</p>
            <h2 className="mb-4 text-3xl font-bold sm:text-4xl">{partnersSection?.sub_title}</h2>
            <p className="text-muted-foreground">{partnersSection?.description}</p>
         </div>

         <div className="flex flex-wrap justify-center gap-x-14 gap-y-12 md:gap-x-20 md:gap-y-16">
            {getPropertyArray(partnersSection).map(({ image }, index) => (
               <div key={`partner-${index}`} className="flex items-center justify-center">
                  <img src={image} alt="" className="h-7 w-auto" />
               </div>
            ))}
         </div>
      </Section>
   );
};

export default Partners;
