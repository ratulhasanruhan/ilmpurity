import { Star } from 'lucide-react';
import { Card } from '../ui/card';

interface Review {
   name: string;
   image: string;
   rating: number | string;
   address: string;
   description: string;
}

const ReviewCard1 = ({ review }: { review: Review }) => {
   return (
      <Card className="flex h-full flex-col border-none p-5">
         <div className="mb-4 flex items-center">
            {[...Array(parseInt(review.rating as string))].map((_, i) => (
               <Star key={i} className="h-5 w-5 fill-yellow-500 text-yellow-400" />
            ))}
         </div>
         <p className="text-muted-foreground mb-4 flex-grow text-sm">"{review.description}"</p>

         <div className="flex items-center">
            <div className="mr-3 h-10 w-10 overflow-hidden rounded-full bg-gray-200">
               <img src={review.image || '/assets/icons/avatar.png'} alt={review.name} className="h-full w-full object-cover" />
            </div>
            <div>
               <p className="text-sm font-medium">{review.name}</p>
               <p className="text-muted-foreground">{review.address}</p>
            </div>
         </div>
      </Card>
   );
};

export default ReviewCard1;
