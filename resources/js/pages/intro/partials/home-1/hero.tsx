import ButtonGradientPrimary from '@/components/button-gradient-primary';
import RatingStars from '@/components/rating-stars';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
         containerClass={cn('pt-20 pb-10')}
         contentClass={cn('flex flex-col items-center justify-between gap-12 md:flex-row md:gap-3')}
      >
         <div className="relative w-full md:max-w-[480px]">
            <div className="relative z-10 mb-6">
               <p className="text-secondary-foreground mb-2 text-lg font-medium">{heroSection?.title}</p>
               <h1 className="text-3xl leading-tight font-bold md:text-4xl lg:text-[42px] lg:leading-14">{heroSection?.sub_title}</h1>
               <p className="text-muted-foreground mt-4 text-lg">{heroSection?.description}</p>
            </div>

            {heroSection?.properties?.button_text && (
               <ButtonGradientPrimary asChild shadow={false} className="relative z-10 mb-10 md:mb-14">
                  <Link href={heroSection?.properties?.button_link || ''}>{heroSection?.properties?.button_text}</Link>
               </ButtonGradientPrimary>
            )}

            <div className="relative z-10 flex items-center gap-3">
               <div className="*:data-[slot=avatar]:ring-background flex -space-x-4 *:data-[slot=avatar]:ring-2 *:data-[slot=avatar]:grayscale">
                  {getPropertyArray(heroSection).map((item, index) => (
                     <Avatar key={index} className="h-11 w-11">
                        <AvatarImage src={item.image || ''} alt={item.name} className="object-cover" />
                        <AvatarFallback>IM</AvatarFallback>
                     </Avatar>
                  ))}
               </div>
               <div>
                  {heroSection?.properties?.ratings && (
                     <div className="flex items-center gap-2">
                        <RatingStars rating={5} starClass="w-4 h-4" />
                        <p className="font-medium">{heroSection?.properties?.ratings}</p>
                     </div>
                  )}
                  {heroSection?.properties?.subscribers && <p className="text-muted-foreground text-sm">{heroSection?.properties?.subscribers}</p>}
               </div>
            </div>

            <div className="after:pointer-events-none after:absolute after:top-0 after:-right-20 after:h-[240px] after:w-[240px] after:rounded-full after:bg-[rgba(97,95,255,1))] after:blur-[290px] after:content-['']"></div>
         </div>

         {/* Right Image */}
         <div className="relative w-full max-w-[640px]">
            <img src={heroSection?.thumbnail || ''} alt="Student learning online" className="relative z-10 h-full w-full" />

            <div className="after:pointer-events-none after:absolute after:right-0 after:bottom-20 after:h-[240px] after:w-[240px] after:rounded-full after:bg-[rgba(0,167,111,1)] after:blur-[290px] after:content-['']"></div>
         </div>
      </Section>
   );
};

export default Hero;
