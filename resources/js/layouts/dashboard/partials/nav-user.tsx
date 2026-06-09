import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from '@/components/ui/sidebar';
import { UserInfo } from '@/components/user-info';
import { UserMenuContent } from '@/components/user-menu-content';
import { useIsMobile } from '@/hooks/use-mobile';
import { SharedData } from '@/types/global';
import { usePage } from '@inertiajs/react';
import { ChevronsUpDown } from 'lucide-react';

export function NavUser() {
   const { auth } = usePage<SharedData>().props;
   const { state } = useSidebar();
   const isMobile = useIsMobile();

   return (
      <SidebarMenu>
         <SidebarMenuItem>
            <DropdownMenu>
               <DropdownMenuTrigger className="w-full">
                  <SidebarMenuButton size="lg" className="text-sidebar-accent-foreground data-[state=open]:bg-sidebar-accent group cursor-pointer">
                     <UserInfo user={auth.user} />
                     <ChevronsUpDown className="ml-auto size-4" />
                  </SidebarMenuButton>
               </DropdownMenuTrigger>
               <DropdownMenuContent
                  align="end"
                  className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
                  side={isMobile ? 'bottom' : state === 'collapsed' ? 'left' : 'bottom'}
               >
                  <UserMenuContent user={auth.user} />
               </DropdownMenuContent>
            </DropdownMenu>
         </SidebarMenuItem>
      </SidebarMenu>
   );
}
