import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { getCompletedContents } from '@/lib/utils';
import { StudentCourseProps } from '@/types/page';
import { usePage } from '@inertiajs/react';
import QuizStatus from '../partials/quiz-status';

const CourseQuizzes = () => {
   const { props } = usePage<StudentCourseProps>();
   const { quizzes, watchHistory } = props;
   const completed = getCompletedContents(watchHistory);

   return (
      <>
         {quizzes.length > 0 ? (
            <Accordion type="single" collapsible className="space-y-4" defaultValue={quizzes[0].id as string}>
               {quizzes.map((section, ind) => {
                  return (
                     <AccordionItem key={section.id} value={section.id as string} className="overflow-hidden rounded-lg border">
                        <AccordionTrigger className="[&[data-state=open]]:!bg-muted px-4 py-3 text-base hover:no-underline">
                           {ind + 1}. {section.title}
                        </AccordionTrigger>

                        <AccordionContent className="space-y-2 p-2">
                           {section.section_quizzes.length > 0 ? (
                              section.section_quizzes.map((quiz) => <QuizStatus key={quiz.id} quiz={quiz} completed={completed} />)
                           ) : (
                              <div className="px-4 py-3 text-center">
                                 <p>There is no quiz added</p>
                              </div>
                           )}
                        </AccordionContent>
                     </AccordionItem>
                  );
               })}
            </Accordion>
         ) : (
            <div className="p-6 text-center">
               <p>There is no quiz added</p>
            </div>
         )}
      </>
   );
};

export default CourseQuizzes;
