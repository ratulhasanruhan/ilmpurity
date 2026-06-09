import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import VideoPlayer from '@/components/video-player';
import { getPageSection } from '@/lib/page';
import { IntroPageProps } from '@/types/page';
import { usePage } from '@inertiajs/react';
import { File, FileQuestion, FileText, Image, Play, Video } from 'lucide-react';
import Section from '../section';

const TopCourse = () => {
   const { props } = usePage<IntroPageProps>();
   const { page, topCourse, customize } = props;
   const topCourseSection = getPageSection(page, 'top_course');
   const videoTypes = ['video', 'video_url'];

   return (
      <div className="overflow-y-hidden">
         <Section customize={customize} pageSection={topCourseSection} containerClass="py-20 relative">
            {topCourse ? (
               <div className="mx-auto w-full max-w-[960px]">
                  <div className="relative mb-10">
                     <img
                        className="relative z-10 w-full rounded-3xl md:rounded-4xl"
                        src={topCourse.thumbnail ?? '/assets/images/blank-image.jpg'}
                        alt=""
                     />

                     {topCourse.preview && (
                        <Dialog>
                           <DialogTrigger asChild>
                              <button className="absolute top-1/2 left-1/2 z-20 -translate-x-1/2 -translate-y-1/2 cursor-pointer rounded-full bg-black/70 p-4 transition-transform hover:scale-110">
                                 <Play className="h-6 w-6 text-white" />
                              </button>
                           </DialogTrigger>

                           <DialogContent className="overflow-hidden p-0 md:min-w-3xl">
                              <VideoPlayer
                                 source={{
                                    type: 'video' as const,
                                    sources: [
                                       {
                                          src: topCourse.preview,
                                          type: 'video/mp4' as const,
                                       },
                                    ],
                                 }}
                              />
                           </DialogContent>
                        </Dialog>
                     )}
                  </div>

                  <h6 className="relative z-10 py-5 text-2xl font-bold md:text-[28px]">{topCourse.title}</h6>

                  <Accordion
                     type="single"
                     collapsible
                     className="relative z-10 space-y-4"
                     defaultValue={topCourse.sections.length > 0 ? (topCourse.sections[0].id as string) : ''}
                  >
                     {topCourse.sections.map((section, index) => (
                        <AccordionItem key={section.id} value={section.id as string} className="overflow-hidden rounded-lg border">
                           <AccordionTrigger className="[&[data-state=open]]:!bg-muted cursor-pointer px-4 py-3 text-base hover:no-underline">
                              Module {index + 1}: {section.title}
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
                                    <p>There is no lesson added</p>
                                 </div>
                              )}
                           </AccordionContent>
                        </AccordionItem>
                     ))}
                  </Accordion>
               </div>
            ) : (
               <div className="relative z-10 mx-auto w-full max-w-[960px] space-y-4">
                  <p className="text-center text-lg font-medium">Top Course Sections. There is no course added.</p>
               </div>
            )}

            <div className="after:pointer-events-none after:absolute after:top-[50%] after:left-0 after:h-[240px] after:w-[240px] after:rounded-full after:bg-[rgba(97,95,255,1)] after:blur-[310px] after:content-['']"></div>

            <div className="after:pointer-events-none after:absolute after:top-[40%] after:right-0 after:h-[240px] after:w-[240px] after:rounded-full after:bg-[rgba(0,167,111,1)] after:blur-[240px] after:content-['']"></div>
         </Section>
      </div>
   );
};

export default TopCourse;
