import { useLang } from '@/hooks/use-lang';
import debounce from '@/lib/debounce';
import { Search } from 'lucide-react';
import iconNodes from 'lucide-static/icon-nodes.json';
import { useMemo, useState } from 'react';
import IconPickerTooltip from './icon-picker-tooltip';
import { Label } from './ui/label';

interface IconPickerProps {
   enableSearch?: boolean;
   onSelect?: (iconName: string) => void;
}

const IconPicker = ({ enableSearch = true, onSelect }: IconPickerProps) => {
   const allNames = Object.keys(iconNodes);
   const [searchTerm, setSearchTerm] = useState('');
   const { input, frontend, common } = useLang();

   const filteredIcons = useMemo(() => {
      if (!searchTerm) return allNames;

      const term = searchTerm.toLowerCase();
      return allNames.filter((icon) => icon.toLowerCase().includes(term));
   }, [searchTerm]);

   const searchHandler = debounce(async (e: any) => {
      setSearchTerm(e.target.value);
   }, 300);

   return (
      <div>
         {enableSearch && (
            <div className="mb-6">
               <div className="flex items-center justify-between">
                  <Label htmlFor="email">{input.icon_placeholder}</Label>
                  <p className="text-sm text-gray-500">
                     {frontend.showing_results} {filteredIcons.length} {common.of} {allNames.length}
                  </p>
               </div>

               <div className="relative w-full">
                  <input
                     type="text"
                     placeholder="Search Icons..."
                     onChange={searchHandler}
                     className="focus:border-primary h-10 w-full rounded-md border border-gray-200 py-[15px] pr-4 pl-12 text-sm font-normal text-gray-500 focus:ring-0 focus:outline-0"
                  />
                  <Search className="absolute top-3 left-4 z-10 h-4 w-4 text-gray-700" />
               </div>
            </div>
         )}

         <div className="flex flex-wrap gap-4">
            {filteredIcons.map((name) => (
               <IconPickerTooltip key={name} name={name} onSelect={onSelect} />
            ))}
         </div>
      </div>
   );
};

export default IconPicker;
