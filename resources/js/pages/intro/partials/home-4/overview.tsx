import { Card } from '@/components/ui/card';
import { getPageSection, getPropertyArray } from '@/lib/page';
import { getColorWithOpacity } from '@/lib/utils';
import { IntroPageProps } from '@/types/page';
import { usePage } from '@inertiajs/react';
import { DynamicIcon } from 'lucide-react/dynamic';
import Section from '../section';

const Overview = () => {
   const { props } = usePage<IntroPageProps>();
   const overviewSection = getPageSection(props.page, 'overview');

   return (
      <Section customize={props.customize} pageSection={overviewSection} containerClass="py-20">
         <div className="relative grid grid-cols-1 gap-7 sm:grid-cols-2 md:grid-cols-4">
            {getPropertyArray(overviewSection).map((stat: any, index: number) => {
               return (
                  <Card
                     key={`element-${index}`}
                     className="bg-secondary-lighter relative rounded-3xl border-none px-6 py-10 !shadow-none md:py-12"
                     style={{ backgroundColor: getColorWithOpacity(stat.bg_color, 1), color: getColorWithOpacity(stat.text_color, 1) }}
                  >
                     <img src={stat.image} alt="" className="absolute top-0 right-0 w-full max-w-[100px]" />
                     <div
                        className="flex h-14 w-14 items-center justify-center rounded-full"
                        style={{ backgroundColor: getColorWithOpacity(stat.text_color, 0.1) }}
                     >
                        <DynamicIcon name={stat.icon} className="h-8 w-8" />
                     </div>

                     <h3 className="mt-8 text-3xl font-semibold md:text-4xl">{stat.count}</h3>
                     <p className="mt-4 text-sm">{stat.title}</p>
                  </Card>
               );
            })}
         </div>
      </Section>
   );
};

export default Overview;
