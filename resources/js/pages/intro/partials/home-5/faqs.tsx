import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { getPageSection, getPropertyArray } from '@/lib/page';
import { IntroPageProps } from '@/types/page';
import { usePage } from '@inertiajs/react';
import Section from '../section';

const FAQs = () => {
   const { props } = usePage<IntroPageProps>();
   const { page, customize } = props;
   const faqsCoursesSection = getPageSection(page, 'faqs');

   const faqs = [
      {
         id: 'item-1',
         question: 'Do I need any prior experience to take your courses?',
         answer:
            "Not at all! My courses are designed for learners of all levels. Whether your a complete beginner or looking to sharpen existing skills, you'll find step-by-step guidance to help you progress with confidence.",
      },
      {
         id: 'item-2',
         question: 'How long do I have access to the course materials?',
         answer:
            'You have lifetime access to all course materials. Once you enroll, you can learn at your own pace and revisit the content whenever you need a refresher.',
      },
      {
         id: 'item-3',
         question: 'Will I get a certificate after completing a course?',
         answer:
            "Yes! Upon successful completion of any course, you'll receive a certificate of completion that you can share on your professional profiles and with potential employers.",
      },
      {
         id: 'item-4',
         question: 'Can I ask questions or get support during the course?',
         answer:
            'Absolutely! Each course includes a discussion forum where you can ask questions, interact with other students, and receive support from instructors and the community.',
      },
      {
         id: 'item-5',
         question: "What if I'm not satisfied with the course?",
         answer:
            "We offer a 30-day money-back guarantee. If you're not completely satisfied with your purchase, you can request a full refund within 30 days of enrollment, no questions asked.",
      },
   ];

   return (
      <Section customize={customize} pageSection={faqsCoursesSection} containerClass="py-20" contentClass="relative">
         <div className="relative z-10 mx-auto max-w-3xl">
            <div className="relative z-10 mx-auto mb-10 max-w-lg text-center">
               <p className="text-secondary-foreground mb-1 font-medium">{faqsCoursesSection?.title}</p>
               <h2 className="mb-4 text-2xl font-bold sm:text-3xl">{faqsCoursesSection?.sub_title}</h2>
               <p className="text-muted-foreground">{faqsCoursesSection?.description}</p>
            </div>

            <Accordion type="single" collapsible defaultValue="faq-0" className="w-full">
               {getPropertyArray(faqsCoursesSection).map((faq, index) => (
                  <AccordionItem
                     key={`faq-${index}`}
                     value={`faq-${index}`}
                     className="bg-background border-border mb-4 rounded-lg border px-6 shadow-sm"
                  >
                     <AccordionTrigger className="cursor-pointer py-4 text-base font-semibold hover:no-underline">{faq.title}</AccordionTrigger>
                     <AccordionContent className="text-muted-foreground pt-0 pb-4 text-sm">{faq.description}</AccordionContent>
                  </AccordionItem>
               ))}
            </Accordion>
         </div>

         <div className="after:pointer-events-none after:absolute after:top-0 after:left-0 after:h-[240px] after:w-[240px] after:rounded-full after:bg-[rgba(0,167,111,1)] after:blur-[290px] after:content-['']"></div>

         <div className="after:pointer-events-none after:absolute after:top-1/2 after:right-20 after:h-[290px] after:w-[290px] after:-translate-y-1/2 after:rounded-full after:bg-[rgba(97,95,255,1))] after:blur-[290px] after:content-['']"></div>
      </Section>
   );
};

export default FAQs;
