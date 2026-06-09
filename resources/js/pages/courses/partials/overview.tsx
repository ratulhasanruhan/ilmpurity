import TiptapRenderer from '@/components/text-editor/tiptap-renderer/client-renderer';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const Overview = ({ course }: { course: Course }) => {
   return (
      <div className="space-y-10">
         <TiptapRenderer>{course.description as string}</TiptapRenderer>

         <Accordion type="single" collapsible>
            <h6 className="mb-4 text-xl font-semibold">Faqs</h6>

            <div className="border-border border-y">
               {course.faqs?.map((faq) => (
                  <AccordionItem key={faq.id} value={faq.id as string} className="px-4 last:border-none">
                     <AccordionTrigger className="cursor-pointer text-lg hover:no-underline [&[data-state=open]]:text-blue-500">
                        {faq.question}
                     </AccordionTrigger>
                     <AccordionContent className="pt-2">{faq.answer}</AccordionContent>
                  </AccordionItem>
               ))}
            </div>
         </Accordion>
      </div>
   );
};

export default Overview;
