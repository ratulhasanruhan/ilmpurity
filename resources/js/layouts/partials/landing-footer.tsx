import AppLogo from '@/components/app-logo';
import DataSortModal from '@/components/data-sort-modal';
import Switch from '@/components/switch';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { getPageSection } from '@/lib/page';
import { cn } from '@/lib/utils';
import { SharedData } from '@/types/global';
import { Link, router, usePage } from '@inertiajs/react';
import { getYear } from 'date-fns';
import { Settings } from 'lucide-react';

const LandingFooter = () => {
   const { page, customize, system } = usePage<SharedData>().props;

   const aboutUsSection = getPageSection(page, 'footer_list_1');
   const customerCareSection = getPageSection(page, 'footer_list_2');
   const contactUsSection = getPageSection(page, 'footer_list_3');

   const sections = [aboutUsSection, customerCareSection, contactUsSection]
      .filter((section): section is PageSection => section !== undefined)
      .sort((a, b) => (a.sort || 0) - (b.sort || 0));

   const sectionActiveChange = (id: string | number, active: boolean) => {
      router.post(route('page.section.update', id), {
         active,
      });
   };

   return (
      <div className="text-primary-foreground dark:text-primary relative bg-gray-900 pt-20 pb-10 dark:bg-gray-800">
         {customize && page && (
            <div className="absolute top-6 right-6 z-20">
               <DataSortModal
                  title="Footer Links"
                  data={sections}
                  handler={
                     <Button size="icon">
                        <Settings className="h-7 w-7" />
                     </Button>
                  }
                  onOrderChange={(newOrder, setOpen) => {
                     router.post(
                        route('page.section.sort'),
                        {
                           sortedData: newOrder,
                        },
                        { preserveScroll: true, onSuccess: () => setOpen && setOpen(false) },
                     );
                  }}
                  renderContent={(item) => (
                     <Card className="flex w-full items-center justify-between px-4 py-3">
                        <p>{item.name}</p>

                        <div className="flex items-center space-x-2">
                           <Label htmlFor="active">Active</Label>
                           <Switch id="active" defaultChecked={item.active} onCheckedChange={(checked) => sectionActiveChange(item.id, checked)} />
                        </div>
                     </Card>
                  )}
               />
            </div>
         )}

         <div className="container">
            <div className="mb-11 flex flex-col items-start justify-between gap-10 md:flex-row">
               <div className="w-full md:max-w-[300px]">
                  <Link href="/">
                     <AppLogo theme="light" />
                  </Link>

                  <p className="mt-5 text-sm">{system.fields.description}</p>
               </div>

               <div className="flex w-full flex-col justify-between gap-10 md:max-w-[640px] md:flex-row">
                  {sections.map(
                     (section) =>
                        section.active && (
                           <div className={cn('relative w-full', customize && 'section-edit')}>
                              <p className="mb-3 text-lg font-semibold">{section?.title}</p>
                              <ul className="flex flex-col gap-2 text-sm">
                                 {section?.properties.array.map((item, itemIndex) =>
                                    section.slug === 'footer_list_3' ? (
                                       <li key={`item-${itemIndex}`}>{item.title}</li>
                                    ) : (
                                       <li key={`item-${itemIndex}`}>
                                          <Link href={item.url}>{item.title}</Link>
                                       </li>
                                    ),
                                 )}
                              </ul>
                           </div>
                        ),
                  )}
               </div>
            </div>

            <p className="text-center text-sm">
               Copyright © {getYear(new Date())} <a href="https://ui-lib.com/">UI Lib</a>. All rights reserved
            </p>
         </div>
      </div>
   );
};

export default LandingFooter;
