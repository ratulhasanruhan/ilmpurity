import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import axios from 'axios';
import { Check, Loader2, X } from 'lucide-react';
import { useState } from 'react';

interface Props {
   examId?: number;
   onCouponApplied?: (coupon: ExamCoupon) => void;
   onCouponRemoved?: () => void;
   className?: string;
}

const CouponInput = ({ examId, onCouponApplied, onCouponRemoved, className }: Props) => {
   const [code, setCode] = useState('');
   const [loading, setLoading] = useState(false);
   const [appliedCoupon, setAppliedCoupon] = useState<ExamCoupon | null>(null);
   const [error, setError] = useState('');

   const handleApply = async () => {
      if (!code.trim()) {
         setError('Please enter a coupon code');
         return;
      }

      setLoading(true);
      setError('');

      try {
         const response = await axios.post(route('admin.exam-coupons.verify'), {
            code: code.trim(),
            exam_id: examId,
         });

         if (response.data.valid) {
            setAppliedCoupon(response.data.coupon);
            onCouponApplied?.(response.data.coupon);
            setCode('');
         }
      } catch (err: any) {
         setError(err.response?.data?.message || 'Invalid or expired coupon code');
      } finally {
         setLoading(false);
      }
   };

   const handleRemove = () => {
      setAppliedCoupon(null);
      setError('');
      onCouponRemoved?.();
   };

   if (appliedCoupon) {
      return (
         <div className={cn('space-y-2', className)}>
            <div className="flex items-center justify-between rounded-lg border border-green-200 bg-green-50 p-3">
               <div className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-green-600" />
                  <div>
                     <p className="text-sm font-medium text-green-900">Coupon Applied</p>
                     <p className="text-xs text-green-700">
                        Code: <span className="font-semibold">{appliedCoupon.code}</span>
                     </p>
                  </div>
               </div>
               <Button variant="ghost" size="sm" onClick={handleRemove}>
                  <X className="h-4 w-4" />
               </Button>
            </div>
            <div className="flex items-center gap-2">
               <Badge variant="secondary" className="text-green-700">
                  {appliedCoupon.discount_type === 'percentage' ? `${appliedCoupon.discount}% OFF` : `$${appliedCoupon.discount} OFF`}
               </Badge>
            </div>
         </div>
      );
   }

   return (
      <div className={cn('space-y-2', className)}>
         <div className="flex gap-2">
            <Input
               value={code}
               onChange={(e) => {
                  setCode(e.target.value.toUpperCase());
                  setError('');
               }}
               placeholder="Enter coupon code"
               disabled={loading}
               onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                     e.preventDefault();
                     handleApply();
                  }
               }}
            />
            <Button onClick={handleApply} disabled={loading || !code.trim()}>
               {loading ? (
                  <>
                     <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                     Verifying...
                  </>
               ) : (
                  'Apply'
               )}
            </Button>
         </div>
         {error && (
            <p className="flex items-center gap-1 text-sm text-red-600">
               <X className="h-4 w-4" />
               {error}
            </p>
         )}
      </div>
   );
};

export default CouponInput;
