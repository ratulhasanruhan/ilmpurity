import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { CoursePlayerProps } from '@/types/page';
import { Link, usePage } from '@inertiajs/react';
import { format } from 'date-fns';
import { ClipboardList, Lock } from 'lucide-react';
import QuizResultDialog from './quiz-result-dialog';

interface Props {
   quiz: SectionQuiz;
   completed: { id: number | string; type: string }[];
}

const QuizIcon = ({ quiz, latestSubmission }: { quiz: SectionQuiz; latestSubmission: QuizSubmission | null }) => {
   const { props } = usePage<CoursePlayerProps>();
   const { translate } = props;
   const { frontend } = translate;
   const isPassed = latestSubmission?.is_passed;
   const hasAttempted = latestSubmission !== null;

   return (
      <div className="flex items-center gap-3">
         {/* Quiz Icon */}
         <div className="bg-primary/10 flex h-12 w-12 items-center justify-center rounded-lg">
            <ClipboardList className="text-primary h-6 w-6" />
         </div>

         {/* Quiz Info */}
         <div className="flex-1">
            <div className="flex items-center gap-2">
               <p className="text-primary text-base font-medium">{quiz.title}</p>
               {latestSubmission && (
                  <Badge variant={isPassed ? 'default' : 'destructive'} className="text-xs">
                     {isPassed ? frontend.passed : frontend.not_passed}
                  </Badge>
               )}
               {!hasAttempted && (
                  <Badge variant="destructive" className="text-xs">
                     Not Submitted
                  </Badge>
               )}
            </div>
            <p className="text-muted-foreground text-sm">{format(new Date(quiz.created_at), 'PPpp')}</p>
         </div>
      </div>
   );
};

const QuizStatus = ({ quiz, completed }: Props) => {
   const { props } = usePage<CoursePlayerProps>();
   const { watchHistory, translate } = props;
   const { frontend } = translate;

   const isCompleted = completed.some((item) => item.type === 'quiz' && item.id == quiz.id);
   const isCurrentLesson = watchHistory.current_watching_type === 'quiz' && watchHistory.current_watching_id == quiz.id;
   const isNext = watchHistory.next_watching_type === 'quiz' && quiz.id == watchHistory.next_watching_id;

   const latestSubmission =
      quiz.quiz_submissions && quiz.quiz_submissions.length > 0 ? quiz.quiz_submissions[quiz.quiz_submissions.length - 1] : null;

   const totalMarks = latestSubmission?.total_marks || 0;
   const hasAttempted = latestSubmission !== null;

   return (
      <>
         {isCompleted || isCurrentLesson || isNext ? (
            <div className="bg-card flex items-center justify-between gap-3 rounded-lg border p-3">
               <div
                  className={cn(
                     'flex flex-1 items-center gap-3',
                     isCompleted ? 'text-blue-500' : isCurrentLesson ? 'text-green-500' : isNext ? 'text-primary' : 'text-gray-500',
                  )}
               >
                  <QuizIcon quiz={quiz} latestSubmission={latestSubmission} />
               </div>

               <div className="flex flex-col items-center justify-end gap-3 md:flex-row">
                  {/* Marks Display */}
                  {hasAttempted && (
                     <div className="text-right">
                        <p className="text-sm font-medium">
                           {frontend.total_marks}: {totalMarks}/{quiz.total_mark}
                        </p>
                     </div>
                  )}

                  {/* Action Button */}
                  {hasAttempted ? (
                     <QuizResultDialog quiz={quiz} submission={latestSubmission} />
                  ) : (
                     <Button size="sm" asChild>
                        <Link
                           href={route('course.player', {
                              type: 'quiz',
                              watch_history: watchHistory.id,
                              lesson_id: quiz.id,
                           })}
                        >
                           {'Take Quiz'}
                        </Link>
                     </Button>
                  )}
               </div>
            </div>
         ) : (
            <div className="bg-card flex items-center justify-between gap-3 rounded-lg border p-3">
               <div className="flex flex-1 items-center gap-3 text-gray-500">
                  <Lock className="h-5 w-5" />

                  <QuizIcon quiz={quiz} latestSubmission={null} />
               </div>

               <div className="flex items-center gap-3">
                  {/* Marks Display */}
                  {hasAttempted && (
                     <div className="text-right">
                        <p className="text-sm font-medium text-gray-500">
                           {frontend.total_marks}: {totalMarks}/{quiz.total_mark}
                        </p>
                     </div>
                  )}
               </div>
            </div>
         )}
      </>
   );
};

export default QuizStatus;
