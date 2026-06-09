import SubscribeInput from '@/components/subscribe-input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getPageSection, getPropertyArray } from '@/lib/page';
import { IntroPageProps } from '@/types/page';
import { usePage } from '@inertiajs/react';
import Section from '../section';

const CallToAction = () => {
   const { props } = usePage<IntroPageProps>();
   const ctaSection = getPageSection(props.page, 'call_to_action');

   return (
      <div className="bg-secondary-lighter py-20">
         <Section
            pageSection={ctaSection}
            customize={props.customize}
            containerClass="bg-[rgba(0,114,98,1)] rounded-4xl"
            contentClass="text-white text-center space-y-5 px-6 py-14 bg-[url('/assets/images/intro/home-1/cta-bg-vector.png')] bg-cover bg-center"
         >
            <h1 className="text-2xl leading-tight font-bold md:text-3xl md:leading-9">{ctaSection?.title}</h1>

            <div className="mx-auto w-full max-w-[420px] text-center">
               <p className="mb-3">{ctaSection?.description}</p>

               <SubscribeInput buttonText={ctaSection?.properties?.button_text} />
            </div>

            <div className="flex items-center justify-center">
               <div className="*:data-[slot=avatar]:ring-background flex -space-x-2 *:data-[slot=avatar]:ring-2 *:data-[slot=avatar]:grayscale">
                  {getPropertyArray(ctaSection).map((item, index) => (
                     <Avatar key={index} className="h-8 w-8">
                        <AvatarImage src={item.image || ''} alt={item.name} className="object-cover" />
                        <AvatarFallback>IM</AvatarFallback>
                     </Avatar>
                  ))}
               </div>
               <p className="font-medium">{ctaSection?.properties?.subscribers}</p>
            </div>
         </Section>
      </div>
   );
};

export default CallToAction;
