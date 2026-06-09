import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { CoursePlayerProps } from '@/types/page';
import { Link, usePage } from '@inertiajs/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const LessonControl = ({ className }: { className?: string }) => {
   const { props } = usePage<CoursePlayerProps>();
   const { watchHistory } = props;

   return (
      <>
         {watchHistory.prev_watching_id ? (
            <Link
               href={route('course.player', {
                  type: watchHistory.prev_watching_type,
                  watch_history: watchHistory.id,
                  lesson_id: watchHistory.prev_watching_id,
               })}
            >
               <Button
                  variant="outline"
                  className={cn(
                     'bg-secondary-foreground text-primary-foreground hover:bg-secondary-foreground hover:text-primary-foreground absolute top-1/2 left-0 z-10 h-10 w-8 -translate-y-1/2 rounded-none rounded-r border-none p-0 shadow-none hover:opacity-85',
                     className,
                  )}
               >
                  <ChevronLeft className="!h-6 !w-6" />
               </Button>
            </Link>
         ) : (
            <Button
               disabled
               variant="outline"
               className={cn(
                  'bg-secondary-foreground text-primary-foreground hover:bg-secondary-foreground hover:text-primary-foreground absolute top-1/2 left-0 z-10 h-10 w-8 -translate-y-1/2 rounded-none rounded-r border-none p-0 shadow-none',
                  className,
               )}
            >
               <ChevronLeft className="!h-6 !w-6" />
            </Button>
         )}

         {watchHistory.next_watching_id ? (
            <Link
               href={route('course.player', {
                  type: watchHistory.next_watching_type,
                  watch_history: watchHistory.id,
                  lesson_id: watchHistory.next_watching_id,
               })}
            >
               <Button
                  variant="outline"
                  className={cn(
                     'bg-secondary-foreground text-primary-foreground hover:bg-secondary-foreground hover:text-primary-foreground absolute top-1/2 right-0 z-10 h-10 w-8 -translate-y-1/2 rounded-none rounded-l border-none p-0 shadow-none hover:opacity-85',
                     className,
                  )}
               >
                  <ChevronRight className="!h-6 !w-6" />
               </Button>
            </Link>
         ) : (
            <Button
               disabled
               variant="outline"
               className={cn(
                  'bg-secondary-foreground text-primary-foreground hover:bg-secondary-foreground hover:text-primary-foreground absolute top-1/2 right-0 z-10 h-10 w-8 -translate-y-1/2 rounded-none rounded-l border-none p-0 shadow-none',
                  className,
               )}
            >
               <ChevronRight className="!h-6 !w-6" />
            </Button>
         )}
      </>
   );
};

export default LessonControl;
