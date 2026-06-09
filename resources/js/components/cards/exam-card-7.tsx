import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Link } from '@inertiajs/react';
import ButtonGradientPrimary from '../button-gradient-primary';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';

interface Props {
   exam: Exam;
   attempts: ExamAttempt[];
   bestAttempt: ExamAttempt | null;
   className?: string;
}

const ExamCard7 = ({ exam, attempts, bestAttempt, className }: Props) => {
   // Calculate progress based on attempts
   const totalAttempts = attempts?.length || 0;
   const completedAttempts = attempts?.filter((a) => a.status === 'completed').length || 0;
   const progress = exam.max_attempts > 0 ? (totalAttempts / exam.max_attempts) * 100 : 0;
   const progressPercentage = Math.min(progress, 100);

   // Get best score percentage
   const bestScore =
      bestAttempt && Number(bestAttempt.total_marks) > 0
         ? Math.round((Number(bestAttempt.obtained_marks) / Number(bestAttempt.total_marks)) * 100 * 100) / 100
         : 0;

   return (
      <Card className={cn('flex flex-col justify-between overflow-hidden !border md:flex-row', className)}>
         <CardHeader className="h-full w-full p-0 md:min-h-full md:max-w-[340px]">
            <img
               src={exam.thumbnail || '/assets/images/blank-image.jpg'}
               alt={exam.title}
               className="h-full w-full object-cover md:min-h-[220px]"
               onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = '/assets/images/blank-image.jpg';
               }}
            />
         </CardHeader>

         <CardContent className="flex w-full flex-col justify-between p-4">
            <div>
               <div className="mb-3 flex items-center gap-2">
                  <div className="flex items-center gap-2">
                     <Avatar className="h-8 w-8">
                        <AvatarImage src={exam.instructor?.user?.photo || ''} alt={exam.instructor?.user?.name} className="object-cover" />
                        <AvatarFallback>IM</AvatarFallback>
                     </Avatar>

                     <p className="text-sm font-medium">{exam.instructor?.user?.name || 'Instructor'}</p>
                  </div>
               </div>
               <p className="hover:text-secondary-foreground text-sm font-semibold">{exam.title}</p>
            </div>

            <div className="space-y-2">
               <div className="w-full space-y-2 pt-4 pb-2">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                     <div className="w-full">
                        <p className="text-muted-foreground flex items-center justify-between text-sm font-medium">
                           <span>Attempts</span>
                           <span>
                              {totalAttempts} / {exam.max_attempts}
                           </span>
                        </p>
                        <Progress value={progressPercentage} className="h-1.5" />
                     </div>

                     <div className="w-full">
                        <p className="text-muted-foreground flex items-center justify-between text-sm font-medium">
                           <span>Best Score</span>
                           <span>
                              {bestAttempt?.obtained_marks ?? 0} / {bestAttempt?.total_marks ?? 0} ({bestScore}%)
                           </span>
                        </p>
                        <Progress value={bestScore} className="h-1.5" />
                     </div>
                  </div>

                  {bestAttempt && (
                     <div className="mt-2 flex items-center gap-2">
                        {bestAttempt.is_passed ? <Badge className="bg-green-600">Passed</Badge> : <Badge variant="destructive">Failed</Badge>}
                        <span className="text-muted-foreground text-xs">Pass Mark: {exam.pass_mark}%</span>
                     </div>
                  )}
               </div>

               {totalAttempts < exam.max_attempts && (
                  <ButtonGradientPrimary
                     asChild
                     shadow={false}
                     containerClass="w-full"
                     className="to-primary-light hover:to-primary-light h-9 w-full"
                  >
                     <Link method="post" href={route('exam-attempts.start', exam.id)} data={{ exam_id: exam.id }}>
                        Start Exam
                     </Link>
                  </ButtonGradientPrimary>
               )}
            </div>
         </CardContent>
      </Card>
   );
};

export default ExamCard7;
