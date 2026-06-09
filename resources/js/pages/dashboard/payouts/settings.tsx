import Tabs from '@/components/tabs';
import { TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DashboardLayout from '@/layouts/dashboard/layout';
import { getQueryParams } from '@/lib/route';
import { router, usePage } from '@inertiajs/react';
import { ReactNode } from 'react';
import Mollie from './partials/mollie';
import Paypal from './partials/paypal';
import Paystack from './partials/paystack';
import Stripe from './partials/stripe';

const Settings = ({ instructor }: { instructor: Instructor }) => {
   const page = usePage();
   const params = getQueryParams(page.url);

   const components: any = [Paypal, Stripe, Mollie, Paystack];

   const tabs = instructor.payout_methods.map((payment, index) => ({
      ...payment,
      Component: components[index] ?? <div>No component found</div>,
   }));

   return (
      <section className="px-3 py-6">
         <Tabs value={params['tab'] ?? tabs[0].sub_type} className="grid grid-rows-1 gap-5 md:grid-cols-4">
            <div>
               <TabsList className="border-border bg-card text-card-foreground grid h-auto grid-cols-1 space-y-0.5 overflow-hidden rounded-2xl border px-0 py-3 shadow">
                  {tabs.map(({ id, title, sub_type }) => (
                     <TabsTrigger
                        key={id}
                        value={sub_type}
                        className="border-primary data-[state=active]:!bg-muted hover:bg-secondary data-[state=active]:before:bg-primary relative flex cursor-pointer items-center justify-start gap-3 rounded-none px-6 py-2.5 text-start !shadow-none before:absolute before:top-0 before:bottom-0 before:left-0 before:rounded-r-xl data-[state=active]:before:w-1 data-[state=active]:before:content-['.']"
                        onClick={() =>
                           router.get(
                              route('payouts.settings.index', {
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
               {tabs.map((payment) => (
                  <TabsContent key={payment.id} value={payment.sub_type} className="m-0">
                     <payment.Component payment={payment} />
                  </TabsContent>
               ))}
            </div>
         </Tabs>
      </section>
   );
};

Settings.layout = (page: ReactNode) => <DashboardLayout children={page} />;

export default Settings;
