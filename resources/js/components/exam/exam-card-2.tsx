import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Link } from '@inertiajs/react';

interface Props {
   enrollment: ExamEnrollment;
   className?: string;
}

const ExamCard2 = ({ enrollment, className }: Props) => {
   const { exam } = enrollment;
   const examUrl = route('student.exam.show', { id: exam.id, tab: 'attempts' });

   return (
      <Card className={cn('group', className)}>
         <Link href={examUrl}>
            <div className={cn('relative overflow-hidden', 'aspect-video')}>
               {exam.thumbnail ? (
                  <img src={exam.thumbnail} alt={exam.title} className="h-full w-full object-cover transition-transform group-hover:scale-105" />
               ) : (
                  <div className="from-primary/20 to-primary/5 flex h-full items-center justify-center bg-gradient-to-br">
                     <span className="text-primary/30 text-4xl font-bold">{exam.title.charAt(0)}</span>
                  </div>
               )}
               {exam.level && <Badge className="absolute top-2 left-2 capitalize">{exam.level}</Badge>}
            </div>
         </Link>

         <div className={cn('flex flex-col')}>
            <CardContent className="p-4">
               <Link href={examUrl}>
                  <h3 className="group-hover:text-primary mb-2 line-clamp-2 text-lg font-semibold transition-colors">{exam.title}</h3>
               </Link>

               {exam.short_description && <p className="text-muted-foreground mb-3 line-clamp-2 text-sm">{exam.short_description}</p>}

               <div className="text-muted-foreground mb-3 flex items-center gap-1 text-sm">
                  <span>by</span>
                  <span className="font-medium">{exam.instructor?.user?.name || 'Instructor'}</span>
               </div>
            </CardContent>
         </div>
      </Card>
   );
};

export default ExamCard2;
