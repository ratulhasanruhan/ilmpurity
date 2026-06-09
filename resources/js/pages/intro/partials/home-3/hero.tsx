import ButtonGradientPrimary from '@/components/button-gradient-primary';
import { getPageSection, getPropertyArray } from '@/lib/page';
import { cn } from '@/lib/utils';
import { IntroPageProps } from '@/types/page';
import { Link, usePage } from '@inertiajs/react';
import Section from '../section';

const Hero = () => {
   const { props } = usePage<IntroPageProps>();
   const heroSection = getPageSection(props.page, 'hero');

   return (
      <Section
         customize={props.customize}
         pageSection={heroSection}
         containerClass={cn('py-20')}
         contentClass={cn('flex flex-col items-center justify-between gap-20 md:gap-10 lg:flex-row')}
      >
         {/* Left Content */}
         <div className="animate-fade-in relative w-full space-y-8 md:max-w-[480px] lg:space-y-10">
            <div className="relative z-10">
               <p className="text-secondary-foreground mb-2 text-lg font-medium">{heroSection?.title}</p>
               <h1 className="text-3xl leading-tight font-bold md:text-4xl lg:text-[44px] lg:leading-14">{heroSection?.sub_title}</h1>
               <p className="mt-5 text-lg">{heroSection?.description}</p>
            </div>

            {heroSection?.properties?.button_text && (
               <ButtonGradientPrimary asChild shadow={false} className="relative z-10 mb-10 md:mb-14">
                  <Link href={heroSection?.properties?.button_link || ''}>{heroSection?.properties?.button_text}</Link>
               </ButtonGradientPrimary>
            )}

            <div className="relative z-10 flex items-center justify-center gap-2.5 lg:justify-start">
               {getPropertyArray(heroSection).map((stat, index) => (
                  <div key={`item${stat.number}`} className="animate-fade-in p-2.5" style={{ animationDelay: `${index * 0.2}s` }}>
                     <h6 className="text-lg font-bold lg:text-xl">{stat.value}</h6>
                     <p className="text-muted-foreground text-sm">{stat.label}</p>
                  </div>
               ))}
            </div>

            <div className="after:pointer-events-none after:absolute after:top-0 after:-right-20 after:h-[240px] after:w-[240px] after:rounded-full after:bg-[rgba(97,95,255,1))] after:blur-[290px] after:content-['']"></div>
         </div>

         {/* Right Image */}
         <div className="relative flex w-full max-w-[680px] items-center justify-center lg:justify-end">
            <img
               src={heroSection?.thumbnail || '/assets/images/intro/default/hero-image.png'}
               alt="Student learning online"
               className="relative z-10 w-full"
            />

            <div className="after:pointer-events-none after:absolute after:right-0 after:bottom-0 after:h-[240px] after:w-[240px] after:rounded-full after:bg-[rgba(0,167,111,1)] after:blur-[290px] after:content-['']"></div>
         </div>
      </Section>
   );
};

export default Hero;
