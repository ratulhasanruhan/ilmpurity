import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ColumnDef } from '@tanstack/react-table';

const PayoutsTableColumn = (translate: LanguageTranslations): ColumnDef<Payout>[] => {
   const { table } = translate;

   return [
      {
         accessorKey: 'profile',
         header: () => <div className="pl-4">{table.name}</div>,
         cell: ({ row }) => (
            <div className="flex items-center gap-2 pl-4 capitalize">
               <Avatar>
                  <AvatarImage src={row.original.user.photo || ''} alt={row.original.user.name} className="object-cover" />
                  <AvatarFallback>{row.original.user.name.charAt(0)}</AvatarFallback>
               </Avatar>

               <div>
                  <p>{row.original.user.name}</p>
                  <p>{row.original.user.email}</p>
               </div>
            </div>
         ),
      },
      {
         accessorKey: 'amount',
         header: () => <div className="text-center">{table.payout_amount}</div>,
         cell: ({ row }) => (
            <div className="text-center capitalize">
               <p>{row.original.amount}$</p>
            </div>
         ),
      },
      {
         accessorKey: 'method',
         header: () => <div className="text-center">{table.payout_method}</div>,
         cell: ({ row }) => (
            <div className="text-center capitalize">
               <p>{row.original.payout_method}</p>
            </div>
         ),
      },
      {
         accessorKey: 'status',
         header: () => <div className="text-center">{table.status}</div>,
         cell: ({ row }) => <div className="text-center capitalize">{row.getValue('status')}</div>,
      },
      {
         id: 'processed',
         header: () => <div className="text-center">{table.payout_date}</div>,
         cell: ({ row }) => <div className="text-center">{row.original.updated_at}</div>,
      },
      {
         id: 'action',
         header: () => <div className="pr-4 text-end">{table.action}</div>,
         cell: ({ row }) => (
            <div className="pr-4 text-end">
               <Button>{table.print}</Button>
            </div>
         ),
      },
   ];
};

export default PayoutsTableColumn;
