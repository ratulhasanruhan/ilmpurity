import { Progress } from '@/components/ui/progress';
import { useLang } from '@/hooks/use-lang';
import { Star } from 'lucide-react';

interface OverviewProps {
   total_reviews: number;
   rating_distribution: {
      stars: number;
      percentage: number;
   }[];
}

const ReviewsOverview = ({ total_reviews, rating_distribution }: OverviewProps) => {
   const { common, frontend } = useLang();

   // Calculate average rating from distribution
   const calculateAverageRating = () => {
      if (!rating_distribution?.length || total_reviews === 0) {
         return 0;
      }

      // Calculate weighted average
      const totalScore = rating_distribution.reduce((sum, item) => {
         return sum + item.stars * (item.percentage / 100);
      }, 0);

      // Round to 1 decimal place
      return Math.round(totalScore * 10) / 10;
   };

   const averageRating = calculateAverageRating();

   const renderStars = (rating: number, filled: boolean = true): JSX.Element[] => {
      return Array.from({ length: 5 }, (_, index) => (
         <Star
            key={index}
            className={`h-4 w-4 ${
               filled && index < rating - 1
                  ? 'fill-amber-400 text-amber-400'
                  : filled && index < Math.floor(rating - 1) + 0.5
                    ? 'fill-amber-400 text-amber-400'
                    : 'text-gray-300'
            }`}
         />
      ));
   };

   return (
      <div>
         <div className="mb-6 flex items-center justify-between gap-2">
            <h2 className="text-xl font-semibold">{frontend.student_reviews}</h2>
            <p className="font-semibold">
               {total_reviews} {total_reviews === 1 ? 'Review' : 'Reviews'}
            </p>
         </div>

         <div className="flex items-center gap-4 sm:gap-8">
            {/* Overall Rating */}
            <div className="flex min-w-[100px] flex-col items-center sm:min-w-[120px]">
               <div className="mb-2 text-6xl font-bold text-amber-600">{averageRating}</div>
               <div className="mb-2 flex gap-1">{renderStars(1 + averageRating)}</div>
               <div className="text-sm font-medium text-amber-600">{common.rating}</div>
            </div>

            {/* Rating Breakdown */}
            <div className="w-full space-y-1.5 sm:flex-1">
               {rating_distribution.map((item) => (
                  <div key={item.stars} className="flex items-center gap-2">
                     {/* Stars */}
                     <div className="flex w-20 flex-shrink-0 gap-1">{renderStars(item.stars)}</div>

                     {/* Progress Bar */}
                     <div className="min-w-0 flex-1">
                        <Progress value={item.percentage} />
                     </div>

                     {/* Percentage */}
                     <div className="w-12 flex-shrink-0 text-right">
                        <span className="text-sm font-medium">{item.percentage ? Number(item.percentage).toFixed(2) : '0'}%</span>
                     </div>
                  </div>
               ))}
            </div>
         </div>
      </div>
   );
};

export default ReviewsOverview;
