import Tabs from '@/components/tabs';
import { TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DashboardLayout from '@/layouts/dashboard/layout';
import { getQueryParams } from '@/lib/route';
import { SharedData } from '@/types/global';
import { router, usePage } from '@inertiajs/react';
import { ReactNode } from 'react';
import Google from './partials/google';
import Recaptcha from './partials/recaptcha';

interface Props extends SharedData {
   auths: Settings<GoogleAuthFields | RecaptchaAuthFields | any>[];
}

const Auth = ({ auths }: Props) => {
   const { props, url } = usePage<SharedData>();
   const params = getQueryParams(url);
   const { translate } = props;
   const { common } = translate;

   const tabs = auths.map((auth) => {
      let Component;

      switch (auth.sub_type) {
         case 'google':
            Component = Google;
            break;

         case 'recaptcha':
            Component = Recaptcha;
            break;

         default:
            Component = ({ auth }: { auth: any }) => <div>No component found</div>;
            break;
      }

      return {
         ...auth,
         Component,
      };
   });

   return (
      <section className="md:px-3">
         <Tabs value={params['tab'] ?? tabs[0].sub_type} className="grid grid-rows-1 gap-5 md:grid-cols-4">
            <div>
               <TabsList className="horizontal-tabs-list">
                  {tabs.map(({ id, title, sub_type }) => (
                     <TabsTrigger
                        key={id}
                        value={sub_type}
                        className="horizontal-tabs-trigger"
                        onClick={() =>
                           router.get(
                              route('settings.auth0', {
                                 tab: sub_type,
                              }),
                           )
                        }
                     >
                        {title}
                     </TabsTrigger>
                  ))}
               </TabsList>
            </div>

            <div className="md:col-span-3">
               {tabs.map((auth) => (
                  <TabsContent key={auth.id} value={auth.sub_type} className="m-0">
                     <auth.Component key={auth.id} auth={auth} />
                  </TabsContent>
               ))}
            </div>
         </Tabs>
      </section>
   );
};

Auth.layout = (page: ReactNode) => <DashboardLayout children={page} />;

export default Auth;
