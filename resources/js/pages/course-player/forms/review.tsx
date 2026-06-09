import DeleteModal from '@/components/inertia/delete-modal';
import InputError from '@/components/input-error';
import LoadingButton from '@/components/loading-button';
import TableFooter from '@/components/table/table-footer';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { CoursePlayerProps } from '@/types/page';
import { useForm, usePage } from '@inertiajs/react';
import { format } from 'date-fns';
import { Star, Trash } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import ReviewEdit from './review-edit';

const ReviewForm = () => {
   const { props } = usePage<CoursePlayerProps>();
   const { translate } = props;
   const { button, input, frontend, common } = translate;
   const [hoverRating, setHoverRating] = useState(0);
   const { data, setData, post, errors, processing, reset } = useForm({
      rating: 0,
      review: '',
      user_id: props.auth.user.id,
      course_id: props.course.id,
   });

   const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();

      post(route('course-reviews.store'), {
         onError: (errors) => {
            if (errors.user_id) {
               toast.error(errors.user_id);
            }
            if (errors.course_id) {
               toast.error(errors.course_id);
            }
         },
         onSuccess: () => {
            reset();
         },
      });
   };
   return (
      <div>
         {props.course.instructor.user_id !== props.auth.user.id && (
            <div className="border-t py-6">
               <div className="flex items-center justify-between">
                  <h3 className="mb-6 text-xl font-semibold">{props.userReview ? frontend.review : frontend.submit_review}</h3>

                  {props.userReview && (
                     <div className="flex items-center gap-2">
                        <ReviewEdit review={props.userReview} />
                        <DeleteModal
                           routePath={route('course-reviews.destroy', props.userReview.id)}
                           actionComponent={
                              <Button size="icon" variant="secondary">
                                 <Trash />
                              </Button>
                           }
                        />
                     </div>
                  )}
               </div>

               {props.userReview ? (
                  <div>
                     <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                           <button key={star} type="button">
                              <Star
                                 className={cn(
                                    'h-6 w-6',
                                    star <= (hoverRating || props.userReview?.rating || 0) ? 'fill-amber-400 text-amber-400' : 'text-gray-300',
                                 )}
                              />
                           </button>
                        ))}
                     </div>

                     <p className="mt-3 text-sm">{props.userReview.review}</p>
                  </div>
               ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                     {/* Star Rating */}
                     <div className="space-y-2">
                        <Label className="text-sm font-medium">{common.rating} *</Label>
                        <div className="flex gap-1">
                           {[1, 2, 3, 4, 5].map((star) => (
                              <button
                                 key={star}
                                 type="button"
                                 className="transition-transform hover:scale-110"
                                 onMouseEnter={() => setHoverRating(star)}
                                 onMouseLeave={() => setHoverRating(0)}
                                 onClick={() => setData('rating', star)}
                              >
                                 <Star
                                    className={cn(
                                       'h-8 w-8 cursor-pointer transition-colors',
                                       star <= (hoverRating || data.rating) ? 'fill-amber-400 text-amber-400' : 'text-gray-300 hover:text-amber-200',
                                    )}
                                 />
                              </button>
                           ))}
                        </div>
                        {data.rating > 0 && (
                           <p className="text-muted-foreground text-sm">
                              {frontend.you_rated_this} {data.rating} {data.rating !== 1 ? frontend.stars : frontend.star}
                           </p>
                        )}
                        <InputError message={errors.rating} />
                     </div>

                     {/* Comment Field */}
                     <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-700">{frontend.review} *</Label>
                        <Textarea
                           required
                           value={data.review}
                           onChange={(e) => setData('review', e.target.value)}
                           placeholder={input.review_placeholder}
                           className="min-h-[120px] w-full resize-none"
                        />
                        <InputError message={errors.review} />
                     </div>

                     <LoadingButton loading={processing}>{button.submit_review}</LoadingButton>
                  </form>
               )}
            </div>
         )}

         <div className="border-t py-6">
            <h3 className="mb-6 text-xl font-semibold">{frontend.student_reviews}</h3>

            <div className="space-y-6">
               {props.reviews.data.length > 0 ? (
                  props.reviews.data.map((review: any) => (
                     <div key={review.id}>
                        <div className="flex items-center gap-2">
                           <Avatar className="h-8 w-8">
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
               routeName="course.player"
               paginationInfo={props.reviews}
               routeParams={{ slug: props.course.slug, watch_history: props.watchHistory.id, lesson_id: props.watchHistory.current_watching_id }}
            />
         </div>
      </div>
   );
};

export default ReviewForm;
