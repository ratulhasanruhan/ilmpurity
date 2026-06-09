import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ColumnDef } from '@tanstack/react-table';
import { format, isFuture, isPast, parseISO } from 'date-fns';
import { Copy, Pencil } from 'lucide-react';
import CouponForm from './coupon-form';

interface CouponTableColumnsProps {
   courses: Course[];
}

const CouponTableColumns = ({ courses }: CouponTableColumnsProps): ColumnDef<CourseCoupon>[] => {
   const getCouponStatus = (coupon: CourseCoupon) => {
      if (!coupon.is_active) return { label: 'Inactive', variant: 'secondary' as const };
      if (coupon.valid_to && isPast(parseISO(coupon.valid_to))) return { label: 'Expired', variant: 'destructive' as const };
      if (coupon.valid_from && isFuture(parseISO(coupon.valid_from))) return { label: 'Scheduled', variant: 'secondary' as const };
      if (coupon.usage_limit && coupon.used_count >= coupon.usage_limit) return { label: 'Used Up', variant: 'destructive' as const };
      return { label: 'Active', variant: 'default' as const };
   };

   const copyCouponCode = (code: string) => {
      navigator.clipboard.writeText(code);
      alert('Coupon code copied to clipboard!');
   };

   return [
      {
         accessorKey: 'code',
         header: () => <p className="pl-4">Coupon Code</p>,
         cell: ({ row }) => (
            <div className="flex items-center gap-2 pl-4">
               <code className="rounded bg-gray-100 px-2 py-1 font-bold">{row.original.code}</code>
               <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => copyCouponCode(row.original.code)}>
                  <Copy className="h-3 w-3" />
               </Button>
            </div>
         ),
      },
      {
         accessorKey: 'discount',
         header: 'Discount',
         cell: ({ row }) => (
            <Badge variant="outline">
               {row.original.discount_type === 'percentage' ? `${row.original.discount}% OFF` : `$${row.original.discount} OFF`}
            </Badge>
         ),
      },
      {
         accessorKey: 'course',
         header: 'Course',
         cell: ({ row }) =>
            row.original.course ? (
               <span className="font-medium">{row.original.course.title}</span>
            ) : (
               <span className="text-primary font-medium">Global Coupon</span>
            ),
      },
      {
         accessorKey: 'usage',
         header: 'Usage',
         cell: ({ row }) => {
            const limited = row.original.usage_type === 'limited';

            return limited ? (
               <span>
                  {row.original.used_count} / {row.original.usage_limit}
               </span>
            ) : (
               <span>Unlimited</span>
            );
         },
      },
      {
         accessorKey: 'valid_from',
         header: 'Valid From',
         cell: ({ row }) => (row.original.valid_from ? format(parseISO(row.original.valid_from), 'MMM dd, yyyy HH:mm') : '-'),
      },
      {
         accessorKey: 'valid_to',
         header: 'Valid To',
         cell: ({ row }) => (row.original.valid_to ? format(parseISO(row.original.valid_to), 'MMM dd, yyyy HH:mm') : '-'),
      },
      {
         accessorKey: 'status',
         header: 'Status',
         cell: ({ row }) => {
            const status = getCouponStatus(row.original);
            return <Badge variant={status.variant}>{status.label}</Badge>;
         },
      },
      {
         id: 'actions',
         header: () => <p className="pr-4 text-end">Actions</p>,
         cell: ({ row }) => {
            const coupon = row.original;

            return (
               <div className="flex items-center justify-end py-2 pr-4">
                  <CouponForm
                     title="Edit Coupon"
                     coupon={coupon}
                     courses={courses}
                     handler={
                        <Button size="icon" variant="secondary" className="h-8 w-8">
                           <Pencil />
                        </Button>
                     }
                  />
               </div>
            );
         },
      },
   ];
};

export default CouponTableColumns;
