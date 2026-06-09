import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { Check, ChevronsUpDown } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

interface Data {
    id?: number | string;
    child_id?: number | string;
    label: string;
    value: string;
}

interface Props {
    data: Data[];
    placeholder: string;
    onSelect: (selected: Data) => void;
    defaultValue?: string;
    translate?: any;
}

const Combobox = ({ data, placeholder, onSelect, defaultValue, translate }: Props) => {
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(defaultValue || '');
    const initialRenderRef = useRef(true);

    useEffect(() => {
        // Only set initial value, don't trigger onSelect on subsequent renders with the same defaultValue
        if (defaultValue && (initialRenderRef.current || defaultValue !== value)) {
            const defaultItem = data.find((item) => item.value === defaultValue);
            if (defaultItem) {
                setValue(defaultValue);

                // Only call onSelect on non-initial renders to prevent triggering re-renders immediately
                if (!initialRenderRef.current) {
                    onSelect(defaultItem);
                }
            }
        }

        initialRenderRef.current = false;
    }, [defaultValue, data, value, onSelect]);

    const handleSelect = (selected: Data) => {
        const newValue = selected.value === value ? '' : selected.value;
        setValue(newValue);
        onSelect(selected);
        setOpen(false);
    };

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger className="w-full">
                <Button type="button" variant="outline" role="combobox" aria-expanded={open} className="w-full justify-between">
                    {value ? data.find((item) => item.value === value)?.label : placeholder}
                    <ChevronsUpDown className="opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
                <Command>
                    <CommandInput placeholder={translate?.input?.search_placeholder || "Search element..."} className="focus:border-none focus:ring-0 focus:outline-none" />
                    <CommandList>
                        <CommandEmpty>{translate?.frontend?.no_element_found || "No element found."}</CommandEmpty>
                        <CommandGroup className="max-h-[300px] overflow-y-auto">
                            {data.map((item) => (
                                <CommandItem key={item.value} value={item.value} onSelect={() => handleSelect(item)}>
                                    {item.label}
                                    <Check className={cn('ml-auto', value === item.value ? 'opacity-100' : 'opacity-0')} />
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
};

export default Combobox;
