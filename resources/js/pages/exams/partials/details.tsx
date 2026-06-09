import { Separator } from '@/components/ui/separator';
import { ExamPreviewProps } from '@/types/page';
import { usePage } from '@inertiajs/react';
import { Award, BookOpen, Calendar, Check, Clock, Target, Users } from 'lucide-react';

const Details = () => {
   const { exam, translate } = usePage<ExamPreviewProps>().props;
   const { frontend } = translate;

   return (
      <div className="space-y-6">
         <div className="grid grid-cols-2 gap-6">
            <div className="flex items-start gap-3">
               <Clock className="mt-1 h-5 w-5 text-gray-400" />
               <div>
                  <p className="font-semibold">Duration</p>
                  <p className="text-sm text-gray-600">
                     {exam.duration_hours > 0 && `${exam.duration_hours}h `}
                     {exam.duration_minutes > 0 && `${exam.duration_minutes}m`}
                  </p>
               </div>
            </div>
            <div className="flex items-start gap-3">
               <BookOpen className="mt-1 h-5 w-5 text-gray-400" />
               <div>
                  <p className="font-semibold">Questions</p>
                  <p className="text-sm text-gray-600">{exam.total_questions} questions</p>
               </div>
            </div>
            <div className="flex items-start gap-3">
               <Target className="mt-1 h-5 w-5 text-gray-400" />
               <div>
                  <p className="font-semibold">Pass Mark</p>
                  <p className="text-sm text-gray-600">{exam.pass_mark} marks</p>
               </div>
            </div>
            <div className="flex items-start gap-3">
               <Award className="mt-1 h-5 w-5 text-gray-400" />
               <div>
                  <p className="font-semibold">Max Attempts</p>
                  <p className="text-sm text-gray-600">{exam.max_attempts} attempts</p>
               </div>
            </div>
            <div className="flex items-start gap-3">
               <Users className="mt-1 h-5 w-5 text-gray-400" />
               <div>
                  <p className="font-semibold">Enrolled Students</p>
                  <p className="text-sm text-gray-600">{exam.enrollments_count ?? 0}</p>
               </div>
            </div>
            <div className="flex items-start gap-3">
               <Calendar className="mt-1 h-5 w-5 text-gray-400" />
               <div>
                  <p className="font-semibold">Access</p>
                  <p className="text-sm text-gray-600">{exam.expiry_type === 'lifetime' ? 'Lifetime' : `${exam.expiry_duration} days`}</p>
                  {/* {exam.expiry_type === 'lifetime' ? 'Lifetime access' : `${exam.expiry_duration} days access`} */}
               </div>
            </div>
         </div>

         <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
               <h6 className="mb-4 text-xl font-semibold">{frontend.requirements}</h6>

               <Separator className="my-4" />

               <div className="space-y-4">
                  {exam.requirements?.map(({ id, requirement }) => (
                     <div key={id} className="flex gap-3">
                        <div className="bg-secondary-light mt-0.5 flex h-5 w-full max-w-5 items-center justify-center rounded-full">
                           <Check className="text-secondary-foreground h-4 w-4 shrink-0" />
                        </div>
                        <p className="text-muted-foreground">{requirement}</p>
                     </div>
                  ))}
               </div>
            </div>

            <div>
               <h6 className="mb-4 text-xl font-semibold">{frontend.outcomes}</h6>

               <Separator className="my-4" />

               <div className="space-y-4">
                  {exam.outcomes?.map(({ id, outcome }) => (
                     <div key={id} className="flex gap-3">
                        <div className="bg-secondary-light mt-0.5 flex h-5 w-full max-w-5 items-center justify-center rounded-full">
                           <Check className="text-secondary-foreground h-4 w-4 shrink-0" />
                        </div>
                        <p className="text-muted-foreground">{outcome}</p>
                     </div>
                  ))}
               </div>
            </div>
         </div>
      </div>
   );
};

export default Details;
