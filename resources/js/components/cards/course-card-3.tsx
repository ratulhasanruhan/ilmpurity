import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { cn, systemCurrency } from '@/lib/utils';
import { SharedData } from '@/types/global';
import { Link, router, usePage } from '@inertiajs/react';
import { BadgeCheck, Clock, VideoIcon } from 'lucide-react';
import { Button } from '../ui/button';

interface Props {
   course: Course;
   className?: string;
}

const CourseCard3 = ({ course, className }: Props) => {
   const { props } = usePage<SharedData>();
   const { user } = props.auth;
   const { translate } = props;
   const { frontend, common, button } = translate;
   const currency = systemCurrency(props.system.fields['selling_currency']);

   // Enrollment/Buy button component
   const enrollmentHandler = (course: Course) => {
      if (course.pricing_type === 'free') {
         router.post(route('enrollments.store'), {
            user_id: user?.id,
            course_id: course.id,
            enrollment_type: 'free',
         });
      } else {
         router.post(route('course-cart.store'), {
            course_id: course.id,
         });
      }
   };

   return (
      <Card className={cn(className)}>
         <CardHeader className="p-0">
            <div className="relative">
               <div className="p-2 pb-0">
                  <Link
                     href={route('course.details', {
                        slug: course.slug,
                        id: course.id,
                     })}
                  >
                     <div className="group relative h-[320px] w-full overflow-hidden rounded-lg">
                        <img
                           src={course.thumbnail || '/assets/images/blank-image.jpg'}
                           alt={course.title}
                           className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                           onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = '/assets/images/blank-image.jpg';
                           }}
                        />

                        <div className="from-primary dark:from-primary-foreground absolute bottom-0 left-1/2 flex h-full w-full -translate-x-1/2 flex-col justify-end bg-gradient-to-t p-4 text-center text-white opacity-0 transition-all duration-200 group-hover:opacity-100">
                           <h6 className="text-2xl font-semibold md:text-3xl">{course.title}</h6>
                           <p className="mt-1 md:text-lg">{course.course_category.title}</p>
                        </div>
                     </div>
                  </Link>
               </div>
            </div>
         </CardHeader>

         <CardContent className="space-y-4 p-5">
            <p>{course.short_description}</p>

            <div className="flex items-center gap-3">
               <Button className="px-5" onClick={() => enrollmentHandler(course)}>
                  <Clock /> {course.pricing_type === 'free' ? common.free : `${currency?.symbol}${course.price}`} | {button.enroll_now}
               </Button>
               <Button
                  variant="outline"
                  className="px-5"
                  onClick={() =>
                     router.get(
                        route('course.details', {
                           slug: course.slug,
                           id: course.id,
                        }),
                     )
                  }
               >
                  <VideoIcon /> {frontend.course_details}
               </Button>
            </div>

            <p className="flex items-center gap-2">
               <BadgeCheck size={16} />
               <span className="text-sm">{course.course_category.title}</span>
            </p>
         </CardContent>
      </Card>
   );
};

export default CourseCard3;
