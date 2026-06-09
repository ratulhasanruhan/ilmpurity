import { Card } from '@/components/ui/card';
import { getPageSection, getPropertyArray } from '@/lib/page';
import { IntroPageProps } from '@/types/page';
import { usePage } from '@inertiajs/react';
import { DynamicIcon } from 'lucide-react/dynamic';
import Section from '../section';

const Overview = () => {
   const { props } = usePage<IntroPageProps>();
   const overviewSection = getPageSection(props.page, 'overview');

   return (
      <Section customize={props.customize} pageSection={overviewSection} containerClass="py-20" contentClass="text-center">
         <div className="relative z-10 mx-auto mb-10 text-center md:max-w-2xl">
            <p className="text-secondary-foreground mb-1 font-medium">{overviewSection?.title}</p>
            <h2 className="mb-4 text-3xl font-bold sm:text-4xl">{overviewSection?.sub_title}</h2>
            <p className="text-muted-foreground">{overviewSection?.description}</p>
         </div>

         <div className="relative mx-auto grid max-w-5xl grid-cols-1 gap-7 md:grid-cols-3">
            {getPropertyArray(overviewSection).map((stat: any, index: number) => {
               return (
                  <Card
                     key={`element-${index}`}
                     className="bg-background/20 dark:border-border relative z-10 border-2 border-white px-6 py-16 !shadow-none backdrop-blur-lg md:py-20"
                  >
                     <div className="shadow-card-md mx-auto flex h-[60px] w-[60px] items-center justify-center rounded-2xl bg-white/5">
                        <div className="bg-secondary-foreground flex h-10 w-10 items-center justify-center rounded-full">
                           <DynamicIcon name={stat.icon} className="h-6 w-6 text-white" />
                        </div>
                     </div>

                     <div className="mt-5 space-y-2">
                        <h3 className="text-4xl font-semibold md:text-[44px]">{stat.count}</h3>
                        <p className="mt-2">{stat.title}</p>
                     </div>
                  </Card>
               );
            })}

            <div className="after:pointer-events-none after:absolute after:top-[72px] after:left-1/2 after:h-[120px] after:w-[600px] after:-translate-x-1/2 after:-rotate-[15deg] after:bg-[rgba(97,95,255,1)] after:blur-[300px] after:content-[''] dark:after:bg-[#fff5cc6d]"></div>
         </div>
      </Section>
   );
};

export default Overview;
