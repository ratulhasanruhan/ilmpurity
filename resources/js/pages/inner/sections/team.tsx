import { getPageSection } from '@/lib/page';
import { cn } from '@/lib/utils';
import Section from '@/pages/intro/partials/section';
import { usePage } from '@inertiajs/react';
import { InnerPageProps } from '..';

const Team = () => {
   const { props } = usePage<InnerPageProps>();
   const teamSection = getPageSection(props.innerPage, 'team');

   return (
      <Section
         customize={props.customize}
         pageSection={teamSection}
         containerClass={cn('py-20 md:py-[120px]')}
         contentClass={cn('flex flex-col items-center justify-center gap-7 md:flex-row')}
      >
         <div className="relative w-full space-y-7 md:max-w-[384px]">
            <h1 className="text-2xl font-bold md:text-[30px]">{teamSection?.title}</h1>
            <p className="text-muted-foreground mt-4">{teamSection?.description}</p>
         </div>

         <div className="grid grid-cols-1 gap-7 md:grid-cols-4">
            {teamSection?.properties.array.map((stat, index) => (
               <div key={`item-${index}`} className="group relative h-[192px] overflow-hidden rounded-lg">
                  <img src={stat.image} alt={stat.title} className="h-full w-full rounded-lg object-cover object-center" />

                  <div className="from-primary dark:from-primary-foreground absolute bottom-0 left-1/2 flex h-full w-full -translate-x-1/2 flex-col justify-end bg-gradient-to-t p-4 text-center opacity-0 transition-all duration-200 group-hover:opacity-100">
                     <p className="font-semibold text-white">{stat.name}</p>
                     <p className="text-xs text-white">{stat.role}</p>
                  </div>
               </div>
            ))}
         </div>
      </Section>
   );
};

export default Team;
