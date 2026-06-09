import StudentFeedback from '@/components/student-feedback';
import TableFooter from '@/components/table/table-footer';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { usePage } from '@inertiajs/react';
import { format } from 'date-fns';
import { Star } from 'lucide-react';
import { CourseDetailsProps } from '../show';

const CourseReviews = () => {
   const { props } = usePage<CourseDetailsProps>();
   const { translate } = props;
   const { frontend } = translate;

   return (
      <>
         <StudentFeedback totalReviews={props.totalReviews} />

         <div className="mt-6 border-t pt-6">
            <h3 className="mb-6 text-xl font-semibold">{frontend.student_reviews}</h3>

            <div className="space-y-6">
               {props.reviews.data.length > 0 ? (
                  props.reviews.data.map((review) => (
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

            <TableFooter
               className="mt-6"
               routeName="course.details"
               paginationInfo={props.reviews}
               routeParams={{ slug: props.course.slug, id: props.course.id }}
            />
         </div>
      </>
   );
};

export default CourseReviews;
