import SubscribeInput from '@/components/subscribe-input';
import { getPageSection } from '@/lib/page';
import { IntroPageProps } from '@/types/page';
import { usePage } from '@inertiajs/react';
import Section from '../section';

const CallToAction = () => {
   const { props } = usePage<IntroPageProps>();
   const ctaSection = getPageSection(props.page, 'call_to_action');

   return (
      <Section customize={props.customize} pageSection={ctaSection} containerClass="py-20" contentClass="relative z-10">
         <div className="mx-auto w-full max-w-[820px] rounded-2xl bg-[#007867] px-6 py-20 md:rounded-3xl md:px-10">
            <div className="mx-auto w-full max-w-[420px] text-center text-white">
               <h1 className="text-2xl leading-tight font-bold text-white md:text-3xl md:leading-9">{ctaSection?.title}</h1>
               <p className="mt-3 mb-6">{ctaSection?.description}</p>

               <SubscribeInput buttonText={ctaSection?.properties?.button_text} />
            </div>
         </div>

         <div className="after:pointer-events-none after:absolute after:top-0 after:left-16 after:h-[240px] after:w-[240px] after:rounded-full after:bg-[rgba(97,95,255,1))] after:blur-[290px] after:content-['']"></div>

         <div className="after:pointer-events-none after:absolute after:right-16 after:bottom-0 after:h-[240px] after:w-[240px] after:rounded-full after:bg-[rgba(0,167,111,1)] after:blur-[290px] after:content-['']"></div>
      </Section>
   );
};

export default CallToAction;
