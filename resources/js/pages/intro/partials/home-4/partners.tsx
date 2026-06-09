import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import { getPageSection, getPropertyArray } from '@/lib/page';
import { IntroPageProps } from '@/types/page';
import { usePage } from '@inertiajs/react';
import Section from '../section';

import Autoplay from 'embla-carousel-autoplay';

const Partners = () => {
   const { props } = usePage<IntroPageProps>();
   const { customize, page } = props;
   const partnersSection = getPageSection(page, 'partners');

   return (
      <Section customize={customize} pageSection={partnersSection} containerClass="py-[60px]">
         <Carousel opts={{ align: 'start', loop: true }} plugins={[Autoplay({ delay: 2000 })]}>
            <CarouselContent>
               {getPropertyArray(partnersSection).map((partner, index) => (
                  <CarouselItem key={`item-${index}`} className="basis-full md:basis-1/2 lg:basis-1/5">
                     <div className="flex items-center justify-center">
                        <img src={partner.image} alt="" className="h-7 w-auto" />
                     </div>
                  </CarouselItem>
               ))}
            </CarouselContent>
         </Carousel>
      </Section>
   );
};

export default Partners;
