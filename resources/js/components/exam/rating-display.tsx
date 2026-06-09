import { cn } from '@/lib/utils';
import { Star } from 'lucide-react';

interface Props {
   rating?: number | null;
   reviewCount?: number;
   showCount?: boolean;
   size?: 'sm' | 'md' | 'lg';
   className?: string;
}

const RatingDisplay = ({ rating, reviewCount, showCount = true, size = 'md', className }: Props) => {
   const sizeClasses = {
      sm: 'h-3 w-3',
      md: 'h-4 w-4',
      lg: 'h-5 w-5',
   };

   const textSizeClasses = {
      sm: 'text-xs',
      md: 'text-sm',
      lg: 'text-base',
   };

   const isValidRating = typeof rating === 'number' && Number.isFinite(rating);
   const normalizedRating = isValidRating ? Math.min(Math.max(rating, 0), 5) : 0;

   return (
      <div className={cn('flex items-center gap-1', className)}>
         <div className="flex items-center">
            {[1, 2, 3, 4, 5].map((star) => (
               <Star
                  key={star}
                  className={cn(sizeClasses[size], star <= normalizedRating ? 'fill-yellow-400 text-yellow-400' : 'fill-gray-200 text-gray-200')}
               />
            ))}
         </div>
         <span className={cn('font-medium text-gray-700', textSizeClasses[size])}>{isValidRating ? normalizedRating.toFixed(1) : '—'}</span>
         {showCount && reviewCount !== undefined && <span className={cn('text-gray-500', textSizeClasses[size])}>({reviewCount})</span>}
      </div>
   );
};

export default RatingDisplay;
