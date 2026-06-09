import ButtonGradientPrimary from '@/components/button-gradient-primary';
import { Card } from '@/components/ui/card';
import { getPageSection } from '@/lib/page';
import { IntroPageProps } from '@/types/page';
import { router, usePage } from '@inertiajs/react';
import Section from '../section';

const TopCourse = () => {
   const { props } = usePage<IntroPageProps>();
   const { page, topCourse, customize } = props;
   const topCourseSection = getPageSection(page, 'top_course');

   return (
      <Section customize={customize} pageSection={topCourseSection} containerClass="py-20">
         <div className="grid grid-cols-1 items-end gap-20 md:grid-cols-2 md:gap-28">
            <div className="relative">
               <div className="relative z-10 mb-10">
                  <p className="text-secondary-foreground mb-1 font-medium">{topCourseSection?.title}</p>
                  <h2 className="mb-4 text-2xl font-bold sm:text-3xl">{topCourse?.title}</h2>
               </div>

               <img
                  alt={topCourse?.title}
                  src={topCourse?.thumbnail || '/assets/images/blank-image.jpg'}
                  className="relative z-10 h-[348px] w-full rounded-xl object-cover object-center"
               />

               <div className="after:pointer-events-none after:absolute after:top-1/2 after:left-1/2 after:h-[260px] after:w-[260px] after:-translate-x-1/2 after:-translate-y-1/2 after:rounded-full after:bg-[rgba(0,167,111,1)] after:blur-[290px] after:content-['']"></div>
            </div>

            <div className="relative">
               <div className="relative z-10 grid grid-cols-1 gap-7 pt-12 pb-7 sm:grid-cols-2">
                  <Card className="px-6 py-7">
                     <h2 className="mb-2 font-bold sm:text-3xl">{topCourse?.formatted_duration}</h2>
                     <p className="text-muted-foreground">Course Duration</p>
                  </Card>
                  <Card className="px-6 py-7">
                     <h2 className="mb-2 font-bold sm:text-3xl">{topCourse?.total_lessons}</h2>
                     <p className="text-muted-foreground">Course Lesson{topCourse?.total_lessons > 1 ? 's' : ''}</p>
                  </Card>
                  <Card className="px-6 py-7">
                     <h2 className="mb-2 font-bold sm:text-3xl">{topCourse?.total_quizzes}</h2>
                     <p className="text-muted-foreground">Total Quiz{topCourse?.total_quizzes > 1 ? 'zes' : ''}</p>
                  </Card>
                  <Card className="px-6 py-7">
                     <h2 className="mb-2 font-bold sm:text-3xl">{topCourse?.enrollments_count}</h2>
                     <p className="text-muted-foreground">Enrolled Student{(topCourse?.enrollments_count ?? 0) > 1 ? 's' : ''}</p>
                  </Card>
               </div>

               {topCourseSection?.properties?.button_text && (
                  <ButtonGradientPrimary
                     shadow={false}
                     onClick={() =>
                        router.post(route('course-cart.store'), {
                           course_id: topCourse.id,
                        })
                     }
                     className="relative z-10 mt-10 md:mt-14"
                  >
                     {topCourseSection?.properties?.button_text}
                  </ButtonGradientPrimary>
               )}

               <div className="after:pointer-events-none after:absolute after:right-[120px] after:bottom-10 after:h-[200px] after:w-[200px] after:rounded-full after:bg-[rgba(97,95,255,1))] after:blur-[290px] after:content-['']"></div>
            </div>
         </div>
      </Section>
   );
};

export default TopCourse;
