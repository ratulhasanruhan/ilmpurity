import InputError from '@/components/input-error';
import LoadingButton from '@/components/loading-button';
import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { onHandleChange } from '@/lib/inertia';
import { useForm } from '@inertiajs/react';
import { Shuffle } from 'lucide-react';
import { useEffect, useState } from 'react';

interface Props {
   title: string;
   handler: React.ReactNode;
   coupon?: CourseCoupon;
   courses: Course[];
}

const CouponForm = ({ title, handler, coupon, courses }: Props) => {
   const [open, setOpen] = useState(false);

   // Convert datetime from "2025-11-19 18:00:00" to "2025-11-19T18:00" for datetime-local input
   const formatDatetimeLocal = (datetime?: string) => {
      if (!datetime) return '';
      return datetime.replace(' ', 'T').substring(0, 16);
   };

   const { data, setData, post, put, reset, processing, errors } = useForm({
      code: coupon?.code || '',
      course_id: coupon?.course_id || '',
      discount_type: coupon?.discount_type || 'percentage',
      discount: coupon?.discount || 0,
      valid_from: formatDatetimeLocal(coupon?.valid_from),
      valid_to: formatDatetimeLocal(coupon?.valid_to),
      is_active: coupon?.is_active ?? true,
   });

   const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();

      if (coupon) {
         put(route('course-coupons.update', coupon.id), {
            preserveScroll: true,
            onSuccess: () => {
               setOpen(false);
            },
         });
      } else {
         post(route('course-coupons.store'), {
            preserveScroll: true,
            onSuccess: () => {
               reset();
               setOpen(false);
            },
         });
      }
   };

   const generateCode = () => {
      const code = Math.random().toString(36).substring(2, 10).toUpperCase();
      setData('code', code);
   };

   useEffect(() => {
      if (open && coupon) {
         // When opening for edit, set the form data with properly formatted datetime values
         setData({
            course_id: coupon.course_id || '',
            code: coupon.code || '',
            discount_type: coupon.discount_type || 'percentage',
            discount: coupon.discount || 0,
            valid_from: formatDatetimeLocal(coupon.valid_from),
            valid_to: formatDatetimeLocal(coupon.valid_to),
            is_active: coupon.is_active ?? true,
         });
      } else if (!open) {
         reset();
      }
   }, [open, coupon]);

   return (
      <Dialog open={open} onOpenChange={setOpen}>
         <DialogTrigger asChild>{handler}</DialogTrigger>

         <DialogContent className="max-w-2xl">
            <DialogHeader>
               <DialogTitle>{title}</DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSubmit}>
               <div className="space-y-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                     <div className="col-span-2">
                        <Label htmlFor="code">Coupon Code *</Label>
                        <div className="flex gap-2">
                           <Input
                              id="code"
                              name="code"
                              value={data.code}
                              onChange={(e) => setData('code', e.target.value.toUpperCase())}
                              placeholder="SUMMER2024"
                              required
                           />
                           <Button type="button" variant="outline" onClick={generateCode}>
                              <Shuffle className="h-4 w-4" />
                           </Button>
                        </div>
                        <InputError message={errors.code} />
                     </div>

                     <div>
                        <Label htmlFor="discount_type">Discount Type *</Label>
                        <Select name="discount_type" value={data.discount_type} onValueChange={(value) => setData('discount_type', value as any)}>
                           <SelectTrigger>
                              <SelectValue placeholder="Select type" />
                           </SelectTrigger>
                           <SelectContent>
                              <SelectItem value="percentage">Percentage (%)</SelectItem>
                              <SelectItem value="fixed">Fixed Amount ($)</SelectItem>
                           </SelectContent>
                        </Select>
                        <InputError message={errors.discount_type} />
                     </div>

                     <div>
                        <Label htmlFor="discount">Discount Value *</Label>
                        <Input
                           id="discount"
                           name="discount"
                           type="number"
                           value={data.discount}
                           onChange={(e) => onHandleChange(e, setData)}
                           min="0"
                           step="0.01"
                           required
                        />
                        <InputError message={errors.discount} />
                     </div>

                     <div className="col-span-2">
                        <Label htmlFor="course_id">Select Course</Label>
                        <Select
                           name="course_id"
                           value={data.course_id?.toString()}
                           onValueChange={(value) => setData('course_id', value ? parseInt(value) : '')}
                        >
                           <SelectTrigger>
                              <SelectValue placeholder="All Courses (global coupon)" />
                           </SelectTrigger>
                           <SelectContent>
                              {courses.map((course) => (
                                 <SelectItem key={course.id} value={course.id.toString()}>
                                    {course.title}
                                 </SelectItem>
                              ))}
                           </SelectContent>
                        </Select>
                        <InputError message={errors.course_id} />
                     </div>

                     <div>
                        <Label htmlFor="valid_from">Valid From</Label>
                        <Input
                           id="valid_from"
                           name="valid_from"
                           type="datetime-local"
                           value={data.valid_from}
                           onChange={(e) => onHandleChange(e, setData)}
                        />
                        <InputError message={errors.valid_from} />
                     </div>

                     <div>
                        <Label htmlFor="valid_to">Valid To</Label>
                        <Input
                           id="valid_to"
                           name="valid_to"
                           type="datetime-local"
                           value={data.valid_to}
                           onChange={(e) => onHandleChange(e, setData)}
                        />
                        <InputError message={errors.valid_to} />
                     </div>

                     {/* <div>
                        <Label htmlFor="usage_limit">Usage Limit</Label>
                        <Input
                           id="usage_limit"
                           name="usage_limit"
                           type="number"
                           value={data.usage_limit}
                           onChange={(e) => onHandleChange(e, setData)}
                           min="1"
                           placeholder="Unlimited"
                        />
                        <InputError message={errors.usage_limit} />
                     </div> */}

                     <div className="flex items-center justify-between">
                        <Label htmlFor="is_active">Active</Label>
                        <Switch id="is_active" checked={data.is_active} onCheckedChange={(checked) => setData('is_active', checked)} />
                     </div>
                  </div>
               </div>

               <DialogFooter className="gap-2">
                  <DialogClose asChild>
                     <Button type="button" variant="outline">
                        Cancel
                     </Button>
                  </DialogClose>
                  <LoadingButton loading={processing} disabled={processing}>
                     {coupon ? 'Update' : 'Create'}
                  </LoadingButton>
               </DialogFooter>
            </form>
         </DialogContent>
      </Dialog>
   );
};

export default CouponForm;
