import { Button } from '@/components/ui/button';
import { Carousel, type CarouselApi, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import Quote from '@/icons/quote';
import { getPageSection, getPropertyArray } from '@/lib/page';
import { cn } from '@/lib/utils';
import { IntroPageProps } from '@/types/page';
import { usePage } from '@inertiajs/react';
import Autoplay from 'embla-carousel-autoplay';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import Section from '../section';

const Testimonials = () => {
   const { props } = usePage<IntroPageProps>();
   const { customize } = props;
   const [api, setApi] = useState<CarouselApi>();
   const [currentSlide, setCurrentSlide] = useState(0);
   const testimonialsSection = getPageSection(props.page, 'testimonials');

   useEffect(() => {
      if (!api) {
         return;
      }

      const handleSelect = () => {
         setCurrentSlide(api.selectedScrollSnap());
      };

      api.on('select', handleSelect);

      return () => {
         api.off('select', handleSelect);
      };
   }, [api]);

   return (
      <Section customize={customize} pageSection={testimonialsSection} containerClass="py-20">
         <div className="relative z-10 mx-auto text-center md:max-w-[480px]">
            <p className="text-secondary-foreground mb-1 font-medium">{testimonialsSection?.title}</p>
            <h2 className="mb-4 text-3xl font-bold sm:text-4xl">{testimonialsSection?.title}</h2>
            <p className="text-muted-foreground">{testimonialsSection?.description}</p>
         </div>

         <div className="relative mt-10">
            <Carousel
               setApi={setApi}
               className="relative z-10 space-y-7"
               opts={{
                  loop: true,
                  align: 'start',
                  slidesToScroll: 'auto',
               }}
               plugins={[Autoplay({ delay: 5000 })]}
            >
               <div className="flex items-center justify-center">
                  <Quote />
               </div>

               <div className="mx-auto w-full max-w-[460px]">
                  <CarouselContent>
                     {getPropertyArray(testimonialsSection).map((review, index) => (
                        <CarouselItem key={`testimonials-${index}`} className="text-center">
                           <p className="text-lg">{review.description}</p>
                        </CarouselItem>
                     ))}
                  </CarouselContent>
               </div>

               <div className="flex h-[100px] flex-wrap items-center justify-center gap-7">
                  {api &&
                     getPropertyArray(testimonialsSection).map(({ id, image }, index) => (
                        <div
                           key={id}
                           className={cn(
                              'cursor-pointer overflow-hidden rounded-full transition-all duration-200',
                              currentSlide === index ? 'h-[100px] w-[100px] opacity-100' : 'h-[60px] w-[60px] opacity-40',
                           )}
                           onClick={() => api.scrollTo(index)}
                        >
                           <img src={image} alt="" className="h-full w-full object-cover" />
                        </div>
                     ))}
               </div>
            </Carousel>

            <div className="absolute top-1/2 right-0 z-10 flex w-full -translate-y-1/2 justify-between">
               <Button
                  size="icon"
                  variant="outline"
                  disabled={!api?.canScrollPrev()}
                  onClick={() => api?.scrollPrev()}
                  className="hover:border-primary hover:bg-background"
               >
                  <ChevronLeft />
               </Button>
               <Button
                  size="icon"
                  variant="outline"
                  disabled={!api?.canScrollNext()}
                  onClick={() => api?.scrollNext()}
                  className="hover:border-primary hover:bg-background"
               >
                  <ChevronRight />
               </Button>
            </div>

            <div className="after:pointer-events-none after:absolute after:top-10 after:left-20 after:h-[240px] after:w-[240px] after:rounded-full after:bg-[rgba(97,95,255,1))] after:blur-[290px] after:content-['']"></div>

            <div className="after:pointer-events-none after:absolute after:right-20 after:bottom-10 after:h-[240px] after:w-[240px] after:rounded-full after:bg-[rgba(0,167,111,1)] after:blur-[290px] after:content-['']"></div>
         </div>
      </Section>
   );
};

export default Testimonials;
