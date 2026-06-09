import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Carousel, type CarouselApi, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import { getPageSection } from '@/lib/page';
import { cn } from '@/lib/utils';
import { IntroPageProps } from '@/types/page';
import { Link, usePage } from '@inertiajs/react';
import Autoplay from 'embla-carousel-autoplay';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import InstructorSocials from '../instructor-socials';
import Section from '../section';

const TopInstructors = () => {
   const { props } = usePage<IntroPageProps>();
   const { page, customize, topInstructors } = props;
   const topInstructorsSection = getPageSection(page, 'top_instructors');
   const [currentSlide, setCurrentSlide] = useState(0);
   const [api, setApi] = useState<CarouselApi>();

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
      <Section customize={customize} pageSection={topInstructorsSection} containerClass="py-20" contentClass="relative">
         <div className="relative z-10 mx-auto">
            <h2 className="mb-4 text-3xl font-bold sm:text-4xl">{topInstructorsSection?.title}</h2>
            <p className="text-muted-foreground">{topInstructorsSection?.description}</p>
         </div>

         <Carousel setApi={setApi} className="relative z-10 my-5" opts={{ align: 'start', loop: true }} plugins={[Autoplay({ delay: 3000 })]}>
            <CarouselContent>
               {topInstructors.map((instructor) => {
                  return (
                     <CarouselItem key={instructor.id} className="basis-full md:basis-1/2 lg:basis-1/4">
                        <div className="px-1.5 py-5">
                           <Card className="group !shadow-card-lg relative overflow-hidden rounded-2xl">
                              <Link href={route('instructors.show', instructor.id)}>
                                 <div className="relative h-[300px] overflow-hidden">
                                    <img
                                       className="h-full w-full object-cover object-center"
                                       src={instructor.user.photo || '/assets/images/intro/default/instructors/instructor-1.png'}
                                       alt=""
                                    />

                                    <div className="from-primary dark:from-primary-foreground absolute bottom-0 left-1/2 flex h-full w-full -translate-x-1/2 flex-col justify-end bg-gradient-to-t p-4 text-center opacity-0 transition-all duration-200 group-hover:opacity-100">
                                       <p className="mb-1 text-lg font-semibold text-white">{instructor.user.name}</p>
                                       <p className="text-sm text-white">{instructor.designation}</p>
                                    </div>
                                 </div>
                              </Link>

                              <InstructorSocials instructor={instructor} />
                           </Card>
                        </div>
                     </CarouselItem>
                  );
               })}
            </CarouselContent>
         </Carousel>

         <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center justify-center gap-2.5">
               {api &&
                  topInstructors.map(({ id }, index) => (
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

         <div className="after:pointer-events-none after:absolute after:top-10 after:left-0 after:h-[240px] after:w-[240px] after:rounded-full after:bg-[rgba(97,95,255,1))] after:blur-[290px] after:content-['']"></div>

         <div className="after:pointer-events-none after:absolute after:right-0 after:bottom-9 after:h-[240px] after:w-[240px] after:rounded-full after:bg-[rgba(0,167,111,1)] after:blur-[290px] after:content-['']"></div>
      </Section>
   );
};

export default TopInstructors;
