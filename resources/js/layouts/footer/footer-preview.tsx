import AppLogo from '@/components/app-logo';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { SystemProps } from '@/pages/dashboard/settings/system';
import { Link, usePage } from '@inertiajs/react';
import { DynamicIcon } from 'lucide-react/dynamic';

const FooterPreview = () => {
   const { props } = usePage<SystemProps>();
   const { footer, system } = props;

   const renderFooterItem = (item: FooterItem) => {
      if (!item.active) return null;

      switch (item.type) {
         case 'list':
            return (
               <div key={item.id} className="space-y-4">
                  <h3 className="text-lg font-semibold">{item.title}</h3>
                  <ul className="space-y-2">
                     {item.items &&
                        Array.isArray(item.items) &&
                        item.items.map((subItem: any, idx: number) => (
                           <li key={idx}>
                              {subItem.url ? (
                                 <Link href={subItem.url} className="text-muted-foreground hover:text-foreground text-sm transition-colors">
                                    {subItem.title}
                                 </Link>
                              ) : (
                                 <span className="text-muted-foreground text-sm">{subItem.title}</span>
                              )}
                           </li>
                        ))}
                  </ul>
               </div>
            );

         case 'social_media':
            return (
               <div key={item.id} className="space-y-4">
                  <h3 className="text-lg font-semibold">{item.title}</h3>
                  <div className="flex flex-wrap gap-3">
                     {item.items &&
                        Array.isArray(item.items) &&
                        item.items.map((socialItem: any, idx: number) => (
                           <Button
                              key={idx}
                              variant="outline"
                              size="icon"
                              className="hover:bg-primary hover:text-primary-foreground h-10 w-10 transition-colors"
                              asChild
                           >
                              <Link href={socialItem.url} target="_blank" rel="noopener noreferrer">
                                 <DynamicIcon name={socialItem.icon} className="h-5 w-5" />
                                 <span className="sr-only">{socialItem.title}</span>
                              </Link>
                           </Button>
                        ))}
                  </div>
               </div>
            );

         case 'payment_methods':
            return (
               <div key={item.id} className="space-y-4">
                  <h3 className="text-muted-foreground text-sm font-medium">{item.title}</h3>
                  <div className="flex flex-wrap gap-3">
                     {item.items &&
                        Array.isArray(item.items) &&
                        item.items.map((paymentItem: any, idx: number) => (
                           <div key={idx} className="bg-background flex h-10 min-w-[60px] items-center justify-center rounded-md border p-2">
                              {paymentItem.image ? (
                                 <img src={paymentItem.image} alt={`Payment method ${idx + 1}`} className="h-6 w-auto object-contain" />
                              ) : (
                                 <Badge variant="outline" className="text-xs">
                                    Payment {idx + 1}
                                 </Badge>
                              )}
                           </div>
                        ))}
                  </div>
               </div>
            );

         case 'copyright':
            return null; // Copyright is handled separately

         default:
            return (
               <div key={item.id} className="space-y-4">
                  <h3 className="text-lg font-semibold">{item.title}</h3>
                  {item.items && Array.isArray(item.items) && item.items.length > 0 && (
                     <div className="space-y-2">
                        {item.items.map((genericItem: any, idx: number) => (
                           <div key={idx} className="text-muted-foreground text-sm">
                              {typeof genericItem === 'string' ? genericItem : JSON.stringify(genericItem)}
                           </div>
                        ))}
                     </div>
                  )}
               </div>
            );
      }
   };

   const sortedItems = footer.footer_items.sort((a, b) => a.sort - b.sort);
   const listItems = sortedItems.filter((item) => item.type === 'list' && item.active);
   const copyrightItem = sortedItems.find((item) => item.type === 'copyright' && item.active);
   const socialMediaItem = sortedItems.find((item) => item.type === 'social_media' && item.active);
   const paymentMethodsItem = sortedItems.find((item) => item.type === 'payment_methods' && item.active);

   return (
      <div className={`overflow-hidden bg-[rgba(255,222,99,0.06)]`}>
         <div className="space-y-9 px-4 pt-[60px] pb-5">
            <div className="flex flex-col items-start justify-between gap-10 md:flex-row">
               <div className="w-full space-y-5 md:max-w-[300px]">
                  <div>
                     <Link href="/">
                        <AppLogo />
                     </Link>
                  </div>

                  <p className="text-muted-foreground text-sm">{system.fields.description}</p>

                  {socialMediaItem && (
                     <div className="flex flex-wrap gap-3">
                        {socialMediaItem.items &&
                           Array.isArray(socialMediaItem.items) &&
                           socialMediaItem.items.map((socialItem: any, idx: number) => (
                              <Button
                                 key={idx}
                                 size="icon"
                                 variant="ghost"
                                 className="bg-muted hover:bg-primary hover:text-primary-foreground text-muted-foreground rounded-full transition-colors"
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
                     <div className="relative w-full">
                        <p className="mb-3 text-lg font-semibold">{section.title}</p>
                        <ul className="text-muted-foreground flex flex-col gap-2 text-sm">
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

            {paymentMethodsItem && (
               <div className="space-y-2">
                  <h3 className="text-lg font-semibold">{paymentMethodsItem.title}</h3>
                  <div className="flex flex-wrap gap-3">
                     {paymentMethodsItem.items &&
                        Array.isArray(paymentMethodsItem.items) &&
                        paymentMethodsItem.items.map((paymentItem: any, idx: number) => (
                           <div key={idx} className="flex h-7 items-center justify-center gap-5 md:justify-start">
                              {paymentItem.image ? (
                                 <img src={paymentItem.image} alt={`Payment method ${idx + 1}`} className="h-full w-auto object-contain" />
                              ) : (
                                 <Badge variant="outline" className="text-xs">
                                    Payment {idx + 1}
                                 </Badge>
                              )}
                           </div>
                        ))}
                  </div>
               </div>
            )}
         </div>

         {/* Copyright Section */}
         {copyrightItem && (
            <div className="px-6 py-8 text-center">
               <p className="text-muted-foreground text-sm">{copyrightItem.title}</p>
            </div>
         )}
      </div>
   );
};

export default FooterPreview;
