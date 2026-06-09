import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { StudentExamProps } from '@/types/page';
import { usePage } from '@inertiajs/react';

const ExamModules = () => {
   const { props } = usePage<StudentExamProps>();
   const { modules } = props;

   return (
      <>
         {modules && modules.length > 0 ? (
            <Accordion type="single" collapsible className="space-y-4" defaultValue={modules[0]?.id?.toString()}>
               {modules.map((module, ind) => (
                  <AccordionItem key={module.id} value={module.id?.toString() || ind.toString()} className="overflow-hidden rounded-lg border">
                     <AccordionTrigger className="[&[data-state=open]]:!bg-muted px-4 py-3 text-base hover:no-underline">
                        {ind + 1}. {module.title}
                     </AccordionTrigger>
                     <AccordionContent className="space-y-2 p-2">
                        {module.questions && module.questions.length > 0 ? (
                           <div className="space-y-2">
                              {module.questions.map((question, qInd) => (
                                 <div key={question.id} className="rounded-md border p-3">
                                    <div className="flex items-start justify-between">
                                       <div className="flex-1">
                                          <p className="text-sm font-medium">
                                             Question {qInd + 1}: {question.title}
                                          </p>
                                          <p className="text-muted-foreground mt-1 text-xs">
                                             Type: {question.question_type} | Marks: {question.marks}
                                          </p>
                                       </div>
                                    </div>
                                 </div>
                              ))}
                           </div>
                        ) : (
                           <div className="px-4 py-3 text-center">
                              <p>No questions in this module</p>
                           </div>
                        )}
                     </AccordionContent>
                  </AccordionItem>
               ))}
            </Accordion>
         ) : (
            <div className="p-6 text-center">
               <p>No modules available for this exam</p>
            </div>
         )}
      </>
   );
};

export default ExamModules;
