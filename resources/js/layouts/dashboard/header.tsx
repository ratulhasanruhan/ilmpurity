import Appearance from '@/components/appearance';
import { Breadcrumbs } from '@/components/breadcrumbs';
import Language from '@/components/language';
import Notification from '@/components/notification';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { SharedData } from '@/types/global';
import { usePage } from '@inertiajs/react';

const DashboardHeader = ({ breadcrumbs = [] }: { breadcrumbs?: BreadcrumbItem[] }) => {
   const { props } = usePage<SharedData>();
   const { system } = props;

   return (
      <header className="border-sidebar-border/50 flex h-16 shrink-0 items-center gap-2 border-b px-6 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 md:px-4">
         <div className="flex w-full items-center justify-between gap-2">
            <div className="flex items-center gap-2">
               <SidebarTrigger className="-ml-1" />
               <Breadcrumbs breadcrumbs={breadcrumbs} />
            </div>

            <div className="flex items-center gap-2">
               <Appearance />
               <Notification />
               {system.fields.language_selector && <Language />}
            </div>
         </div>
      </header>
   );
};

export default DashboardHeader;
