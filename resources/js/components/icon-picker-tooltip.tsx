import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { DynamicIcon } from 'lucide-react/dynamic';
import { useState } from 'react';

interface IconPickerTooltipProps {
   name: string;
   onSelect?: (iconName: string) => void;
}

const IconPickerTooltip = ({ name, onSelect }: IconPickerTooltipProps) => {
   const [hoveredIcon, setHoveredIcon] = useState('');

   return (
      <Tooltip>
         <TooltipTrigger asChild>
            <Button size="icon" variant="outline" onClick={() => onSelect?.(name)} onMouseOver={() => setHoveredIcon(name)}>
               <DynamicIcon name={name as any} />
            </Button>
         </TooltipTrigger>
         <TooltipContent>
            <p>{hoveredIcon}</p>
         </TooltipContent>
      </Tooltip>
   );
};

export default IconPickerTooltip;
