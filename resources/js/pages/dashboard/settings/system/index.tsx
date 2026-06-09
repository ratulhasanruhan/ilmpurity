import Tabs from '@/components/tabs';
import { TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DashboardLayout from '@/layouts/dashboard/layout';
import { SharedData } from '@/types/global';
import { usePage } from '@inertiajs/react';
import { ReactNode } from 'react';
import Footer from './partials/footer';
import Navbar from './partials/navbar';
import Style from './partials/style';
import Website from './partials/website';

export interface SystemProps extends SharedData {
   system: Settings<SystemFields>;
}

const System = () => {
   const { props } = usePage<SharedData>();
   const { translate } = props;
   const { settings, button } = translate;

   return (
      <div className="grid grid-cols-1 md:px-3">
         <div className="mb-6">
            <h1 className="text-2xl font-bold">{settings.system_settings}</h1>
            <p className="text-gray-500">{settings.system_settings_description}</p>
         </div>

         <Tabs defaultValue="website">
            <div className="overflow-x-auto overflow-y-hidden">
               <TabsList className="h-13 px-2">
                  <TabsTrigger value="website" className="h-10 cursor-pointer px-6">
                     {button.website}
                  </TabsTrigger>
                  <TabsTrigger value="navbar" className="h-10 cursor-pointer px-6">
                     {button.navbar}
                  </TabsTrigger>
                  <TabsTrigger value="footer" className="h-10 cursor-pointer px-6">
                     {button.footer}
                  </TabsTrigger>
                  <TabsTrigger value="style" className="h-10 cursor-pointer px-6">
                     {button.style}
                  </TabsTrigger>
               </TabsList>
            </div>

            <TabsContent value="website">
               <Website />
            </TabsContent>
            <TabsContent value="navbar">
               <Navbar />
            </TabsContent>
            <TabsContent value="footer">
               <Footer />
            </TabsContent>
            <TabsContent value="style">
               <Style />
            </TabsContent>
         </Tabs>
      </div>
   );
};

System.layout = (page: ReactNode) => <DashboardLayout children={page} />;

export default System;
