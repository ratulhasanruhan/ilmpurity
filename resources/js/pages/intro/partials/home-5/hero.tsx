import CourseCard3 from '@/components/cards/course-card-3';
import { getPageSection } from '@/lib/page';
import { cn } from '@/lib/utils';
import { IntroPageProps } from '@/types/page';
import { usePage } from '@inertiajs/react';
import Section from '../section';

const Hero = () => {
   const { props } = usePage<IntroPageProps>();
   const { page, heroCourses } = props;
   const heroSection = getPageSection(page, 'hero');
   const courseLength = heroCourses?.length ?? 0;

   return (
      <Section customize={props.customize} pageSection={heroSection} containerClass="py-20" contentClass="relative">
         {heroCourses.length > 0 ? (
            <div
               className={cn(
                  'relative z-10 grid grid-cols-1 items-center gap-x-20',
                  courseLength > 1 ? 'lg:grid-cols-2' : 'lg:grid-cols-1',
                  courseLength > 2 ? 'gap-y-10' : 'gap-y-14',
               )}
            >
               {heroCourses?.map((course) => (
                  <CourseCard3 key={course.id} course={course} className="h-full" />
               ))}
            </div>
         ) : (
            <div>
               <p className="text-center font-medium">Top Courses Hero Section. There is no course added.</p>
            </div>
         )}

         <div className="after:pointer-events-none after:absolute after:bottom-10 after:left-0 after:h-[240px] after:w-[240px] after:rounded-full after:bg-[rgba(0,167,111,1)] after:blur-[290px] after:content-['']"></div>

         <div className="after:pointer-events-none after:absolute after:top-10 after:right-0 after:h-[240px] after:w-[240px] after:rounded-full after:bg-[rgba(97,95,255,1))] after:blur-[290px] after:content-['']"></div>
      </Section>
   );
};

export default Hero;
