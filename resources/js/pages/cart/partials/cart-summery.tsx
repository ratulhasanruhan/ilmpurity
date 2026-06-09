import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { systemCurrency } from '@/lib/utils';
import { router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { CartProps } from '..';

const CartSummery = () => {
   const { props } = usePage<CartProps>();
   const [couponCode, setCouponCode] = useState('');
   const { cart, subtotal, coupon, discountedPrice, taxAmount, totalPrice, translate } = props;
   const { frontend, button, input } = translate;
   const taxPercentage = taxAmount > 0 && discountedPrice > 0 ? ((taxAmount / discountedPrice) * 100).toFixed(0) : 0;
   const currency = systemCurrency(props.system.fields['selling_currency']);

   return (
      <Card className="sticky top-24">
         <CardContent className="p-6">
            <h2 className="mb-4 text-xl font-bold">{frontend.payment_summary}</h2>

            <div className="space-y-4">
               <div className="flex justify-between">
                  <span className="text-muted-foreground">{frontend.sub_total}</span>
                  <span>
                     {subtotal} {currency?.symbol}
                  </span>
               </div>

               {coupon && (
                  <div className="flex justify-between text-green-600">
                     <span>
                        {frontend.discount} ({coupon.code})
                     </span>
                     <span>
                        - {(subtotal - discountedPrice).toFixed(2)} {currency?.symbol}
                     </span>
                  </div>
               )}

               <div className="flex justify-between">
                  <span className="text-muted-foreground">
                     {frontend.tax} ({taxPercentage ?? 0}%)
                  </span>
                  <span>
                     + {taxAmount.toFixed(2)} {currency?.symbol}
                  </span>
               </div>

               <Separator />

               <div className="flex justify-between font-bold">
                  <span>{frontend.total}</span>
                  <span>
                     {totalPrice.toFixed(2)} {currency?.symbol}
                  </span>
               </div>

               <div className="pt-4">
                  <div className="flex gap-2">
                     <div className="flex-1">
                        <Input
                           value={couponCode}
                           defaultValue={coupon ? coupon.code : ''}
                           onChange={(e) => setCouponCode(e.target.value)}
                           placeholder={input.coupon_placeholder}
                        />
                     </div>
                     <Button type="button" onClick={() => router.get(route('course-cart.index', { coupon: couponCode }))}>
                        {button.apply}
                     </Button>
                  </div>
               </div>

               {cart.length > 0 && (
                  <Button asChild size="lg" type="button" className="mt-4 w-full" disabled={cart.length === 0}>
                     Test
                     {/* <a href={route('payments.index', { from: 'web',  coupon: coupon ? coupon.code : '' })}>{button.continue}</a> */}
                  </Button>
               )}
            </div>
         </CardContent>
      </Card>
   );
};

export default CartSummery;
