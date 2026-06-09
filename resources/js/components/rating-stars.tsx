import { cn } from '@/lib/utils';
import { Star } from 'lucide-react';

interface Props {
   rating: number;
   starClass?: string;
   wrapperClass?: string;
}

const RatingStars = ({ rating, starClass, wrapperClass }: Props) => {
   const renderRatingStars = (rating: number) => {
      const stars = [];
      const fullStars = Math.floor(rating);

      for (let i = 0; i < 5; i++) {
         if (i < fullStars) {
            stars.push(<Star key={i} className={cn('h-5 w-5 fill-yellow-400 text-yellow-400', starClass)} />);
         } else {
            stars.push(<Star key={i} className={cn('h-5 w-5 text-yellow-400', starClass)} />);
         }
      }

      return stars;
   };

   return <div className={cn('flex items-center gap-[1px]', wrapperClass)}>{renderRatingStars(rating)}</div>;
};

export default RatingStars;
