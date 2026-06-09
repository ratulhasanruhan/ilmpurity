import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { getPageSection, getPropertyArray } from '@/lib/page';
import { cn } from '@/lib/utils';
import { IntroPageProps } from '@/types/page';
import { Link, usePage } from '@inertiajs/react';
import { Pencil } from 'lucide-react';
import { DynamicIcon } from 'lucide-react/dynamic';
import InstructorSocials from '../instructor-socials';
import Section from '../section';

const Instructor = () => {
   const { props } = usePage<IntroPageProps>();
   const { page, instructor, customize } = props;
   const instructorSection = getPageSection(page, 'instructor');

   const oddElements = getPropertyArray(instructorSection).filter((_, index) => index % 2 === 0);
   const evenElements = getPropertyArray(instructorSection).filter((_, index) => index % 2 !== 0);

   return (
      <Section customize={customize} pageSection={instructorSection} containerClass="py-20 overflow-y-hidden" contentClass="relative">
         <div className="relative z-10 mx-auto mb-10 w-full text-center md:max-w-lg">
            <h2 className="mb-2 text-3xl font-bold sm:text-4xl">{instructorSection?.title}</h2>
            <p className="text-muted-foreground">{instructorSection?.description}</p>
         </div>

         <div className="relative z-10 mx-auto grid w-full max-w-[964px] grid-cols-1 gap-8 md:grid-cols-3">
            <div className="space-y-12">
               {oddElements?.map((item, index) => (
                  <div key={index}>
                     <div className="bg-background shadow-card-md h-10 w-10 rounded p-2">
                        <DynamicIcon name={item.icon} className="text-secondary-foreground h-6 w-6" />
                     </div>

                     <h3 className="pt-4 pb-2 font-semibold">{item.title}</h3>
                     <p className="text-muted-foreground text-sm">{item.description}</p>
                  </div>
               ))}
            </div>

            <Card className="!shadow-card-hover space-y-6 p-5">
               <img
                  className="h-[190px] w-full rounded-lg object-cover object-top"
                  src={instructorSection?.thumbnail || '/assets/images/blank-image.jpg'}
                  alt={instructor ? instructor.user.name : ''}
               />

               {instructor && (
                  <div className={cn('space-y-6', customize && 'section-edit')}>
                     {customize && (
                        <Button asChild size="icon" variant="secondary" className="absolute top-3 right-3 z-20">
                           <Link href={route('settings.account', { tab: 'profile-update' })}>
                              <Pencil className="h-7 w-7" />
                           </Link>
                        </Button>
                     )}

                     <div className="space-y-2">
                        <h3 className="font-semibold">{instructor.user.name}</h3>
                        <p className="text-muted-foreground text-sm">{instructor.designation}</p>
                        <p className="text-muted-foreground text-sm">{instructor.biography}</p>
                     </div>

                     <InstructorSocials instructor={instructor} className="py-0" buttonClass="w-8 h-8" />
                  </div>
               )}
            </Card>

            <div className="space-y-12">
               {evenElements?.map((item, index) => (
                  <div key={index}>
                     <div className="bg-background shadow-card-md h-10 w-10 rounded p-2">
                        <DynamicIcon name={item.icon} className="text-secondary-foreground h-6 w-6" />
                     </div>

                     <h3 className="pt-4 pb-2 font-semibold">{item.title}</h3>
                     <p className="text-muted-foreground text-sm">{item.description}</p>
                  </div>
               ))}
            </div>
         </div>

         <div className="after:pointer-events-none after:absolute after:top-1/2 after:left-1/2 after:h-[290px] after:w-[290px] after:-translate-x-1/2 after:-translate-y-1/2 after:rounded-full after:bg-[rgba(97,95,255,1))] after:blur-[320px] after:content-['']"></div>
      </Section>
   );
};

export default Instructor;
