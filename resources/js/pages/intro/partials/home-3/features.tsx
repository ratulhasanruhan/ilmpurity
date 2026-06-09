import { getPageSection, getPropertyArray } from '@/lib/page';
import { IntroPageProps } from '@/types/page';
import { usePage } from '@inertiajs/react';
import Section from '../section';

const Features = () => {
   const { props } = usePage<IntroPageProps>();
   const { page, customize } = props;
   const featuresSection = getPageSection(page, 'features');

   return (
      <Section customize={customize} pageSection={featuresSection} containerClass="py-20" contentClass="relative z-10 grid gap-7 md:grid-cols-3">
         {getPropertyArray(featuresSection).map((feature, index) => (
            <div key={`key-${index}`} className="relative overflow-hidden rounded-2xl">
               <div className="relative z-10 p-8">
                  <div className="after:pointer-events-none after:absolute after:-top-6 after:left-0 after:h-[98px] after:w-[98px] after:rounded-full after:bg-[#E4CBA866] after:blur-[72px] after:content-[''] dark:after:bg-[#e4cba834]"></div>
                  <div className="after:pointer-events-none after:absolute after:-bottom-9 after:-left-8 after:h-[116px] after:w-[116px] after:rounded-full after:bg-[#00A76F1A] after:blur-[72px] after:content-['']"></div>

                  <div className="space-y-3">
                     <img src={feature.image} alt="" className="h-[60px] w-auto" />
                     <h3 className="text-xl font-bold">{feature.title}</h3>
                     <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                  </div>
               </div>

               <div className="after:pointer-events-none after:absolute after:top-0 after:left-0 after:h-20 after:w-20 after:rounded-full after:bg-[rgba(97,95,255,1))] after:blur-[140px] after:content-['']"></div>

               <div className="after:pointer-events-none after:absolute after:right-0 after:bottom-0 after:h-20 after:w-20 after:rounded-full after:bg-[rgba(0,167,111,1)] after:blur-[140px] after:content-['']"></div>
            </div>
         ))}
      </Section>
   );
};

export default Features;
