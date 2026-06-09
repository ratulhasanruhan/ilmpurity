import { getPageSection } from '@/lib/page';
import { cn } from '@/lib/utils';
import Section from '@/pages/intro/partials/section';
import { usePage } from '@inertiajs/react';
import { InnerPageProps } from '..';

const Hero = () => {
   const { props } = usePage<InnerPageProps>();
   const heroSection = getPageSection(props.innerPage, 'hero');

   return (
      <Section
         customize={props.customize}
         pageSection={heroSection}
         containerClass={cn('py-20 md:py-[120px]')}
         contentClass={cn('flex flex-col items-center justify-between gap-12 md:flex-row md:gap-3')}
      >
         <div className="relative z-10 flex flex-col items-center justify-center gap-7 md:flex-row">
            <div className="grid w-full grid-cols-1 gap-7 md:grid-cols-2">
               {heroSection?.properties.array.map((item, index) => (
                  <div key={`image-${index}`} className="h-[356px]">
                     <img key={`image-${index}`} src={item.image} alt="" className="h-full w-full rounded-2xl object-cover object-center" />
                  </div>
               ))}
            </div>

            <div className="w-full space-y-7 md:max-w-[480px]">
               {heroSection?.properties.array.map((item, index) => (
                  <div key={`contents-${index}`} className="space-y-2">
                     <h1 className="text-2xl font-bold md:text-[30px]">{item.title}</h1>
                     <p className="text-muted-foreground">{item.description}</p>
                  </div>
               ))}
            </div>
         </div>
      </Section>
   );
};

export default Hero;
