import SearchInput from '@/components/search-input';
import { getPageSection } from '@/lib/page';
import { cn } from '@/lib/utils';
import { IntroPageProps } from '@/types/page';
import { router, usePage } from '@inertiajs/react';
import Section from '../section';

const Hero = () => {
   const { props } = usePage<IntroPageProps>();
   const heroSection = getPageSection(props.page, 'hero');

   return (
      <Section
         customize={props.customize}
         pageSection={heroSection}
         containerClass={cn('py-20')}
         contentClass={cn('grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-3')}
      >
         <div className="space-y-8 lg:space-y-10">
            <div>
               <p className="text-secondary-foreground mb-2 text-lg font-medium">{heroSection?.title}</p>
               <h1 className="text-3xl leading-tight font-bold md:text-4xl lg:text-[42px] lg:leading-14">{heroSection?.sub_title}</h1>
               <p className="text-muted-foreground mt-5 text-lg">{heroSection?.description}</p>
            </div>

            <div className="relative">
               <SearchInput
                  iconPosition="right"
                  placeholder="Search for courses that fit your goals"
                  className="[&>svg]:text-secondary-foreground bg-background z-10 w-full rounded md:max-w-[440px] [&>input]:h-10"
                  onChangeValue={(value) => router.get(route('category.courses', { category: 'all', search: value }))}
               />

               <div className="after:pointer-events-none after:absolute after:top-1/2 after:-left-[60px] after:h-[240px] after:w-[240px] after:-translate-y-1/2 after:rounded-full after:bg-[rgba(0,167,111,1)] after:blur-[290px] after:content-[''] dark:after:bg-[#fff5cc6d]"></div>
            </div>
         </div>

         {/* Right Image */}
         <div className="animate-fade-in relative flex items-center justify-center lg:justify-end">
            <img src={heroSection?.thumbnail || ''} alt="Student learning online" className="relative z-10 h-full max-h-[460px]" />

            <div className="after:pointer-events-none after:absolute after:top-0 after:right-0 after:h-[240px] after:w-[240px] after:rounded-full after:bg-[rgba(97,95,255,1))] after:blur-[290px] after:content-[''] dark:after:bg-[#fff5cc6d]"></div>
         </div>
      </Section>
   );
};

export default Hero;
