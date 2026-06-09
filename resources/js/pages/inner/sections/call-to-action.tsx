import SubscribeInput from '@/components/subscribe-input';
import { getPageSection } from '@/lib/page';
import Section from '@/pages/intro/partials/section';
import { IntroPageProps } from '@/types/page';
import { usePage } from '@inertiajs/react';

const CallToAction = () => {
   const { props } = usePage<IntroPageProps>();
   const ctaSection = getPageSection(props.page, 'call_to_action');

   return (
      <div className="bg-secondary-lighter border-secondary-light border-t py-20">
         <Section
            pageSection={ctaSection}
            customize={props.customize}
            containerClass="bg-[rgba(0,114,98,1)] rounded-4xl"
            contentClass="text-white text-center space-y-5 px-6 py-[104px] bg-[url('/assets/images/intro/home-1/cta-bg-vector.png')] bg-cover bg-center"
         >
            <h1 className="text-2xl leading-tight font-bold md:text-3xl md:leading-9">{ctaSection?.sub_title}</h1>

            <div className="mx-auto w-full max-w-[420px] text-center">
               <p className="mb-8">{ctaSection?.description}</p>

               <SubscribeInput />
            </div>
         </Section>
      </div>
   );
};

export default CallToAction;
