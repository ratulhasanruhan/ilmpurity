import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Dashboard from '@/layouts/dashboard/layout';
import { SharedData } from '@/types/global';
import { Head, Link, usePage } from '@inertiajs/react';
import { ArrowRight, MoveLeft } from 'lucide-react';
import { ReactNode } from 'react';

interface Props extends SharedData {
   language: Language;
}

const Update = ({ language }: Props) => {
   const { props } = usePage<SharedData>();
   const { translate } = props;
   const { settings, button } = translate;
   const groupedObjects = language.properties.reduce(
      (acc, property) => {
         if (!acc[property.group]) {
            acc[property.group] = [];
         }
         acc[property.group].push(property);
         return acc;
      },
      {} as Record<string, any[]>,
   );

   return (
      <div className="md:px-3">
         <Head title={settings.translation_update} />

         <div className="mb-6 flex items-center justify-between gap-4">
            <div>
               <h1 className="text-2xl font-bold">{settings.language_properties}</h1>
               <p className="text-gray-500">{settings.translate_language_properties}</p>
            </div>
            <Link href={route('language.index')}>
               <Button>
                  <MoveLeft />
                  {button.back}
               </Button>
            </Link>
         </div>

         <div className="space-y-4">
            <Accordion type="single" collapsible defaultValue="faq-0" className="w-full">
               {Object.entries(groupedObjects).map(([group, properties], index) => (
                  <AccordionItem
                     key={`faq-${index}`}
                     value={`faq-${index}`}
                     className="bg-background border-border mb-4 rounded-lg border px-6 shadow-sm"
                  >
                     <AccordionTrigger className="cursor-pointer py-4 text-base font-semibold capitalize hover:no-underline">
                        {group} {settings.elements}
                     </AccordionTrigger>
                     <AccordionContent className="text-muted-foreground grid grid-cols-1 gap-4 pt-0 pb-4 text-sm sm:grid-cols-2 md:grid-cols-4">
                        {properties.map((property) => (
                           <Link href={route('language.property.edit', property.id)}>
                              <Card className="hover:border-secondary-light hover:text-secondary-foreground flex items-center justify-between border-2 p-4 !shadow-none">
                                 <p className="font-medium">{property.name}</p>
                                 <ArrowRight size={16} />
                              </Card>
                           </Link>
                        ))}
                     </AccordionContent>
                  </AccordionItem>
               ))}
            </Accordion>
         </div>
      </div>
   );
};

Update.layout = (page: ReactNode) => <Dashboard children={page} />;

export default Update;
