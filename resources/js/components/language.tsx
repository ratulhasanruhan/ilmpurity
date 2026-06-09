import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { SharedData } from '@/types/global';
import { router, usePage } from '@inertiajs/react';
import { Check, Globe } from 'lucide-react';
import { useEffect } from 'react';
import { Button } from './ui/button';
import { Separator } from './ui/separator';

const Language = () => {
   const { props } = usePage<SharedData>();
   const { system, direction, langs, locale } = props;

   useEffect(() => {
      // Update direction on <html> tag dynamically
      document.documentElement.setAttribute('dir', direction);
   }, [direction]);

   const directionHandler = () => {
      router.post(route('change.direction'), {
         direction: direction === 'ltr' ? 'rtl' : 'ltr',
      });
   };

   const langHandler = (lang: string) => {
      router.post(route('change.lang'), { locale: lang });
   };

   return (
      <DropdownMenu>
         <DropdownMenuTrigger className="cursor-pointer outline-none">
            <Button variant="secondary" size="icon" className="relative h-9 w-9 rounded-full p-0">
               <Globe className="!h-5 !w-5" />
            </Button>
         </DropdownMenuTrigger>

         <DropdownMenuContent align="end" className="w-[160px]">
            {system.fields.direction === 'none' && (
               <>
                  <DropdownMenuItem className="cursor-pointer justify-center px-3 uppercase" onClick={directionHandler}>
                     {direction === 'ltr' ? 'RTL' : 'LTR'}
                  </DropdownMenuItem>

                  <Separator className="my-1" />
               </>
            )}

            {langs
               .filter((lang) => lang.is_active)
               .map((lang) => (
                  <DropdownMenuItem key={lang.id} className="cursor-pointer px-3" onClick={() => langHandler(lang.code)}>
                     <span>{lang.name}</span> {lang.code === locale && <Check />}
                  </DropdownMenuItem>
               ))}
         </DropdownMenuContent>
      </DropdownMenu>
   );
};

export default Language;
