import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn, getCourseDuration, systemCurrency } from '@/lib/utils';
import { SharedData } from '@/types/global';
import { Link, router, usePage } from '@inertiajs/react';
import { Clock, Heart, Star, TrendingUp, Users } from 'lucide-react';

interface Props {
   course: Course;
   className?: string;
   wishlists?: CourseWishlist[];
}

const CourseCard2 = ({ course, className, wishlists }: Props) => {
   const { props } = usePage<SharedData>();
   const { user } = props.auth;
   const { button, common, frontend } = props.translate;

   const isWishlisted = wishlists?.find((wishlist) => wishlist.course_id === course.id);
   const currency = systemCurrency(props.system.fields['selling_currency']);

   const handleWishlist = () => {
      if (isWishlisted) {
         router.delete(route('course-wishlists.destroy', { id: isWishlisted.id }));
      } else {
         router.post(route('course-wishlists.store', { user_id: user?.id, course_id: course.id }));
      }
   };

   return (
      <Card className={cn(className)}>
         <CardHeader className="p-0">
            <div className="relative">
               <Link
                  href={route('course.details', {
                     slug: course.slug,
                     id: course.id,
                  })}
               >
                  <div className="relative h-[300px] w-full overflow-hidden rounded-t-lg">
                     <img
                        src={course.thumbnail || '/assets/images/blank-image.jpg'}
                        alt={course.title}
                        className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                        onError={(e) => {
                           const target = e.target as HTMLImageElement;
                           target.src = '/assets/images/blank-image.jpg';
                        }}
                     />
                  </div>
               </Link>

               {wishlists && (
                  <TooltipProvider delayDuration={0}>
                     <Tooltip>
                        <TooltipTrigger className="absolute top-2 right-2 z-10">
                           <Button size="icon" variant="ghost" className="bg-white/80 hover:bg-white" onClick={handleWishlist}>
                              <Heart className={cn('h-4 w-4', isWishlisted && 'text-red-500')} />
                           </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                           <p> {isWishlisted ? button.remove_from_wishlist : button.add_to_wishlist}</p>
                        </TooltipContent>
                     </Tooltip>
                  </TooltipProvider>
               )}
            </div>
         </CardHeader>

         <div className="p-4">
            <CardContent className="p-0 pb-5">
               <div className="mb-6 flex items-center justify-between">
                  <p className="text-secondary-foreground text-xs uppercase">{course.course_category.title}</p>

                  <div className="flex items-center gap-2">
                     {course.discount ? (
                        <p className="pt-1 text-gray-300 line-through">
                           {currency?.symbol}
                           {course.discount_price}
                        </p>
                     ) : (
                        ''
                     )}

                     {course.pricing_type === 'free' ? (
                        <p className="text-lg font-semibold">{common.free}</p>
                     ) : (
                        <p className="text-lg font-semibold">
                           {currency?.symbol}
                           {course.price}
                        </p>
                     )}
                  </div>
               </div>

               <Link
                  href={route('course.details', {
                     slug: course.slug,
                     id: course.id,
                  })}
               >
                  <p className="hover:text-secondary-foreground text-lg font-semibold">{course.title}</p>
               </Link>

               <div className="flex items-center gap-8 py-5">
                  <p className="flex items-center gap-1.5">
                     <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                     <span className="font-medium">{course.average_rating || 0}</span>
                     <span className="text-muted-foreground text-sm">
                        ({course.reviews_count || 0} {common.reviews})
                     </span>
                  </p>
                  <p className="flex items-center gap-1.5">
                     <Users className="h-3.5 w-3.5" />
                     <span className="font-medium">{course.enrollments_count || 0}</span>
                     <span className="text-muted-foreground text-sm">{course.enrollments_count || 0 > 0 ? common.students : frontend.student}</span>
                  </p>
               </div>

               <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                     <AvatarImage src={course.instructor.user.photo || ''} alt={course.instructor.user.name} className="object-cover" />
                     <AvatarFallback>IM</AvatarFallback>
                  </Avatar>
                  <p className="text-sm font-medium">{course.instructor.user.name}</p>
               </div>
            </CardContent>

            <CardFooter className="border-muted flex items-center gap-5 border-t p-0 pt-5">
               <p className="text-muted-foreground flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span className="text-sm">{getCourseDuration(course, 'readable')}</span>
               </p>

               <p className="text-muted-foreground flex items-center gap-1">
                  <TrendingUp className="h-4 w-4" />
                  <span className="text-sm">{course.level}</span>
               </p>
            </CardFooter>
         </div>
      </Card>
   );
};

export default CourseCard2;
