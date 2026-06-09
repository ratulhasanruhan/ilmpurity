import { TableHeader as DataTableHeader, TableHead, TableRow } from '@/components/ui/table';
import { Table as ReactTable, flexRender } from '@tanstack/react-table';

interface Props {
   table: ReactTable<any>;
   className?: string;
   tableHeadClass?: string;
}

const TableHeader = (props: Props) => {
   const { table, className, tableHeadClass } = props;

   return (
      <DataTableHeader className={className}>
         {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
               {headerGroup.headers.map((header) => {
                  return (
                     <TableHead key={header.id} className={tableHeadClass}>
                        {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                     </TableHead>
                  );
               })}
            </TableRow>
         ))}
      </DataTableHeader>
   );
};

export default TableHeader;
