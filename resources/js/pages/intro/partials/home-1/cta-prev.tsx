import SubscribeInput from '@/components/subscribe-input';
import { getPageSection } from '@/lib/page';
import { IntroPageProps } from '@/types/page';
import { usePage } from '@inertiajs/react';
import Section from '../section';

const CTA = () => {
   const { props } = usePage<IntroPageProps>();
   const ctaSection = getPageSection(props.page, 'call_to_action');

   return (
      <Section
         customize={props.customize}
         pageSection={ctaSection}
         containerClass="py-20"
         contentClass="relative z-10 flex flex-col items-center justify-between gap-10 md:flex-row"
      >
         {/* Left Content */}
         <div className="animate-fade-in w-full max-w-[400px] space-y-8 lg:space-y-10">
            <div>
               <h1 className="text-2xl leading-tight font-bold md:text-3xl md:leading-9">{ctaSection?.sub_title}</h1>

               <p className="text-muted-foreground mt-3">{ctaSection?.description}</p>
            </div>

            <div className="relative">
               <SubscribeInput />

               <div className="after:pointer-events-none after:absolute after:top-0 after:-left-5 after:h-[84px] after:w-[84px] after:rounded-full after:bg-[#FFF5CC] after:blur-[50px] after:content-[''] dark:after:bg-[#fff5cc6d]"></div>
            </div>
         </div>

         {/* Right Image */}
         <div className="animate-fade-in relative flex items-center justify-center lg:justify-end">
            <img src={ctaSection?.thumbnail || ''} alt="Student learning online" className="relative z-10 max-h-[444px] w-full" />

            <div className="after:pointer-events-none after:absolute after:right-10 after:-bottom-10 after:h-[200px] after:w-[200px] after:rounded-full after:bg-[#FFF5CC] after:blur-[250px] after:content-[''] md:after:h-[310px] md:after:w-[310px] dark:after:bg-[#fff5cc6d]"></div>
         </div>
      </Section>
   );
};

export default CTA;
