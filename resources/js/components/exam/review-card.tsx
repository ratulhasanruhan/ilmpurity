import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { usePage } from '@inertiajs/react';
import { format, parseISO } from 'date-fns';
import { Pencil, Trash2 } from 'lucide-react';
import RatingDisplay from './rating-display';

interface Props {
   review: ExamReview;
   onEdit?: (review: ExamReview) => void;
   onDelete?: (review: ExamReview) => void;
}

const ReviewCard = ({ review, onEdit, onDelete }: Props) => {
   const { auth } = usePage().props as any;
   const isOwnReview = auth?.user?.id === review.user_id;

   return (
      <Card>
         <CardContent className="p-4">
            <div className="flex items-start justify-between gap-4">
               <div className="flex-1">
                  <div className="mb-2 flex items-center gap-3">
                     <div className="bg-primary/10 text-primary flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold">
                        {review.user?.name?.charAt(0).toUpperCase() || 'U'}
                     </div>
                     <div>
                        <p className="font-medium text-gray-900">{review.user?.name || 'Anonymous'}</p>
                        <p className="text-xs text-gray-500">{format(parseISO(review.created_at), 'MMM dd, yyyy')}</p>
                     </div>
                  </div>

                  <RatingDisplay rating={review.rating} showCount={false} size="sm" className="mb-2" />

                  {review.review && <p className="text-sm text-gray-700">{review.review}</p>}
               </div>

               {isOwnReview && (onEdit || onDelete) && (
                  <div className="flex gap-2">
                     {onEdit && (
                        <Button variant="ghost" size="icon" onClick={() => onEdit(review)}>
                           <Pencil className="h-4 w-4" />
                        </Button>
                     )}
                     {onDelete && (
                        <Button variant="ghost" size="icon" onClick={() => onDelete(review)}>
                           <Trash2 className="h-4 w-4 text-red-600" />
                        </Button>
                     )}
                  </div>
               )}
            </div>
         </CardContent>
      </Card>
   );
};

export default ReviewCard;
