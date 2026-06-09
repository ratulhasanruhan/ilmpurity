import { cn } from '@/lib/utils';
import { CoursePlayerProps } from '@/types/page';
import { Link, usePage } from '@inertiajs/react';
import { Circle, CircleCheck, CirclePause, CirclePlay, FileQuestion, Lock } from 'lucide-react';

interface Props {
   quiz: SectionQuiz;
   completed: { id: number | string; type: string }[];
}

const QuizIcon = ({ quiz }: { quiz: SectionQuiz }) => {
   return (
      <div className="flex items-center gap-2">
         <div className="bg-secondary flex h-6 w-6 items-center justify-center rounded-full">
            <FileQuestion className="h-4 w-4" />
         </div>

         <p>{quiz.title}</p>
      </div>
   );
};

const Quiz = ({ quiz, completed }: Props) => {
   const { props } = usePage<CoursePlayerProps>();
   const { course, watchHistory } = props;

   const dripContent = Boolean(course.drip_content);
   const isCompleted = completed.some((item) => item.type === 'quiz' && item.id == quiz.id);
   const isCurrentLesson = watchHistory.current_watching_type === 'quiz' && watchHistory.current_watching_id == quiz.id;
   const isNext = watchHistory.next_watching_type === 'quiz' && quiz.id == watchHistory.next_watching_id;

   return !dripContent ? (
      <div className="flex items-center justify-between gap-3 rounded-sm border p-2 py-2 md:gap-3">
         <Link
            className={cn(
               'flex cursor-pointer items-center gap-3 py-1',
               isCompleted ? 'text-blue-500' : isCurrentLesson ? 'text-green-500' : 'text-primary',
            )}
            href={route('course.player', {
               type: 'quiz',
               watch_history: watchHistory.id,
               lesson_id: quiz.id,
            })}
         >
            {isCompleted ? <CircleCheck className="h-4 w-4" /> : <Circle className="h-4 w-4" />}

            <QuizIcon quiz={quiz} />
         </Link>

         <span>{quiz.duration}</span>
      </div>
   ) : (
      <>
         {isCompleted || isCurrentLesson || isNext ? (
            <div className="flex items-center justify-between gap-3 rounded-sm border p-2 py-2 md:gap-3">
               <Link
                  className={cn(
                     'flex cursor-pointer items-center gap-3 py-1',
                     isCompleted ? 'text-blue-500' : isCurrentLesson ? 'text-green-500' : isNext ? 'text-primary' : 'text-gray-500',
                  )}
                  href={route('course.player', {
                     type: 'quiz',
                     watch_history: watchHistory.id,
                     lesson_id: quiz.id,
                  })}
               >
                  {isCompleted ? (
                     <CircleCheck className="h-4 w-4" />
                  ) : isCurrentLesson ? (
                     <CirclePlay className="h-4 w-4" />
                  ) : isNext ? (
                     <CirclePause className="h-4 w-4" />
                  ) : (
                     <Lock className="h-4 w-4" />
                  )}

                  <QuizIcon quiz={quiz} />
               </Link>

               <span>{quiz.duration}</span>
            </div>
         ) : (
            <div className="flex items-center justify-between gap-3 rounded-sm border p-2 py-2 md:gap-3">
               <div className="flex items-center gap-3 py-1 text-gray-500">
                  <Lock className="h-4 w-4" />

                  <QuizIcon quiz={quiz} />
               </div>

               <span>{quiz.duration}</span>
            </div>
         )}
      </>
   );
};

export default Quiz;
