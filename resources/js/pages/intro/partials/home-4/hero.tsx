import ButtonGradientPrimary from '@/components/button-gradient-primary';
import RatingStars from '@/components/rating-stars';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import VideoPlayer from '@/components/video-player';
import { getPageSection, getPropertyArray } from '@/lib/page';
import { cn } from '@/lib/utils';
import { IntroPageProps } from '@/types/page';
import { Link, usePage } from '@inertiajs/react';
import { Play } from 'lucide-react';
import Section from '../section';

const Hero = () => {
   const { props } = usePage<IntroPageProps>();
   const { page } = props;
   const heroSection = getPageSection(page, 'hero');

   return (
      <>
         <div className="relative mx-auto max-w-[1440px]">
            <Section customize={props.customize} pageSection={heroSection} containerClass="pt-20" contentClass="relative">
               <div className={cn('relative z-10 grid grid-cols-1 items-center gap-x-20')}>
                  <div className="mx-auto mb-16 max-w-[712px] text-center">
                     <h1 className="mb-4 text-4xl font-bold md:text-5xl md:leading-14 md:font-extrabold">{heroSection?.title}</h1>
                     <p className="text-muted-foreground mb-6 text-lg md:px-8">{heroSection?.description}</p>

                     <div className="mb-10 flex flex-row justify-center gap-6">
                        {heroSection?.properties?.button_text_1 && (
                           <ButtonGradientPrimary size="lg" asChild shadow={false}>
                              <Link href={heroSection?.properties?.button_link_1 || ''}>{heroSection?.properties?.button_text_1}</Link>
                           </ButtonGradientPrimary>
                        )}

                        {heroSection?.properties?.button_text_2 && (
                           <Button size="lg" asChild variant="outline" className="px-4">
                              <Link href={heroSection?.properties?.button_link_2 || ''}>{heroSection?.properties?.button_text_2}</Link>
                           </Button>
                        )}
                     </div>

                     <div>
                        {heroSection?.properties?.ratings && (
                           <div className="flex items-center justify-center gap-2">
                              <RatingStars rating={5} starClass="w-4 h-4" />
                              <p className="font-medium">{heroSection?.properties?.ratings}</p>
                           </div>
                        )}
                        {heroSection?.properties?.subscribers && (
                           <p className="text-muted-foreground text-sm">{heroSection?.properties?.subscribers}</p>
                        )}
                     </div>
                  </div>
               </div>

               <div className="shadow-card-hover relative z-10 mx-auto max-w-[780px] overflow-hidden rounded-3xl md:rounded-4xl">
                  <img src={heroSection?.thumbnail || '/assets/blank-image.png'} alt={heroSection?.title} className="mx-auto w-full" />

                  {heroSection?.video_url && (
                     <Dialog>
                        <DialogTrigger asChild>
                           <button className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 cursor-pointer rounded-full bg-black/70 p-4 transition-transform hover:scale-110">
                              <Play className="h-6 w-6 text-white" />
                           </button>
                        </DialogTrigger>

                        <DialogContent className="overflow-hidden p-0 md:min-w-3xl">
                           <VideoPlayer
                              source={{
                                 type: 'video' as const,
                                 sources: [
                                    {
                                       src: heroSection?.video_url,
                                       type: 'video/mp4' as const,
                                    },
                                 ],
                              }}
                           />
                        </DialogContent>
                     </Dialog>
                  )}
               </div>

               <div className="hidden lg:block">
                  {getPropertyArray(heroSection).map((item, index) => (
                     <Card
                        key={`item-${index}`}
                        className={cn(
                           'overflow-hidden rounded-xl',
                           index === 0 && 'absolute top-[180px] left-20 z-10',
                           index === 1 && 'absolute top-[200px] right-20 z-10',
                           index === 2 && 'absolute bottom-0 left-20 z-10',
                           index === 3 && 'absolute right-20 bottom-20 z-10',
                        )}
                     >
                        <img src={item.image} alt="" className={cn('h-[180px]')} />
                     </Card>
                  ))}
               </div>

               <div className="after:pointer-events-none after:absolute after:top-0 after:left-0 after:h-[334px] after:w-[334px] after:rounded-full after:bg-[rgba(89,85,220,1)] after:blur-[320px] after:content-['']"></div>

               <div className="after:pointer-events-none after:absolute after:top-[220px] after:right-0 after:h-[300px] after:w-[300px] after:rounded-full after:bg-[rgba(255,190,0,1)] after:blur-[310px] after:content-['']"></div>
            </Section>

            <img src={heroSection?.background_image} alt="" className="absolute bottom-0 w-full object-cover" />
         </div>

         <div className="container grid grid-cols-2 gap-6 py-10 sm:grid-cols-4 lg:hidden">
            {getPropertyArray(heroSection).map((item, index) => (
               <div key={`item-${index}`} className="flex items-center justify-center">
                  <img src={item.image} alt="" className="shadow-card h-[160px] overflow-hidden rounded-xl sm:h-[180px]" />
               </div>
            ))}
         </div>
      </>
   );
};

export default Hero;
