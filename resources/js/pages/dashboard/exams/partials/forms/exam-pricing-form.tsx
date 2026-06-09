import InputError from '@/components/input-error';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { onHandleChange } from '@/lib/inertia';
import { useEffect } from 'react';

interface Props {
   data: any;
   setData: (key: string, value: any) => void;
   errors: any;
}

const ExamPricingForm = ({ data, setData, errors }: Props) => {
   // Calculate discount price automatically
   useEffect(() => {
      if (data.price && data.discount) {
         const discountAmount = (data.price * data.discount) / 100;
         const discountPrice = data.price - discountAmount;
         setData('discount_price', discountPrice.toFixed(2));
      } else {
         setData('discount_price', data.price || 0);
      }
   }, [data.price, data.discount]);

   return (
      <div className="space-y-4">
         <div>
            <Label>Pricing Type *</Label>
            <RadioGroup
               value={data.pricing_type}
               onValueChange={(value) => setData('pricing_type', value)}
               className="flex items-center space-x-4 pt-2"
            >
               <div className="flex items-center space-x-2">
                  <RadioGroupItem value="free" id="free" />
                  <Label htmlFor="free" className="cursor-pointer font-normal">
                     Free
                  </Label>
               </div>
               <div className="flex items-center space-x-2">
                  <RadioGroupItem value="paid" id="paid" />
                  <Label htmlFor="paid" className="cursor-pointer font-normal">
                     Paid
                  </Label>
               </div>
            </RadioGroup>
            <InputError message={errors.pricing_type} />
         </div>

         {data.pricing_type === 'paid' && (
            <>
               <div>
                  <Label htmlFor="price">Price (USD) *</Label>
                  <Input
                     id="price"
                     name="price"
                     type="number"
                     value={data.price}
                     onChange={(e) => onHandleChange(e, setData)}
                     placeholder="0.00"
                     step="0.01"
                     min="0"
                     required
                  />
                  <InputError message={errors.price} />
               </div>

               <div>
                  <Label htmlFor="discount">Discount (%)</Label>
                  <Input
                     id="discount"
                     name="discount"
                     type="number"
                     value={data.discount}
                     onChange={(e) => onHandleChange(e, setData)}
                     placeholder="0"
                     min="0"
                     max="100"
                  />
                  <InputError message={errors.discount} />
               </div>

               {data.discount > 0 && (
                  <div className="rounded-lg bg-green-50 p-4">
                     <p className="text-sm text-green-800">
                        <span className="font-semibold">Final Price:</span> ${data.discount_price} (
                        {data.discount}% off from ${data.price})
                     </p>
                  </div>
               )}
            </>
         )}

         <div className="border-t pt-4">
            <Label>Access Duration *</Label>
            <RadioGroup
               value={data.expiry_type || 'lifetime'}
               onValueChange={(value) => setData('expiry_type', value)}
               className="space-y-3 pt-2"
            >
               <div className="flex items-center space-x-2">
                  <RadioGroupItem value="lifetime" id="lifetime" />
                  <Label htmlFor="lifetime" className="cursor-pointer font-normal">
                     Lifetime Access
                  </Label>
               </div>
               <div className="flex items-center space-x-2">
                  <RadioGroupItem value="limited" id="limited" />
                  <Label htmlFor="limited" className="cursor-pointer font-normal">
                     Limited Access
                  </Label>
               </div>
            </RadioGroup>
            <InputError message={errors.expiry_type} />
         </div>

         {data.expiry_type === 'limited' && (
            <div>
               <Label htmlFor="expiry_duration">Access Duration (Days) *</Label>
               <Input
                  id="expiry_duration"
                  name="expiry_duration"
                  type="number"
                  value={data.expiry_duration}
                  onChange={(e) => onHandleChange(e, setData)}
                  placeholder="30"
                  min="1"
                  required
               />
               <p className="mt-1 text-sm text-gray-500">Students will have access for this many days after enrollment</p>
               <InputError message={errors.expiry_duration} />
            </div>
         )}
      </div>
   );
};

export default ExamPricingForm;

