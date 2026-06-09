import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLang } from '@/hooks/use-lang';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';

interface DateTimePickerProps {
   date: Date;
   setDate: (date: Date) => void;
}

export function DateTimePicker({ date, setDate }: DateTimePickerProps) {
   const { button } = useLang();
   const minuteOptions = Array.from({ length: 60 }, (_, i) => i);
   const hourOptions = Array.from({ length: 12 }, (_, i) => i + 1);

   const handleTimeChange = (type: 'hour' | 'minute' | 'meridiem', value: string) => {
      const newDate = new Date(date);

      if (type === 'hour') {
         let hour = parseInt(value);
         if (date.getHours() >= 12) {
            // PM
            hour = hour === 12 ? 12 : hour + 12;
         } else {
            // AM
            hour = hour === 12 ? 0 : hour;
         }
         newDate.setHours(hour);
      } else if (type === 'minute') {
         newDate.setMinutes(parseInt(value));
      } else if (type === 'meridiem') {
         const hours = newDate.getHours();
         if (value === 'PM' && hours < 12) {
            newDate.setHours(hours + 12);
         } else if (value === 'AM' && hours >= 12) {
            newDate.setHours(hours - 12);
         }
      }

      setDate(newDate);
   };

   return (
      <Popover>
         <PopoverTrigger asChild>
            <Button variant={'outline'} className={cn('w-full justify-between px-3 text-left font-normal', !date && 'text-muted-foreground')}>
               {date ? format(date, 'PPP p') : <span>{button.pick_a_date}</span>}
               <CalendarIcon className="ml-2 h-4 w-4" />
            </Button>
         </PopoverTrigger>
         <PopoverContent className="w-auto p-0" align="start">
            <Calendar mode="single" selected={date} onSelect={(newDate) => newDate && setDate(newDate)} initialFocus />
            <div className="flex items-center gap-2 border-t p-3">
               <Select value={format(date, 'h')} onValueChange={(value) => handleTimeChange('hour', value)}>
                  <SelectTrigger className="w-[70px]">
                     <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                     {hourOptions.map((hour) => (
                        <SelectItem key={hour} value={hour.toString()}>
                           {hour.toString().padStart(2, '0')}
                        </SelectItem>
                     ))}
                  </SelectContent>
               </Select>
               <span>:</span>
               <Select value={date.getMinutes().toString()} onValueChange={(value) => handleTimeChange('minute', value)}>
                  <SelectTrigger className="w-[70px]">
                     <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                     {minuteOptions.map((minute) => (
                        <SelectItem key={minute} value={minute.toString()}>
                           {minute.toString().padStart(2, '0')}
                        </SelectItem>
                     ))}
                  </SelectContent>
               </Select>
               <Select value={format(date, 'a')} onValueChange={(value) => handleTimeChange('meridiem', value)}>
                  <SelectTrigger className="w-[70px]">
                     <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                     <SelectItem value="AM">AM</SelectItem>
                     <SelectItem value="PM">PM</SelectItem>
                  </SelectContent>
               </Select>
            </div>
         </PopoverContent>
      </Popover>
   );
}
