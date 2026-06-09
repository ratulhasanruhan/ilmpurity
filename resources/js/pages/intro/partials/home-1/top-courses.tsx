import CourseCard1 from '@/components/cards/course-card-1';
import { Button } from '@/components/ui/button';
import { Carousel, type CarouselApi, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import { getPageSection } from '@/lib/page';
import { cn } from '@/lib/utils';
import { IntroPageProps } from '@/types/page';
import { usePage } from '@inertiajs/react';
import Autoplay from 'embla-carousel-autoplay';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import Section from '../section';

const TopCourses = () => {
   const { props } = usePage<IntroPageProps>();
   const { page, topCourses, customize } = props;
   const [api, setApi] = useState<CarouselApi>();
   const [currentSlide, setCurrentSlide] = useState(0);
   const topCoursesSection = getPageSection(page, 'top_courses');

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
      <div className="overflow-y-hidden bg-[url('/assets/images/intro/home-1/bg-line.png')] bg-cover bg-center py-20">
         <Section customize={customize} pageSection={topCoursesSection} containerClass=" relative">
            <div className="relative z-10">
               <div className="mx-auto text-center md:max-w-xl">
                  <p className="text-secondary-foreground mb-1 font-medium">{topCoursesSection?.title}</p>
                  <h2 className="mb-4 text-3xl font-bold sm:text-4xl">{topCoursesSection?.sub_title}</h2>
                  <p className="text-muted-foreground">{topCoursesSection?.description}</p>
               </div>

               <Carousel setApi={setApi} className="py-10" opts={{ align: 'start', loop: true }} plugins={[Autoplay({ delay: 3000 })]}>
                  <CarouselContent>
                     {topCourses.map((course) => (
                        <CarouselItem key={course.id} className="basis-full md:basis-1/2 lg:basis-1/4">
                           <div className="px-1.5 py-0.5">
                              <CourseCard1 key={course.id} course={course} />
                           </div>
                        </CarouselItem>
                     ))}
                  </CarouselContent>
               </Carousel>

               <div className="flex items-center justify-between">
                  <div className="flex items-center justify-center gap-2.5">
                     {api &&
                        topCourses.map(({ id }, index) => (
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
            </div>

            <div className="after:pointer-events-none after:absolute after:top-20 after:right-0 after:h-[240px] after:w-[240px] after:rounded-full after:bg-[rgba(97,95,255,1))] after:blur-[180px] after:content-['']"></div>
            <div className="after:pointer-events-none after:absolute after:bottom-20 after:left-0 after:h-[240px] after:w-[240px] after:rounded-full after:bg-[rgba(0,120,103,1)] after:blur-[180px] after:content-['']"></div>
         </Section>
      </div>
   );
};

export default TopCourses;
