import AppLogo from '@/components/app-logo';
import { Button } from '@/components/ui/button';
import { SharedData } from '@/types/global';
import { Link, usePage } from '@inertiajs/react';
import { DynamicIcon } from 'lucide-react/dynamic';

const Footer = () => {
   const { footer, system } = usePage<SharedData>().props;

   const sortedItems = footer.footer_items.sort((a, b) => a.sort - b.sort);
   const listItems = sortedItems.filter((item) => item.type === 'list' && item.active);
   const copyrightItem = sortedItems.find((item) => item.type === 'copyright' && item.active);
   const socialMediaItem = sortedItems.find((item) => item.type === 'social_media' && item.active);

   return (
      <div className="text-primary-foreground dark:text-primary bg-primary dark:bg-primary-dark relative pt-20">
         <div className="container space-y-9 pb-5">
            <div className="flex flex-col items-start justify-between gap-10 md:flex-row">
               <div className="w-full space-y-5 md:max-w-[300px]">
                  <div>
                     <Link href="/">
                        <AppLogo className="h-7" theme="light" />
                     </Link>
                  </div>

                  <p className="text-muted dark:text-muted-foreground text-sm">{system.fields.description}</p>

                  {socialMediaItem && (
                     <div className="flex flex-wrap gap-3">
                        {socialMediaItem.items &&
                           Array.isArray(socialMediaItem.items) &&
                           socialMediaItem.items.map((socialItem: any, idx: number) => (
                              <Button
                                 key={idx}
                                 size="icon"
                                 variant="ghost"
                                 className="bg-muted hover:bg-primary hover:text-primary-foreground text-primary rounded-full transition-colors"
                                 asChild
                              >
                                 <Link href={socialItem.url} target="_blank" rel="noopener noreferrer">
                                    <DynamicIcon name={socialItem.icon} className="h-5 w-5" />
                                    <span className="sr-only">{socialItem.title}</span>
                                 </Link>
                              </Button>
                           ))}
                     </div>
                  )}
               </div>

               <div className="flex w-full flex-col justify-between gap-10 md:max-w-[640px] md:flex-row">
                  {listItems.map((section) => (
                     <div key={section.id} className="relative w-full">
                        <p className="mb-3 text-lg font-semibold">{section.title}</p>
                        <ul className="text-muted dark:text-muted-foreground flex flex-col gap-2 text-sm">
                           {section.items?.map((item, itemIndex) =>
                              section.slug === 'address' ? (
                                 <li key={`item-${itemIndex}`}>{item.title}</li>
                              ) : (
                                 <li key={`item-${itemIndex}`}>
                                    <Link href={item.url}>{item.title}</Link>
                                 </li>
                              ),
                           )}
                        </ul>
                     </div>
                  ))}
               </div>
            </div>
         </div>

         {/* Copyright Section */}
         {copyrightItem && (
            <div className="px-6 py-8 text-center">
               <p className="text-muted dark:text-muted-foreground text-sm">{copyrightItem.title}</p>
            </div>
         )}
      </div>
   );
};

export default Footer;
