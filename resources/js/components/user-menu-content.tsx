import { DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { UserInfo } from '@/components/user-info';
import { useLang } from '@/hooks/use-lang';
import { useMobileNavigation } from '@/hooks/use-mobile-navigation';
import { router } from '@inertiajs/react';
import { LogOut } from 'lucide-react';

interface UserMenuContentProps {
   user: User;
}

export function UserMenuContent({ user }: UserMenuContentProps) {
   const cleanup = useMobileNavigation();
   const { button } = useLang();

   const logoutHandler = () => {
      router.post(
         route('logout'),
         {},
         {
            onSuccess: () => {
               cleanup();
            },
         },
      );
   };

   return (
      <>
         <DropdownMenuLabel className="p-0 font-normal">
            <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
               <UserInfo user={user} showEmail={true} />
            </div>
         </DropdownMenuLabel>
         <DropdownMenuSeparator />
         <DropdownMenuItem className="flex w-full cursor-pointer items-center gap-2" onClick={logoutHandler}>
            <LogOut className="mr-2" />
            {button.log_out}
         </DropdownMenuItem>
      </>
   );
}
