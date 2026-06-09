import LiveClassStatus from '@/components/live-class-status';
import Tabs from '@/components/tabs';
import TiptapRenderer from '@/components/text-editor/tiptap-renderer/client-renderer';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Card, CardHeader } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CoursePlayerProps } from '@/types/page';
import { Link, router, usePage } from '@inertiajs/react';
import { format, parseISO } from 'date-fns';
import { Calendar, Clock } from 'lucide-react';
import Lesson from './lesson';
import Quiz from './quiz';

interface ContentListProps {
   completedContents: CompletedContent[];
   courseCompletion: {
      percentage: string;
      totalContents: number;
      completedContents: number;
   };
}

const ContentList = ({ completedContents, courseCompletion }: ContentListProps) => {
   const { props } = usePage<CoursePlayerProps>();
   const { course, zoomConfig, section, watchHistory, translate } = props;
   const { button, common } = translate;

   // Get live classes from course data
   const liveClasses = course.live_classes || [];

   // Get the last section
   const lastSection = props.course.sections[props.course.sections.length - 1];

   // Get the last content based on current_watching_type
   let lastContent;
   if (watchHistory.current_watching_type === 'lesson') {
      lastContent = lastSection.section_lessons.find((lesson) => lesson.id.toString() === watchHistory.current_watching_id);
   } else {
      lastContent = lastSection.section_quizzes.find((quiz) => quiz.id.toString() === watchHistory.current_watching_id);
   }

   const finishCourseHandler = () => {
      router.get(route('course.player.finish', { watch_history: watchHistory.id }));
   };

   return (
      <div className="relative h-full md:h-[calc(100vh-60px)]">
         <Tabs defaultValue="lessons" className="w-full">
            <TabsList className="h-12 w-full">
               <TabsTrigger value="lessons" className="h-10 w-full cursor-pointer">
                  {button.lessons}
               </TabsTrigger>
               <TabsTrigger value="live-classes" className="h-10 w-full cursor-pointer">
                  {button.live_classes}
               </TabsTrigger>
            </TabsList>

            <ScrollArea className="h-[calc(100vh-48px)] md:h-[calc(100vh-108px)]">
               <TabsContent value="lessons" className="mt-0">
                  <CardHeader className="px-4 py-6 text-center">
                     <div className="w-full space-y-1">
                        <p className="text-muted-foreground flex items-center text-xs font-medium">
                           <span>{courseCompletion.percentage}%</span>
                           <span>
                              {common.completed} {courseCompletion.completedContents}/{courseCompletion.totalContents}
                           </span>
                        </p>

                        <Progress value={Number(courseCompletion.percentage)} className="[&>div]:bg-secondary-foreground h-1" />
                     </div>
                  </CardHeader>

                  <Separator />

                  {section ? (
                     <Accordion
                        type="single"
                        collapsible
                        // type="multiple"
                        className="space-y-4 px-4 py-6"
                        defaultValue={section.id as string}
                     >
                        {props.course.sections.map((section, ind) => (
                           <AccordionItem key={section.id} value={section.id as string} className="overflow-hidden rounded-lg border">
                              <AccordionTrigger className="[&[data-state=open]]:!bg-muted px-4 py-3 text-base hover:no-underline">
                                 {ind + 1}. {section.title}
                              </AccordionTrigger>
                              <AccordionContent className="space-y-2 p-2">
                                 {section.section_lessons.length > 0 ? (
                                    <>
                                       {section.section_lessons.map((lesson) => (
                                          <Lesson key={lesson.id} lesson={lesson} completed={completedContents} />
                                       ))}

                                       {section.section_quizzes.map((quiz) => (
                                          <Quiz key={quiz.id} quiz={quiz} completed={completedContents} />
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

                        {watchHistory.completion_date ? (
                           <div>
                              <Link
                                 href={route('student.course.show', {
                                    id: course.id,
                                    tab: 'certificate',
                                 })}
                              >
                                 <Button className="w-full" variant="secondary" size="lg" disabled={courseCompletion.percentage !== '100.00'}>
                                    Course Certificate
                                 </Button>
                              </Link>
                           </div>
                        ) : (
                           <div>
                              {!watchHistory.next_watching_id ? (
                                 <Button className="w-full" variant="secondary" size="lg" onClick={finishCourseHandler}>
                                    Finish Course
                                 </Button>
                              ) : (
                                 <Button className="w-full" variant="secondary" size="lg" disabled>
                                    Finish Course
                                 </Button>
                              )}
                           </div>
                        )}
                     </Accordion>
                  ) : (
                     <div className="p-6 text-center">
                        <p>There is no section added</p>
                     </div>
                  )}
               </TabsContent>
               <TabsContent value="live-classes" className="mt-0">
                  <div className="space-y-4 p-4">
                     {liveClasses.length <= 0 ? (
                        <Card className="p-8 text-center">
                           <Calendar className="mx-auto mb-4 h-12 w-12 text-gray-400" />
                           <h3 className="mb-2 text-lg font-medium">No Live Classes Scheduled</h3>
                           <p className="text-gray-500">Schedule your first live class to get started with Zoom.</p>
                        </Card>
                     ) : (
                        liveClasses.map((liveClass) => {
                           return (
                              <Card key={liveClass.id} className="space-y-4 p-4">
                                 <p className="text-base font-medium">{liveClass.class_topic}</p>

                                 <div className="flex items-center justify-between gap-2">
                                    <div className="text-muted-foreground space-y-3 text-sm">
                                       <div className="flex items-center gap-2">
                                          <Clock className="h-4 w-4" />
                                          <span>{format(parseISO(liveClass.class_date_and_time), 'p')}</span>
                                       </div>
                                       <div className="flex items-center gap-2">
                                          <Calendar className="h-4 w-4" />
                                          <span>{format(parseISO(liveClass.class_date_and_time), 'PPP')}</span>
                                       </div>
                                    </div>

                                    <div className="flex flex-col gap-2">
                                       <LiveClassStatus courseId={course.id} liveClass={liveClass} zoomConfig={zoomConfig} />
                                    </div>
                                 </div>

                                 {liveClass.class_note && (
                                    <Accordion type="single" collapsible className="w-full">
                                       <AccordionItem value="item-1" className="bg-muted overflow-hidden rounded-lg border-none">
                                          <AccordionTrigger className="[&[data-state=open]]:!bg-secondary-lighter px-3 py-1.5 text-sm font-normal hover:no-underline">
                                             Class Note
                                          </AccordionTrigger>
                                          <AccordionContent className="p-3">
                                             <TiptapRenderer>{liveClass.class_note}</TiptapRenderer>
                                          </AccordionContent>
                                       </AccordionItem>
                                    </Accordion>
                                 )}
                              </Card>
                           );
                        })
                     )}
                  </div>
               </TabsContent>
            </ScrollArea>
         </Tabs>
      </div>
   );
};

export default ContentList;
