import InputError from '@/components/input-error';
import LoadingButton from '@/components/loading-button';
import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { useForm } from '@inertiajs/react';
import { Star } from 'lucide-react';
import { useEffect, useState } from 'react';

interface Props {
   examId: number;
   review?: ExamReview;
   handler: React.ReactNode;
   onSuccess?: () => void;
}

const ReviewForm = ({ examId, review, handler, onSuccess }: Props) => {
   const [open, setOpen] = useState(false);
   const [hoveredRating, setHoveredRating] = useState(0);

   const { data, setData, post, put, reset, processing, errors } = useForm({
      exam_id: examId,
      rating: review?.rating || 5,
      review: review?.review || '',
   });

   const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();

      if (review) {
         put(route('student.exam-reviews.update', review.id), {
            preserveScroll: true,
            onSuccess: () => {
               setOpen(false);
               onSuccess?.();
            },
         });
      } else {
         post(route('student.exam-reviews.store'), {
            preserveScroll: true,
            onSuccess: () => {
               reset();
               setOpen(false);
               onSuccess?.();
            },
         });
      }
   };

   useEffect(() => {
      if (!open) {
         reset();
      }
   }, [open]);

   return (
      <Dialog open={open} onOpenChange={setOpen}>
         <DialogTrigger asChild>{handler}</DialogTrigger>

         <DialogContent>
            <DialogHeader>
               <DialogTitle>{review ? 'Edit Review' : 'Write a Review'}</DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSubmit}>
               <div className="space-y-4 py-4">
                  <div>
                     <Label>Rating *</Label>
                     <div className="mt-2 flex gap-1">
                        {[1, 2, 3, 4, 5].map((rating) => (
                           <button
                              key={rating}
                              type="button"
                              onMouseEnter={() => setHoveredRating(rating)}
                              onMouseLeave={() => setHoveredRating(0)}
                              onClick={() => setData('rating', rating)}
                              className="transition-transform hover:scale-110"
                           >
                              <Star
                                 className={cn(
                                    'h-8 w-8',
                                    rating <= (hoveredRating || data.rating) ? 'fill-yellow-400 text-yellow-400' : 'fill-gray-200 text-gray-200',
                                 )}
                              />
                           </button>
                        ))}
                     </div>
                     <InputError message={errors.rating} />
                  </div>

                  <div>
                     <Label htmlFor="review">Your Review (Optional)</Label>
                     <Textarea
                        id="review"
                        name="review"
                        value={data.review}
                        onChange={(e) => setData('review', e.target.value)}
                        placeholder="Share your experience with this exam..."
                        rows={4}
                        className="mt-2"
                     />
                     <InputError message={errors.review} />
                  </div>
               </div>

               <DialogFooter className="gap-2">
                  <DialogClose asChild>
                     <Button type="button" variant="outline">
                        Cancel
                     </Button>
                  </DialogClose>
                  <LoadingButton loading={processing} disabled={processing}>
                     {review ? 'Update Review' : 'Submit Review'}
                  </LoadingButton>
               </DialogFooter>
            </form>
         </DialogContent>
      </Dialog>
   );
};

export default ReviewForm;
