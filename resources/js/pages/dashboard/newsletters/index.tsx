import DeleteModal from '@/components/inertia/delete-modal';
import TableFilter from '@/components/table/table-filter';
import TableFooter from '@/components/table/table-footer';
import TiptapRenderer from '@/components/text-editor/tiptap-renderer/client-renderer';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import DashboardLayout from '@/layouts/dashboard/layout';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { ReactNode } from 'react';
import NewsletterForm from './partials/newsletter-form';
import NewsletterSend from './partials/newsletter-send';

const Index = ({ newsletters, translate }: { newsletters: Pagination<Newsletter>; translate: LanguageTranslations }) => {
   const { dashboard, button } = translate;

   return (
      <>
         <div className="relative flex items-center justify-between gap-4 pb-6">
            <TableFilter
               data={newsletters}
               title={dashboard.newsletter_list}
               globalSearch={true}
               tablePageSizes={[10, 15, 20, 25]}
               routeName="newsletters.index"
               className="w-full !p-0 md:p-0"
            />

            <NewsletterForm
               title={button.add_newsletter}
               handler={
                  <Button variant="outline" className="absolute -top-1 right-0 md:static md:mb-1">
                     <Plus />
                     <span>{button.add_newsletter}</span>
                  </Button>
               }
            />
         </div>

         <Card className="flex flex-col divide-y p-4">
            <Accordion type="single" collapsible className="space-y-4">
               {newsletters.data.length > 0 ? (
                  newsletters.data.map((newsletter, index) => (
                     <AccordionItem key={newsletter.id} value={newsletter.id as string} className="w-full overflow-hidden rounded-lg border">
                        <AccordionTrigger className="[&[data-state=open]]:!bg-muted px-4 py-3 text-base hover:no-underline">
                           <div className="flex w-full items-center justify-between pr-4">
                              <span>
                                 {newsletters.total - index}. {newsletter.subject}
                              </span>

                              <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                                 <DeleteModal
                                    routePath={route('newsletters.destroy', {
                                       id: newsletter.id,
                                    })}
                                    actionComponent={
                                       <Button size="icon" variant="secondary" className="text-destructive h-7 w-7">
                                          <Trash2 className="h-3 w-3" />
                                       </Button>
                                    }
                                 />

                                 <NewsletterSend id={newsletter.id} />

                                 <NewsletterForm
                                    title={button.update_newsletter}
                                    newsletter={newsletter}
                                    handler={
                                       <Button size="icon" variant="secondary" className="h-7 w-7">
                                          <Pencil className="h-3 w-3" />
                                       </Button>
                                    }
                                 />
                              </div>
                           </div>
                        </AccordionTrigger>
                        <AccordionContent className="space-y-2 p-4">
                           <TiptapRenderer>{newsletter.description}</TiptapRenderer>
                        </AccordionContent>
                     </AccordionItem>
                  ))
               ) : (
                  <p className="text-muted-foreground p-6 text-center text-sm">{dashboard.no_newsletters_found}</p>
               )}
            </Accordion>
         </Card>

         <TableFooter className="mt-1 p-5 sm:p-7" routeName="newsletters.index" paginationInfo={newsletters} />
      </>
   );
};

Index.layout = (page: ReactNode) => <DashboardLayout children={page} />;

export default Index;
