import LessonIcons from '@/components/lesson-icons';
import { cn } from '@/lib/utils';
import { StudentCourseProps } from '@/types/page';
import { Link, usePage } from '@inertiajs/react';
import { ReactNode } from 'react';

interface Props {
   lesson: SectionLesson;
   completed: { id: number | string; type: string }[];
}

const LessonWrapper = ({ lesson, children }: { lesson: SectionLesson; children: ReactNode }) => (
   <div className="relative flex items-center justify-between rounded-sm border p-2 md:gap-3">
      {children}

      {['video', 'video_url'].includes(lesson.lesson_type) && (
         <span className="absolute top-0.5 right-1 text-xs md:relative md:text-sm">{lesson.duration}</span>
      )}
   </div>
);

const Lesson = ({ lesson, completed }: Props) => {
   const { props } = usePage<StudentCourseProps>();
   const { course, watchHistory } = props;

   const dripContent = Boolean(course.drip_content);
   const isNext = lesson.id == watchHistory.next_watching_id;
   const isCompleted = completed.some((item) => item.type === 'lesson' && item.id == lesson.id);
   const isCurrentLesson = watchHistory.current_watching_id == lesson.id;

   return !dripContent ? (
      <LessonWrapper lesson={lesson}>
         <Link
            className={cn(
               'flex cursor-pointer items-center gap-3 py-1',
               isCompleted ? 'text-blue-500' : isCurrentLesson ? 'text-green-500' : 'text-primary',
            )}
            href={route('course.player', {
               type: 'lesson',
               watch_history: watchHistory.id,
               lesson_id: lesson.id,
            })}
         >
            <LessonIcons type="active" lesson={lesson} dripContent={true} isCompleted={isCompleted} />

            <p>{lesson.title}</p>
         </Link>
      </LessonWrapper>
   ) : (
      <>
         {isCompleted || isCurrentLesson || isNext ? (
            <LessonWrapper lesson={lesson}>
               <Link
                  className={cn(
                     'flex cursor-pointer items-center gap-3 py-1',
                     isCompleted ? 'text-blue-500' : isCurrentLesson ? 'text-green-500' : isNext ? 'text-primary' : 'text-gray-500',
                  )}
                  href={route('course.player', {
                     type: 'lesson',
                     watch_history: watchHistory.id,
                     lesson_id: lesson.id,
                  })}
               >
                  <LessonIcons
                     type="active"
                     lesson={lesson}
                     dripContent={false}
                     isCompleted={isCompleted}
                     isCurrentLesson={isCurrentLesson}
                     isNext={isNext}
                  />

                  <p>{lesson.title}</p>
               </Link>
            </LessonWrapper>
         ) : (
            <LessonWrapper lesson={lesson}>
               <div className="flex items-center gap-3 py-1 text-gray-500">
                  <LessonIcons type="inactive" lesson={lesson} dripContent={true} isCompleted={isCompleted} />

                  <p>{lesson.title}</p>
               </div>
            </LessonWrapper>
         )}
      </>
   );
};

export default Lesson;
