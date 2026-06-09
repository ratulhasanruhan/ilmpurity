import { Card } from '@/components/ui/card';
import { getPageSection, getPropertyArray } from '@/lib/page';
import { IntroPageProps } from '@/types/page';
import { usePage } from '@inertiajs/react';
import Section from '../section';

const Statistics = () => {
   const { props } = usePage<IntroPageProps>();
   const { customize } = props;
   const statisticsSection = getPageSection(props.page, 'statistics');

   return (
      <Section customize={customize} pageSection={statisticsSection} containerClass="relative z-10 py-11">
         <Card className="text-primary-foreground dark:text-primary flex flex-col items-center justify-between gap-20 border-none bg-[#004B50] p-10 !shadow-none md:flex-row md:gap-28 md:px-[120px]">
            {getPropertyArray(statisticsSection).map((statistic) => (
               <div key={statistic.id}>
                  <h2 className="text-4xl font-bold md:text-6xl">{statistic.value}</h2>
                  <p className="text-lg">{statistic.label}</p>
               </div>
            ))}
         </Card>
      </Section>
   );
};

export default Statistics;
