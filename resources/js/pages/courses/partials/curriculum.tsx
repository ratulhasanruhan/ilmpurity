import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Separator } from '@/components/ui/separator';
import { SharedData } from '@/types/global';
import { usePage } from '@inertiajs/react';
import { File, FileQuestion, FileText, Image, Video } from 'lucide-react';

const Curriculum = ({ course }: { course: Course }) => {
   const { props } = usePage<SharedData>();
   const { translate } = props;
   const { frontend } = translate;
   const videoTypes = ['video', 'video_url'];

   return (
      <>
         <h6 className="mb-4 text-xl font-semibold">{frontend.course_curriculum}</h6>

         <Separator className="my-6" />

         <Accordion
            type="single"
            collapsible
            className="space-y-4"
            defaultValue={course.sections.length > 0 ? (course.sections[0].id as string) : ''}
         >
            {course.sections.map((section, index) => (
               <AccordionItem key={section.id} value={section.id as string} className="overflow-hidden rounded-lg border">
                  <AccordionTrigger className="[&[data-state=open]]:!bg-muted px-4 py-3 text-base hover:no-underline">
                     {index + 1}. {section.title}
                  </AccordionTrigger>
                  <AccordionContent className="space-y-1 p-4">
                     {section.section_lessons.length > 0 ? (
                        <>
                           {section.section_lessons.map((lesson) => (
                              <div key={lesson.id} className="flex items-center justify-between gap-3 py-2">
                                 <div className="flex items-center gap-2">
                                    <div className="bg-secondary flex h-6 w-6 items-center justify-center rounded-full">
                                       {videoTypes.includes(lesson.lesson_type) && <Video className="h-4 w-4" />}

                                       {['document', 'iframe'].includes(lesson.lesson_type) && <File className="h-4 w-4" />}

                                       {lesson.lesson_type === 'text' && <FileText className="h-4 w-4" />}

                                       {lesson.lesson_type === 'image' && <Image className="h-4 w-4" />}
                                    </div>

                                    <p>{lesson.title}</p>
                                 </div>

                                 {videoTypes.includes(lesson.lesson_type) && <span>{lesson.duration}</span>}
                              </div>
                           ))}

                           {section.section_quizzes.map((quiz) => (
                              <div key={quiz.id} className="flex items-center justify-between gap-3 py-2">
                                 <div className="flex items-center gap-2">
                                    <div className="bg-secondary flex h-6 w-6 items-center justify-center rounded-full">
                                       <FileQuestion className="h-4 w-4" />
                                    </div>

                                    <p>{quiz.title}</p>
                                 </div>

                                 <span>{quiz.duration}</span>
                              </div>
                           ))}
                        </>
                     ) : (
                        <div className="px-4 py-3 text-center">
                           <p>{frontend.there_is_no_lesson_added}</p>
                        </div>
                     )}
                  </AccordionContent>
               </AccordionItem>
            ))}
         </Accordion>
      </>
   );
};

export default Curriculum;
