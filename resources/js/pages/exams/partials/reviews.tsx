import ReviewsOverview from '@/components/reviews-overview';
import TableFooter from '@/components/table/table-footer';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { ExamPreviewProps } from '@/types/page';
import { usePage } from '@inertiajs/react';
import { format } from 'date-fns';
import { Star } from 'lucide-react';

const Reviews = () => {
   const { exam, reviews, reviewsStatistics, translate } = usePage<ExamPreviewProps>().props;
   const { frontend } = translate;

   return (
      <>
         <ReviewsOverview total_reviews={reviewsStatistics.total_reviews} rating_distribution={reviewsStatistics.rating_distribution} />

         <div className="mt-6 border-t pt-6">
            <h3 className="mb-6 text-xl font-semibold">{frontend.student_reviews}</h3>

            <div className="space-y-6">
               {reviews.data.length > 0 ? (
                  reviews.data.map((review) => (
                     <div key={review.id}>
                        <div className="flex items-center gap-2">
                           <Avatar className="mt-1 h-8 w-8">
                              <AvatarImage src={review.user.photo || ''} alt={review.user.name} className="object-cover" />
                              <AvatarFallback>{review.user.name.charAt(0)}</AvatarFallback>
                           </Avatar>
                           <div>
                              <p className="font-semibold">{review.user.name}</p>

                              <div className="flex items-center gap-2">
                                 <div className="flex gap-1">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                       <button key={star} type="button">
                                          <Star
                                             className={cn('h-4 w-4', star <= review.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-300')}
                                          />
                                       </button>
                                    ))}
                                 </div>
                                 <p className="text-muted-foreground text-xs">{format(new Date(review.created_at), 'MMM d, yyyy h:mm a')}</p>
                              </div>
                           </div>
                        </div>

                        <p className="mt-3 text-sm">{review.review}</p>
                     </div>
                  ))
               ) : (
                  <p className="p-3 text-center">{frontend.no_reviews_found}</p>
               )}
            </div>

            <TableFooter className="mt-6" routeName="exams.details" paginationInfo={reviews} routeParams={{ slug: exam.slug, id: exam.id }} />
         </div>
      </>
   );
};

export default Reviews;
