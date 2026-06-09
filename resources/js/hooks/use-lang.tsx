import { SharedData } from '@/types/global';
import { usePage } from '@inertiajs/react';

export function useLang() {
   const { props } = usePage<SharedData>();

   return props.translate;
}
