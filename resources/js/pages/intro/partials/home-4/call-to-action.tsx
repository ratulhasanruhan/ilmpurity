import SubscribeInput from '@/components/subscribe-input';
import { getPageSection } from '@/lib/page';
import { IntroPageProps } from '@/types/page';
import { usePage } from '@inertiajs/react';
import Section from '../section';

const CallToAction = () => {
   const { props } = usePage<IntroPageProps>();
   const ctaSection = getPageSection(props.page, 'call_to_action');

   return (
      <div className="bg-[rgba(79,103,254,0.06)] py-20">
         <Section
            customize={props.customize}
            pageSection={ctaSection}
            contentClass="grid grid-cols-1 items-center gap-12 space-y-5 rounded-2xl bg-[rgba(79,103,254,1)] bg-cover bg-center px-7 py-[60px] text-white md:grid-cols-2 md:px-[120px]"
            contentStyle={{ backgroundImage: `url('${ctaSection?.background_image}')` }}
         >
            <div className="space-y-2">
               <h1 className="text-2xl leading-tight font-bold md:text-3xl md:leading-9">{ctaSection?.title}</h1>
               <p>{ctaSection?.description}</p>
            </div>

            <SubscribeInput buttonText={ctaSection?.properties?.button_text} />
         </Section>
      </div>
   );
};

export default CallToAction;
