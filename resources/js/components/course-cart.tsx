import { SharedData } from '@/types/global';
import { Link, usePage } from '@inertiajs/react';
import { ShoppingCart } from 'lucide-react';
import { Button } from './ui/button';

const CourseCart = () => {
   const { cartCount } = usePage<SharedData>().props;

   return (
      <Link href={route('course-cart.index')}>
         <div className="relative">
            {cartCount && cartCount > 0 ? (
               <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-medium text-white">
                  {cartCount}
               </span>
            ) : null}

            <Button variant="secondary" size="icon" className="relative h-9 w-9 rounded-full p-0">
               <ShoppingCart className="!h-5 !w-5" />
            </Button>
         </div>
      </Link>
   );
};

export default CourseCart;
