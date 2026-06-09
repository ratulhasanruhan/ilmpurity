import CourseCard5 from '@/components/cards/course-card-5';
import { getPageSection } from '@/lib/page';
import { IntroPageProps } from '@/types/page';
import { usePage } from '@inertiajs/react';
import Section from '../section';

const TopCourses = () => {
   const { props } = usePage<IntroPageProps>();
   const { page, topCourses, customize } = props;
   const topCoursesSection = getPageSection(page, 'top_courses');

   return (
      <Section customize={customize} pageSection={topCoursesSection} containerClass="py-20">
         <div className="relative z-10 mx-auto mb-10 max-w-lg text-center">
            <p className="text-secondary-foreground mb-1 font-medium">{topCoursesSection?.title}</p>
            <h2 className="mb-4 text-2xl font-bold sm:text-3xl">{topCoursesSection?.sub_title}</h2>
            <p className="text-muted-foreground">{topCoursesSection?.description}</p>
         </div>

         <div className="relative">
            <div className="relative z-10 grid grid-cols-1 gap-7 md:grid-cols-2">
               {topCourses.map((course) => (
                  <CourseCard5 key={course.id} course={course} className="py-0" />
               ))}
            </div>

            <div className="after:pointer-events-none after:absolute after:bottom-1 after:left-0 after:h-[260px] after:w-[260px] after:rounded-full after:bg-[rgba(0,167,111,1)] after:blur-[290px] after:content-['']"></div>

            <div className="after:pointer-events-none after:absolute after:top-0 after:right-0 after:h-[200px] after:w-[200px] after:rounded-full after:bg-[rgba(97,95,255,1))] after:blur-[290px] after:content-['']"></div>
         </div>
      </Section>
   );
};

export default TopCourses;
