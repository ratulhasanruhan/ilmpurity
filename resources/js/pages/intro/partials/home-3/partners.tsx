import { getPageSection, getPropertyArray } from '@/lib/page';
import { IntroPageProps } from '@/types/page';
import { usePage } from '@inertiajs/react';
import Section from '../section';

const Partners = () => {
   const { props } = usePage<IntroPageProps>();
   const partnersSection = getPageSection(props.page, 'partners');

   return (
      <Section customize={props.customize} pageSection={partnersSection} containerClass="pb-6 !px-1">
         <div className="flex items-center justify-between gap-10 py-8 text-center sm:gap-20">
            <span className="border-border w-full border-t" />
            <p className="text-muted-foreground text-nowrap">{partnersSection?.title}</p>
            <span className="border-border w-full border-t" />
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
