import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn, getCourseDuration, systemCurrency } from '@/lib/utils';
import { SharedData } from '@/types/global';
import { Link, router, usePage } from '@inertiajs/react';
import { Clock, Heart, Star, Users } from 'lucide-react';

interface Props {
   course: Course;
   viewType?: 'grid' | 'list';
   className?: string;
   wishlists?: CourseWishlist[];
}

const CourseCard1 = ({ course, viewType = 'grid', className, wishlists }: Props) => {
   const { props } = usePage<SharedData>();
   const { user } = props.auth;
   const { translate } = props;
   const { button, frontend, common } = translate;

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
      <Card className={cn('group p-0', viewType === 'list' && 'sm:flex sm:w-full sm:flex-row sm:justify-between', className)}>
         <CardHeader className="p-0">
            <div className="relative">
               <div className={cn('p-2 pb-0', viewType === 'list' && 'pb-2')}>
                  <Link
                     href={route('course.details', {
                        slug: course.slug,
                        id: course.id,
                     })}
                  >
                     <div className={cn('relative h-[190px] overflow-hidden rounded-lg', viewType === 'list' && 'sm:w-[260px]')}>
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
               </div>

               {wishlists && (
                  <TooltipProvider delayDuration={0}>
                     <Tooltip>
                        <TooltipTrigger className="absolute top-3 right-3 z-10 opacity-0 group-hover:opacity-100">
                           <Button size="icon" variant="ghost" className="bg-white/80 hover:bg-white" onClick={handleWishlist}>
                              <Heart className={cn('h-4 w-4', isWishlisted && 'text-red-500')} />
                           </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                           <p> {isWishlisted ? frontend.remove_from_wishlist : frontend.add_to_wishlist}</p>
                        </TooltipContent>
                     </Tooltip>
                  </TooltipProvider>
               )}
            </div>
         </CardHeader>

         <div className={cn(viewType === 'list' && 'flex w-[calc(100%-272px)] flex-col justify-between')}>
            <CardContent className={cn('p-4', viewType === 'list' && 'h-full')}>
               <div className="text-secondary-foreground mb-1 flex items-center gap-1.5 text-xs">
                  <Users className="h-3 w-3" />
                  <span>
                     {course.enrollments_count || 0} {course.enrollments_count || 0 > 0 ? ` ${common.students}` : ` ${frontend.student}`}
                  </span>

                  <Clock className="ml-2 h-3 w-3" />
                  <span>{getCourseDuration(course, 'readable')}</span>
               </div>

               <Link
                  className={cn('space-y-3', viewType === 'list' && 'sm:flex sm:h-full sm:flex-col sm:justify-between sm:py-4')}
                  href={route('course.details', {
                     slug: course.slug,
                     id: course.id,
                  })}
               >
                  <p className="hover:text-secondary-foreground font-semibold">{course.title}</p>

                  <p className="text-muted-foreground flex items-center gap-1.5 text-sm">
                     <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                     <span>{course.average_rating ? Number(course.average_rating).toFixed(2) : '0.00'}</span>
                     <span>
                        ({course.reviews_count || 0} {common.reviews})
                     </span>
                  </p>
               </Link>
            </CardContent>

            <CardFooter className="flex w-full items-center justify-between p-4 pt-0">
               <p className="capitalize">
                  {course.pricing_type === 'free' ? (
                     common.free
                  ) : course.discount ? (
                     <>
                        <span className="font-semibold">
                           {currency?.symbol}
                           {course.discount_price}
                        </span>
                        <span className="text-muted-foreground ml-2 text-sm font-medium line-through">
                           {currency?.symbol}
                           {course.price}
                        </span>
                     </>
                  ) : (
                     <>
                        <span className="font-semibold">
                           {currency?.symbol}
                           {course.price}
                        </span>
                     </>
                  )}
               </p>

               <Button asChild variant="outline" className="border-secondary-light hover:bg-background hover:border-primary px-2.5">
                  <Link
                     href={route('course.details', {
                        slug: course.slug,
                        id: course.id,
                     })}
                  >
                     {button.learn_more}
                  </Link>
               </Button>
            </CardFooter>
         </div>
      </Card>
   );
};

export default CourseCard1;
