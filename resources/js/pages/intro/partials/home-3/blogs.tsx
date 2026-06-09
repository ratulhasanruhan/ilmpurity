import BlogCard1 from '@/components/cards/blog-card-1';
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

const Blogs = () => {
   const { props } = usePage<IntroPageProps>();
   const { page, customize, blogs } = props;
   const blogsSection = getPageSection(page, 'blogs');
   const [api, setApi] = useState<CarouselApi>();
   const [currentSlide, setCurrentSlide] = useState(0);

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
      <Section customize={customize} pageSection={blogsSection} containerClass="z-10 py-20">
         <div className="">
            <h2 className="mb-2 text-2xl font-bold sm:text-3xl">{blogsSection?.title}</h2>
            <p className="text-muted-foreground">{blogsSection?.description}</p>
         </div>

         <Carousel setApi={setApi} className="py-10" opts={{ align: 'start', loop: true }} plugins={[Autoplay({ delay: 3000 })]}>
            <CarouselContent>
               {blogs.map((blog) => (
                  <CarouselItem key={blog.id} className="basis-full md:basis-1/2 lg:basis-1/4">
                     <div className="h-full px-1.5 py-0.5">
                        <BlogCard1 blog={blog} className="h-full" />
                     </div>
                  </CarouselItem>
               ))}
            </CarouselContent>
         </Carousel>

         <div className="flex items-center justify-between">
            <div className="flex items-center justify-center gap-2.5">
               {api &&
                  blogs.map(({ id }, index) => (
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

export default Blogs;
