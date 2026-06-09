import ReviewCard1 from '@/components/cards/review-card-1';
import { Button } from '@/components/ui/button';
import { Carousel, type CarouselApi, CarouselContent, CarouselItem } from '@/components/ui/carousel';
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
      <div className="overflow-y-hidden">
         <Section customize={customize} pageSection={testimonialsSection} containerClass="py-20 relative">
            <div className="relative z-10 mx-auto max-w-lg text-center">
               <p className="text-secondary-foreground mb-1 font-medium">{testimonialsSection?.title}</p>
               <h2 className="mb-2 text-3xl font-bold sm:text-4xl">{testimonialsSection?.sub_title}</h2>
               <p className="text-muted-foreground">{testimonialsSection?.description}</p>
            </div>

            <div className="relative">
               <Carousel
                  setApi={setApi}
                  className="relative z-10 py-10"
                  opts={{
                     loop: true,
                     align: 'start',
                     slidesToScroll: 'auto',
                  }}
                  plugins={[Autoplay({ delay: 5000 })]}
               >
                  <CarouselContent>
                     {getPropertyArray(testimonialsSection).map((review, index) => (
                        <CarouselItem key={`testimonials-${index}`} className="md:basis-1/2 lg:basis-1/3">
                           <div className="h-full px-1.5 py-0.5">
                              <ReviewCard1 review={review as any} />
                           </div>
                        </CarouselItem>
                     ))}
                  </CarouselContent>
               </Carousel>
            </div>

            <div className="flex items-center justify-between">
               <div className="flex items-center justify-center gap-2.5">
                  {api &&
                     getPropertyArray(testimonialsSection).map(({ id }, index) => (
                        <div
                           key={id}
                           className={cn(
                              'cursor-pointer rounded-full transition-all duration-200',
                              currentSlide === index ? 'bg-primary h-2 w-4' : 'h-2 w-2 bg-gray-300',
                           )}
                           onClick={() => api.scrollTo(index)}
                        ></div>
                     ))}
               </div>

               <div className="space-x-4">
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
            </div>

            <div className="rounded-full after:pointer-events-none after:absolute after:right-0 after:bottom-10 after:h-[300px] after:w-[300px] after:bg-[rgba(43,127,255,0.32)] after:blur-[240px] after:content-['']"></div>
         </Section>
      </div>
   );
};

export default Testimonials;
