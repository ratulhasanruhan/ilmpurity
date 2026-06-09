import AppLogo from '@/components/app-logo';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuItem, useSidebar } from '@/components/ui/sidebar';
import { NavMain } from '@/layouts/dashboard/partials/nav-main';
import { NavUser } from '@/layouts/dashboard/partials/nav-user';
import { SharedData } from '@/types/global';
import { Link, usePage } from '@inertiajs/react';

const DashboardSidebar = () => {
   const { state } = useSidebar();
   const { props } = usePage<SharedData>();
   const compact = state === 'collapsed' ? true : false;

   return (
      <Sidebar collapsible="icon" variant="inset" side={props.direction === 'rtl' ? 'right' : 'left'} className="shadow-md">
         {!compact && (
            <SidebarHeader>
               <SidebarMenu>
                  <SidebarMenuItem className="pt-1 pb-5">
                     <Link href="/" prefetch>
                        <AppLogo className="h-[26px]" />
                     </Link>
                  </SidebarMenuItem>
               </SidebarMenu>
            </SidebarHeader>
         )}
         <SidebarContent>
            <NavMain />
         </SidebarContent>
         <SidebarFooter>
            <NavUser />
         </SidebarFooter>
      </Sidebar>
   );
};

export default DashboardSidebar;
