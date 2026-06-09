import CourseCard2 from '@/components/cards/course-card-2';
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

const NewCourses = () => {
   const { props } = usePage<IntroPageProps>();
   const { page, newCourses, customize } = props;
   const [api, setApi] = useState<CarouselApi>();
   const [currentSlide, setCurrentSlide] = useState(0);
   const newCoursesSection = getPageSection(page, 'new_courses');

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
      <Section customize={customize} pageSection={newCoursesSection} containerClass="py-20">
         <div className="relative z-10 mx-auto">
            <h2 className="mb-4 text-3xl font-bold sm:text-4xl">{newCoursesSection?.title}</h2>
            <p className="text-muted-foreground">{newCoursesSection?.description}</p>
         </div>

         <Carousel setApi={setApi} className="py-10" opts={{ align: 'start', loop: true }} plugins={[Autoplay({ delay: 3000 })]}>
            <CarouselContent>
               {newCourses.map((course) => (
                  <CarouselItem key={course.id} className="basis-full md:basis-1/2 lg:basis-1/3">
                     <div className="px-1.5 py-0.5">
                        <CourseCard2 key={course.id} course={course} />
                     </div>
                  </CarouselItem>
               ))}
            </CarouselContent>
         </Carousel>

         <div className="flex items-center justify-between">
            <div className="flex items-center justify-center gap-2.5">
               {api &&
                  newCourses.map(({ id }, index) => (
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
      </Section>
   );
};

export default NewCourses;
