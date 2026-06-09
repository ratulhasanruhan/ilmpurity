import InputError from '@/components/input-error';
import LoadingButton from '@/components/loading-button';
import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { SharedData } from '@/types/global';
import { useForm, usePage } from '@inertiajs/react';
import { SquarePen, Star } from 'lucide-react';
import { useState } from 'react';

const ReviewEdit = ({ review }: { review: CourseReview }) => {
   const [open, setOpen] = useState(false);
   const [hoverRating, setHoverRating] = useState(0);
   const { props } = usePage<SharedData>();
   const { translate } = props;
   const { button, input, frontend, common } = translate;
   const { data, setData, put, errors, processing, reset } = useForm({
      rating: review.rating,
      review: review.review,
   });

   const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();

      put(route('course-reviews.update', review.id), {
         onSuccess: () => {
            setOpen(false);
            reset();
         },
      });
   };

   return (
      <Dialog open={open} onOpenChange={setOpen}>
         <DialogTrigger asChild>
            <Button size="icon" variant="secondary">
               <SquarePen className="h-4 w-4" />
            </Button>
         </DialogTrigger>

         <DialogContent>
            <DialogHeader>
               <DialogTitle>{frontend.edit_review}</DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-6">
               {/* Star Rating */}
               <div className="space-y-2">
                  <Label className="text-sm font-medium">{input.rating} *</Label>
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
                  <Label className="text-sm font-medium text-gray-700">{input.review} *</Label>
                  <Textarea
                     required
                     value={data.review}
                     onChange={(e) => setData('review', e.target.value)}
                     placeholder={input.description}
                     className="min-h-[120px] w-full resize-none"
                  />
                  <InputError message={errors.review} />
               </div>

               <DialogFooter>
                  <LoadingButton loading={processing}>
                     {button.update} {button.review}
                  </LoadingButton>

                  <DialogClose asChild>
                     <Button variant="outline">{button.cancel}</Button>
                  </DialogClose>
               </DialogFooter>
            </form>
         </DialogContent>
      </Dialog>
   );
};

export default ReviewEdit;
