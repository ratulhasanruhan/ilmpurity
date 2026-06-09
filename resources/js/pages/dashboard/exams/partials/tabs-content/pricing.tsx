import { DateTimePicker } from '@/components/datetime-picker';
import InputError from '@/components/input-error';
import LoadingButton from '@/components/loading-button';
import { Accordion, AccordionContent, AccordionItem } from '@/components/ui/accordion';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useForm, usePage } from '@inertiajs/react';
import { ExamUpdateProps } from '../../update';

const Pricing = () => {
   const { props } = usePage<ExamUpdateProps>();
   const { tab, exam } = props;

   const { data, setData, post, errors, processing } = useForm({
      tab: tab,
      pricing_type: exam.pricing_type || 'paid',
      price: exam.price || '',
      discount: Boolean(exam.discount) || false,
      discount_price: exam.discount_price || '',
      expiry_type: exam.expiry_type || '',
      expiry_duration: exam.expiry_duration ? new Date(exam.expiry_duration) : new Date(),
   });

   // Handle form submission
   const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      post(route('exams.update', { exam: exam.id }));
   };

   const pricingTypes = ['free', 'paid'];

   return (
      <Card className="container p-4 sm:p-6">
         <form onSubmit={handleSubmit} className="space-y-4">
            <Accordion collapsible type="single" value={data.pricing_type}>
               <div>
                  <Label>Pricing Type *</Label>
                  <RadioGroup
                     defaultValue={data.pricing_type}
                     className="flex items-center space-x-4 pt-2 pb-1"
                     onValueChange={(value: 'free' | 'paid') => setData('pricing_type', value)}
                  >
                     {pricingTypes.map((type) => (
                        <div key={type} className="flex items-center space-x-2">
                           <RadioGroupItem className="cursor-pointer" id={type} value={type} />
                           <Label htmlFor={type} className="cursor-pointer capitalize">
                              {type}
                           </Label>
                        </div>
                     ))}
                  </RadioGroup>
                  <InputError message={errors.pricing_type} />
               </div>

               <AccordionItem value="paid" className="border-none">
                  <AccordionContent className="space-y-4 p-0.5">
                     <div className="pt-3">
                        <Label>Price *</Label>
                        <Input
                           type="number"
                           name="price"
                           value={data.price.toString()}
                           onChange={(e) => setData('price', e.target.value)}
                           placeholder="Enter your exam price ($0)"
                        />
                        <InputError message={errors.price} />
                     </div>

                     <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                           <Checkbox
                              id="discount"
                              name="discount"
                              checked={data.discount}
                              onCheckedChange={(checked) => {
                                 setData('discount', checked === true);
                              }}
                           />
                           <Label htmlFor="discount" className="cursor-pointer">
                              Exam Discount
                           </Label>
                        </div>

                        {data.discount && (
                           <div>
                              <Input
                                 type="number"
                                 name="discount_price"
                                 value={data.discount_price.toString()}
                                 onChange={(e) => setData('discount_price', e.target.value)}
                                 placeholder="Enter discount price"
                              />
                              <InputError message={errors.discount_price} />
                           </div>
                        )}
                     </div>
                  </AccordionContent>
               </AccordionItem>
            </Accordion>

            <Accordion collapsible type="single" value={data.expiry_type}>
               <div>
                  <Label>Expiry period type</Label>
                  <RadioGroup
                     defaultValue={data.expiry_type}
                     className="flex items-center space-x-4 pt-2 pb-1"
                     onValueChange={(value) => setData('expiry_type', value)}
                  >
                     {['lifetime', 'limited_time'].map((expiry) => (
                        <div key={expiry} className="flex items-center space-x-2">
                           <RadioGroupItem className="cursor-pointer" id={expiry} value={expiry} />
                           <Label htmlFor={expiry} className="capitalize">
                              {expiry}
                           </Label>
                        </div>
                     ))}
                  </RadioGroup>
                  <InputError message={errors.expiry_type} />
               </div>

               <AccordionItem value="limited_time" className="border-none">
                  <AccordionContent className="space-y-4 p-0.5">
                     <div className="pt-3">
                        <Label>Expiry date</Label>
                        <DateTimePicker date={data.expiry_duration} setDate={(date) => setData('expiry_duration', date)} />
                        <InputError message={errors.expiry_duration} />
                     </div>
                  </AccordionContent>
               </AccordionItem>
            </Accordion>

            <div className="mt-8">
               <LoadingButton loading={processing}>Save Changes</LoadingButton>
            </div>
         </form>
      </Card>
   );
};

export default Pricing;
