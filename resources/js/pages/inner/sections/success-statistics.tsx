import ButtonGradientPrimary from '@/components/button-gradient-primary';
import { getPageSection } from '@/lib/page';
import Section from '@/pages/intro/partials/section';
import { Link, usePage } from '@inertiajs/react';
import { InnerPageProps } from '..';

const SuccessStatistics = () => {
   const { props } = usePage<InnerPageProps>();
   const { customize, innerPage } = props;
   const successStatistics = getPageSection(innerPage, 'success_statistics');

   return (
      <div className="overflow-y-hidden bg-cover bg-center py-[120px]">
         <Section customize={customize} pageSection={successStatistics} containerClass="relative">
            <div className="relative z-10 flex flex-col items-center justify-center gap-7 md:flex-row">
               <div className="relative w-full space-y-7 md:max-w-[384px]">
                  <div className="relative z-10 mb-6">
                     <h1 className="text-2xl font-bold md:text-[30px]">{successStatistics?.title}</h1>
                     <p className="text-muted-foreground mt-2">{successStatistics?.description}</p>
                  </div>

                  <ButtonGradientPrimary asChild shadow={false}>
                     <Link href="/courses/all">Browse Courses</Link>
                  </ButtonGradientPrimary>

                  <div className="relative z-10 flex items-center justify-center gap-2.5 lg:justify-start">
                     {successStatistics?.properties.array.map((stat, index) => (
                        <div key={`item-${index}`}>
                           <h6 className="text-2xl font-bold md:text-[30px]">{stat.count}</h6>
                           <p className="text-muted-foreground text-sm">{stat.title}</p>
                        </div>
                     ))}
                  </div>
               </div>

               <div className="grid grid-cols-1 gap-7 md:grid-cols-3">
                  {successStatistics?.properties.array.map((stat, index) => (
                     <div key={`item-${index}`} className="h-[400px]">
                        <img src={stat.image} alt={stat.title} className="h-full w-full rounded-2xl object-cover object-center" />
                     </div>
                  ))}
               </div>
            </div>

            <div className="after:pointer-events-none after:absolute after:bottom-0 after:left-0 after:h-[240px] after:w-[240px] after:rounded-full after:bg-[rgba(0,120,103,1)] after:blur-[200px] after:content-['']"></div>
            <div className="after:pointer-events-none after:absolute after:top-0 after:right-0 after:h-[240px] after:w-[240px] after:rounded-full after:bg-[rgba(97,95,255,1))] after:blur-[200px] after:content-['']"></div>
         </Section>
      </div>
   );
};

export default SuccessStatistics;
