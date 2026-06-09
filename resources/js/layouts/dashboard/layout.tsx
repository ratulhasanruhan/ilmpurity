import { AppContent } from '@/layouts/dashboard/partials/app-content';
import { AppShell } from '@/layouts/dashboard/partials/app-shell';
import { Head } from '@inertiajs/react';
import { type PropsWithChildren } from 'react';
import Main from '../main';
import DashboardHeader from './header';
import DashboardSidebar from './sidebar';

interface Props {
   headTitle?: string;
   breadcrumbs?: BreadcrumbItem[];
}

const DashboardLayout = (props: PropsWithChildren<Props>) => {
   const { children, headTitle, breadcrumbs = [] } = props;

   return (
      <Main>
         <AppShell variant="sidebar">
            <DashboardSidebar />

            <AppContent variant="sidebar">
               {headTitle && <Head title={headTitle} />}

               <DashboardHeader breadcrumbs={breadcrumbs} />

               <div className="container py-6">{children}</div>
            </AppContent>
         </AppShell>
      </Main>
   );
};

export default DashboardLayout;
