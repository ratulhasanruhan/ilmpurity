import CourseCard2 from '@/components/cards/course-card-2';
import Tabs from '@/components/tabs';
import { Button } from '@/components/ui/button';
import { TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getPageSection } from '@/lib/page';
import { IntroPageProps } from '@/types/page';
import { Link, usePage } from '@inertiajs/react';
import Section from '../section';

const CategoryCourses = () => {
   const { props } = usePage<IntroPageProps>();
   const { page, customize, categoryTopCourses } = props;
   const categoryCoursesSection = getPageSection(page, 'category_courses');
   console.log(categoryTopCourses);

   return (
      <Section customize={customize} pageSection={categoryCoursesSection} containerClass="py-20">
         <div className="mx-auto">
            <h2 className="mb-4 text-3xl font-bold sm:text-4xl">{categoryCoursesSection?.title}</h2>
            <p className="text-muted-foreground">{categoryCoursesSection?.description}</p>
         </div>

         {categoryTopCourses[0] && (
            <Tabs defaultValue={categoryTopCourses[0].slug}>
               <div className="mt-6 flex w-full max-w-[1000px] overflow-x-auto overflow-y-hidden">
                  <TabsList className="h-[60px] justify-center px-2">
                     {categoryTopCourses.map((category) => (
                        <TabsTrigger key={category.id} value={category.slug} className="h-11 cursor-pointer text-base">
                           {category.title}
                        </TabsTrigger>
                     ))}
                  </TabsList>
               </div>

               {categoryTopCourses.map((category) => (
                  <TabsContent key={category.id} value={category.slug} className="mt-10">
                     {category.courses && category.courses.length > 0 ? (
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                           {category.courses.map((course) => (
                              <CourseCard2 key={course.id} course={course} />
                           ))}
                        </div>
                     ) : (
                        <p className="text-muted-foreground text-center">No courses found</p>
                     )}
                  </TabsContent>
               ))}
            </Tabs>
         )}

         <div className="mt-10 flex items-center justify-center">
            {categoryCoursesSection?.properties?.button_text && (
               <Button asChild variant="outline" className="h-[42px] px-5">
                  <Link href={categoryCoursesSection?.properties?.button_link || ''}>{categoryCoursesSection?.properties?.button_text}</Link>
               </Button>
            )}
         </div>
      </Section>
   );
};

export default CategoryCourses;
