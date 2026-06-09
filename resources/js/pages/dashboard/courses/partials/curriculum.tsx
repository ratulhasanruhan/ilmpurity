import DataSortModal from '@/components/data-sort-modal';
import DeleteByInertia from '@/components/inertia/delete-modal';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import { router, usePage } from '@inertiajs/react';
import { ChevronDown, FolderOpen, ListOrdered, Pencil, Trash2 } from 'lucide-react';
import { CourseUpdateProps } from '../update';
import LessonForm from './forms/lesson-form';
import QuestionQuestions from './forms/question-questions';
import QuizForm from './forms/quiz-form';
import SectionForm from './forms/section-form';
import ResourceModal from './resource-modal';

const Curriculum = () => {
   const { props } = usePage<CourseUpdateProps>();
   const { translate } = props;
   const { button, dashboard } = translate;

   return (
      <Card className="p-4 sm:p-6">
         <div className="flex flex-wrap items-center gap-4">
            <SectionForm
               title={button.add_section}
               handler={
                  <Button variant="ghost" className="bg-muted hover:!bg-muted-foreground/10">
                     {button.add_section}
                  </Button>
               }
            />

            <DataSortModal
               title={button.sort}
               data={props.course.sections}
               handler={
                  <Button variant="ghost" className="bg-muted hover:!bg-muted-foreground/10">
                     {button.sort_section}
                  </Button>
               }
               onOrderChange={(newOrder) => {
                  router.post(
                     route('section.sort'),
                     {
                        sortedData: newOrder,
                     },
                     { preserveScroll: true },
                  );
               }}
               renderContent={(item) => (
                  <Card className="w-full px-4 py-3">
                     <p>{item.title}</p>
                  </Card>
               )}
            />
         </div>

         <Separator className="my-6" />

         <Accordion type="single" collapsible className="space-y-4">
            {props.course.sections.map((section, index) => (
               <AccordionItem key={section.id} value={section.id as string} className="w-full overflow-hidden rounded-lg border">
                  <AccordionTrigger className="[&[data-state=open]]:!bg-muted px-4 py-3 text-base hover:no-underline">
                     <div className="flex w-full items-center justify-between pr-4">
                        <span>
                           {index + 1}. {section.title}
                        </span>

                        <div onClick={(e) => e.stopPropagation()}>
                           <Popover>
                              <PopoverTrigger>
                                 <Button variant="ghost" className="bg-muted hover:!bg-muted-foreground/10 px-2.5">
                                    <span>Section Menu</span>
                                    <ChevronDown className="h-4 w-4" />
                                 </Button>
                              </PopoverTrigger>
                              <PopoverContent align="end" className="flex w-[160px] flex-col space-y-1 p-2">
                                 <LessonForm
                                    title={button.add_lesson}
                                    sectionId={section.id}
                                    handler={
                                       <Button variant="ghost" className="bg-muted hover:!bg-muted-foreground/10 h-8 w-full">
                                          <span>{button.add_lesson}</span>
                                       </Button>
                                    }
                                 />

                                 <DataSortModal
                                    title={dashboard.sort_items}
                                    data={section.section_lessons}
                                    handler={
                                       <Button variant="ghost" className="bg-muted hover:!bg-muted-foreground/10 h-8 w-full">
                                          <span>Sort Lessons</span>
                                       </Button>
                                    }
                                    onOrderChange={(newOrder) => {
                                       router.post(
                                          route('lesson.sort'),
                                          {
                                             sortedData: newOrder,
                                          },
                                          { preserveScroll: true },
                                       );
                                    }}
                                    renderContent={(lesson) => (
                                       <Card className="w-full px-4 py-3">
                                          <p>{lesson.title}</p>
                                       </Card>
                                    )}
                                 />

                                 <QuizForm
                                    title={button.add_quiz}
                                    sectionId={section.id}
                                    handler={
                                       <Button variant="ghost" className="bg-muted hover:!bg-muted-foreground/10 h-8 w-full">
                                          <span>{button.add_quiz}</span>
                                       </Button>
                                    }
                                 />

                                 <SectionForm
                                    title={dashboard.update_section}
                                    section={section}
                                    handler={
                                       <Button variant="secondary" className="h-8 w-full">
                                          <span>{dashboard.update_section}</span>
                                       </Button>
                                    }
                                 />

                                 <DeleteByInertia
                                    routePath={route('section.delete', {
                                       id: section.id,
                                    })}
                                    actionComponent={
                                       <Button
                                          variant="ghost"
                                          className="bg-destructive/8 hover:bg-destructive/6 text-destructive hover:text-destructive h-8 w-full"
                                       >
                                          {button.delete_section}
                                       </Button>
                                    }
                                 />
                              </PopoverContent>
                           </Popover>
                        </div>
                     </div>
                  </AccordionTrigger>

                  <AccordionContent className="space-y-4 p-4">
                     {section.section_lessons.length > 0 ? (
                        section.section_lessons.map((lesson: SectionLesson) => (
                           <div key={lesson.id} className="group border-border flex w-full items-center justify-between rounded-md border px-4 py-3">
                              <p>{lesson.title}</p>

                              <div className="invisible flex items-center gap-2 group-hover:visible">
                                 <ResourceModal
                                    lesson={lesson}
                                    title="Lesson Resources"
                                    handler={
                                       <Button variant="secondary" className="h-7 px-2">
                                          <FolderOpen className="h-3 w-3" /> <span>Resource</span>
                                       </Button>
                                    }
                                 />

                                 <LessonForm
                                    lesson={lesson}
                                    sectionId={section.id}
                                    title={dashboard.update_lesson}
                                    handler={
                                       <Button size="icon" variant="secondary" className="h-7 w-7">
                                          <Pencil className="h-3 w-3" />
                                       </Button>
                                    }
                                 />

                                 <DeleteByInertia
                                    routePath={route('lesson.delete', {
                                       id: lesson.id,
                                    })}
                                    actionComponent={
                                       <Button size="icon" variant="secondary" className="text-destructive h-7 w-7">
                                          <Trash2 className="h-3 w-3" />
                                       </Button>
                                    }
                                 />
                              </div>
                           </div>
                        ))
                     ) : (
                        <div className="text-muted-foreground py-4 text-center text-sm">No lessons found in this section.</div>
                     )}

                     {section.section_quizzes.map((quiz: SectionQuiz) => (
                        <div key={quiz.id} className="group border-border flex w-full items-center justify-between rounded-md border px-4 py-3">
                           <p>{quiz.title}</p>

                           <div className="invisible flex items-center gap-2 group-hover:visible">
                              <QuestionQuestions
                                 quiz={quiz}
                                 title={button.quiz_questions}
                                 handler={
                                    <Button size="icon" variant="secondary" className="h-7 w-7">
                                       <ListOrdered className="h-3 w-3" />
                                    </Button>
                                 }
                              />

                              <DeleteByInertia
                                 routePath={route('quiz.delete', {
                                    id: quiz.id,
                                 })}
                                 actionComponent={
                                    <Button size="icon" variant="secondary" className="text-destructive h-7 w-7">
                                       <Trash2 className="h-3 w-3" />
                                    </Button>
                                 }
                              />

                              <QuizForm
                                 quiz={quiz}
                                 title={dashboard.update_quiz}
                                 sectionId={section.id}
                                 handler={
                                    <Button size="icon" variant="secondary" className="h-7 w-7">
                                       <Pencil className="h-3 w-3" />
                                    </Button>
                                 }
                              />
                           </div>
                        </div>
                     ))}
                  </AccordionContent>
               </AccordionItem>
            ))}
         </Accordion>
      </Card>
   );
};

export default Curriculum;
