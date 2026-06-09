import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { getCompletedContents } from '@/lib/utils';
import { StudentCourseProps } from '@/types/page';
import { usePage } from '@inertiajs/react';
import Lesson from '../partials/lesson';
import Quiz from '../partials/quiz';

const CourseModules = () => {
   const { props } = usePage<StudentCourseProps>();
   const { modules, watchHistory } = props;
   const completed = getCompletedContents(watchHistory);
   // const completion = getCourseCompletion(props.course, completed);

   return (
      <>
         {modules.length > 0 ? (
            <Accordion type="single" collapsible className="space-y-4" defaultValue={modules[0].id as string}>
               {modules.map((section, ind) => (
                  <AccordionItem key={section.id} value={section.id as string} className="overflow-hidden rounded-lg border">
                     <AccordionTrigger className="[&[data-state=open]]:!bg-muted px-4 py-3 text-base hover:no-underline">
                        {ind + 1}. {section.title}
                     </AccordionTrigger>
                     <AccordionContent className="space-y-2 p-2">
                        {section.section_lessons.length > 0 ? (
                           <>
                              {section.section_lessons.map((lesson) => (
                                 <Lesson key={lesson.id} lesson={lesson} completed={completed} />
                              ))}

                              {section.section_quizzes.map((quiz) => (
                                 <Quiz key={quiz.id} quiz={quiz} completed={completed} />
                              ))}
                           </>
                        ) : (
                           <div className="px-4 py-3 text-center">
                              <p>There is no lesson added</p>
                           </div>
                        )}
                     </AccordionContent>
                  </AccordionItem>
               ))}
            </Accordion>
         ) : (
            <div className="p-6 text-center">
               <p>There is no section added</p>
            </div>
         )}
      </>
   );
};

export default CourseModules;
