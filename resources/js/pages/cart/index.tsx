import { Card, CardContent } from '@/components/ui/card';
import LandingLayout from '@/layouts/landing-layout';
import { SharedData } from '@/types/global';
import { ReactNode } from 'react';
import CartSummery from './partials/cart-summery';
import CourseCard from './partials/course-card';

export interface CartProps extends SharedData {
   cart: CourseCart[];
   coupon: CourseCoupon | null;
   subtotal: number;
   discountedPrice: number;
   taxAmount: number;
   totalPrice: number;
   checkoutProcess: boolean;
}

const Index = (props: CartProps) => {
   const { cart, translate } = props;
   const { frontend } = translate;

   return (
      <div className="container grid grid-cols-1 gap-8 py-6 lg:grid-cols-3">
         {/* Cart Items Section */}
         <div className="lg:col-span-2">
            <h1 className="mb-6 text-2xl font-bold">{frontend.cart_items}</h1>

            {cart.length === 0 ? (
               <Card>
                  <CardContent className="p-6">
                     <p className="text-muted-foreground py-8 text-center">{frontend.your_cart_is_empty}</p>
                  </CardContent>
               </Card>
            ) : (
               <div className="space-y-4">
                  {cart.map((item) => (
                     <CourseCard key={item.id} course={item.course} />
                  ))}
               </div>
            )}
         </div>

         {/* Payment Summary Section */}
         <div>
            <CartSummery />
         </div>
      </div>
   );
};

Index.layout = (page: ReactNode) => <LandingLayout children={page} customizable={false} />;

export default Index;
