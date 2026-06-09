import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Link } from '@inertiajs/react';
import { Clock, Heart, ShoppingCart, Users } from 'lucide-react';
import RatingDisplay from './rating-display';

interface Props {
   exam: Exam;
   variant?: 'default' | 'compact';
   viewType?: 'grid' | 'list';
   onAddToCart?: (exam: Exam) => void;
   onAddToWishlist?: (exam: Exam) => void;
   className?: string;
}

const ExamCard1 = ({ exam, variant = 'default', viewType = 'grid', onAddToCart, onAddToWishlist, className }: Props) => {
   const isCompact = variant === 'compact';
   const examUrl = route('exams.details', { slug: exam.slug, id: exam.id });

   return (
      <Card className={cn('group', className, viewType === 'list' && 'flex flex-row')}>
         <Link href={examUrl} className={cn(viewType === 'list' && 'w-1/3')}>
            <div className={cn('relative overflow-hidden', viewType === 'grid' ? 'aspect-video' : 'h-full min-h-[200px]')}>
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

         <div className={cn('flex flex-col', viewType === 'list' && 'flex-1')}>
            <CardContent className="p-4">
               <Link href={examUrl}>
                  <h3 className="group-hover:text-primary mb-2 line-clamp-2 text-lg font-semibold transition-colors">{exam.title}</h3>
               </Link>

               {!isCompact && exam.short_description && <p className="text-muted-foreground mb-3 line-clamp-2 text-sm">{exam.short_description}</p>}

               <div className="text-muted-foreground mb-3 flex items-center gap-1 text-sm">
                  <span>by</span>
                  <span className="font-medium">{exam.instructor?.user?.name || 'Instructor'}</span>
               </div>

               <div className="text-muted-foreground mb-3 flex flex-wrap items-center gap-3 text-sm">
                  <div className="flex items-center gap-1">
                     <Clock className="h-4 w-4" />
                     <span>
                        {exam.duration_hours}h {exam.duration_minutes}m
                     </span>
                  </div>
                  <div className="flex items-center gap-1">
                     <Users className="h-4 w-4" />
                     <span>{exam.enrollments_count || 0} students</span>
                  </div>
               </div>

               {exam.average_rating !== undefined && (
                  <RatingDisplay rating={exam.average_rating} reviewCount={exam.reviews_count} size="sm" className="mb-3" />
               )}
            </CardContent>

            <CardFooter className={cn('flex items-center justify-between border-t p-4', viewType === 'list' && 'mt-auto')}>
               <div className="flex items-baseline gap-2">
                  {exam.pricing_type === 'free' ? (
                     <span className="text-lg font-bold text-green-600">Free</span>
                  ) : (
                     <>
                        <span className="text-2xl font-bold">${exam.discount_price}</span>
                        {exam.discount > 0 && <span className="text-sm text-gray-500 line-through">${exam.price}</span>}
                     </>
                  )}
               </div>

               <div className="flex items-center gap-2">
                  {onAddToWishlist && (
                     <Button
                        variant="outline"
                        size="icon"
                        onClick={(e) => {
                           e.preventDefault();
                           onAddToWishlist(exam);
                        }}
                     >
                        <Heart className="h-4 w-4" />
                     </Button>
                  )}
                  {onAddToCart && exam.pricing_type === 'paid' && (
                     <Button
                        variant="default"
                        size="icon"
                        onClick={(e) => {
                           e.preventDefault();
                           onAddToCart(exam);
                        }}
                     >
                        <ShoppingCart className="h-4 w-4" />
                     </Button>
                  )}
               </div>
            </CardFooter>
         </div>
      </Card>
   );
};

export default ExamCard1;
