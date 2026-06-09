import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { systemCurrency } from '@/lib/utils';
import { ExamPreviewProps } from '@/types/page';
import { Link, router, usePage } from '@inertiajs/react';
import { Award, BookOpen, Calendar, Clock, Target } from 'lucide-react';

const CoursePreview = () => {
   const { auth, exam, system, wishlist, enrollment, translate } = usePage<ExamPreviewProps>().props;
   const { frontend } = translate;
   const currency = systemCurrency(system.fields['selling_currency']);

   const handleWishlist = () => {
      if (wishlist) {
         router.delete(route('exam-wishlists.destroy', exam.id));
      } else {
         router.post(route('exam-wishlists.store', exam.id));
      }
   };

   const enrollmentHandler = (exam: Exam) => {
      router.post(route('exam-enrollments.store'), {
         user_id: auth.user?.id,
         exam_id: exam.id,
         enrollment_type: 'free',
      });
   };

   return (
      <Card className="sticky top-24">
         <CardContent className="p-6">
            <img className="mb-4 w-full rounded-lg" src={exam.thumbnail ?? '/assets/images/blank-image.jpg'} alt="" />

            {enrollment ? (
               <div className="space-y-4">
                  <div className="rounded-lg bg-green-50 p-4 text-center">
                     <Award className="mx-auto mb-2 h-8 w-8 text-green-600" />
                     <p className="font-semibold text-green-900">You're enrolled!</p>
                  </div>
                  <Button asChild className="w-full">
                     <Link
                        href={route('student.exam.show', {
                           id: exam.id,
                           tab: 'attempts',
                        })}
                     >
                        View Exam
                     </Link>
                  </Button>
               </div>
            ) : (
               <div className="space-y-4">
                  <h2 className="text-4xl font-bold capitalize">
                     {exam.pricing_type === 'free' ? (
                        exam.pricing_type
                     ) : exam.discount ? (
                        <>
                           <span className="font-semibold">
                              {currency?.symbol}
                              {exam.discount_price}
                           </span>
                           <span className="text-muted-foreground ml-2 text-base font-medium line-through">
                              {currency?.symbol}
                              {exam.price}
                           </span>
                        </>
                     ) : (
                        <>
                           <span className="font-semibold">
                              {currency?.symbol}
                              {exam.price}
                           </span>
                        </>
                     )}
                  </h2>

                  <Button className="w-full px-1 sm:px-3" variant="outline" size="lg" onClick={handleWishlist}>
                     {wishlist ? frontend.remove_from_wishlist : frontend.add_to_wishlist}
                  </Button>

                  {exam.pricing_type === 'free' ? (
                     <Button size="lg" className="w-full" onClick={() => enrollmentHandler(exam)}>
                        {frontend.enroll_now}
                     </Button>
                  ) : (
                     <a href={route('payments.index', { from: 'web', item: 'exam', id: exam.id })}>
                        <Button size="lg" className="w-full">
                           {frontend.buy_now}
                        </Button>
                     </a>
                  )}
               </div>
            )}

            <Separator className="my-6" />

            <div className="space-y-3 text-sm">
               <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-gray-400" />
                  <span>
                     {exam.duration_hours > 0 && `${exam.duration_hours} hours `}
                     {exam.duration_minutes > 0 && `${exam.duration_minutes} minutes`}
                  </span>
               </div>
               <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-gray-400" />
                  <span>{exam.total_questions} questions</span>
               </div>
               <div className="flex items-center gap-2">
                  <Award className="h-4 w-4 text-gray-400" />
                  <span>{exam.max_attempts} attempts allowed</span>
               </div>
               <div className="flex items-center gap-2">
                  <Target className="h-4 w-4 text-gray-400" />
                  <span>{exam.pass_mark} marks to pass</span>
               </div>
               <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <span>{exam.expiry_type === 'lifetime' ? 'Lifetime access' : `${exam.expiry_duration} days access`}</span>
               </div>
            </div>
         </CardContent>
      </Card>
   );
};

export default CoursePreview;
