import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { getPageSection, getPropertyArray } from '@/lib/page';
import { IntroPageProps } from '@/types/page';
import { usePage } from '@inertiajs/react';
import Section from '../section';

const FAQs = () => {
   const { props } = usePage<IntroPageProps>();
   const { page, customize } = props;
   const faqsCoursesSection = getPageSection(page, 'faqs');

   const array = getPropertyArray(faqsCoursesSection);
   const midPoint = Math.floor(array.length / 2);
   const firstPart = array.slice(0, midPoint);
   const secondPart = array.slice(midPoint);

   return (
      <Section customize={customize} pageSection={faqsCoursesSection} containerClass="py-20" contentClass="relative">
         <div className="relative z-10">
            <div className="relative z-10 mx-auto mb-10 max-w-lg text-center">
               <h2 className="mb-2 text-3xl font-bold sm:text-4xl">{faqsCoursesSection?.title}</h2>
               <p className="text-muted-foreground">{faqsCoursesSection?.description}</p>
            </div>

            <Accordion type="single" collapsible defaultValue="faq-0-first" className="relative w-full">
               <div className="relative z-10 grid grid-cols-1 items-start gap-x-7 gap-y-4 md:grid-cols-2">
                  <div>
                     {firstPart.map((faq, index) => (
                        <AccordionItem
                           key={`faq-${index}-first`}
                           value={`faq-${index}-first`}
                           className="bg-background border-border mb-4 rounded-lg border px-6 shadow-sm"
                        >
                           <AccordionTrigger className="cursor-pointer py-4 text-base font-semibold hover:no-underline">{faq.title}</AccordionTrigger>
                           <AccordionContent className="text-muted-foreground pt-0 pb-4 text-sm">{faq.description}</AccordionContent>
                        </AccordionItem>
                     ))}
                  </div>
                  <div>
                     {secondPart.map((faq, index) => (
                        <AccordionItem
                           key={`faq-${index}-second`}
                           value={`faq-${index}-second`}
                           className="bg-background border-border mb-4 rounded-lg border px-6 shadow-sm"
                        >
                           <AccordionTrigger className="cursor-pointer py-4 text-base font-semibold hover:no-underline">{faq.title}</AccordionTrigger>
                           <AccordionContent className="text-muted-foreground pt-0 pb-4 text-sm">{faq.description}</AccordionContent>
                        </AccordionItem>
                     ))}
                  </div>
               </div>

               <div className="after:pointer-events-none after:absolute after:top-1/2 after:left-1/2 after:h-[240px] after:w-[240px] after:-translate-x-1/2 after:-translate-y-1/2 after:rounded-full after:bg-[rgba(97,95,255,1))] after:blur-[280px] after:content-['']"></div>
            </Accordion>
         </div>
      </Section>
   );
};

export default FAQs;
