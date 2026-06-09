import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { systemCurrency } from '@/lib/utils';
import { SharedData } from '@/types/global';
import { useForm, usePage } from '@inertiajs/react';
import { Trash } from 'lucide-react';

const CourseCard = ({ course }: { course: Course }) => {
   const { system } = usePage<SharedData>().props;
   const { delete: destroy, processing } = useForm();
   const currency = systemCurrency(system.fields['selling_currency']);

   return (
      <Card className="overflow-hidden">
         <CardContent className="p-0">
            <div className="flex flex-col md:flex-row">
               <div className="bg-muted h-48 w-full overflow-hidden md:w-60">
                  <img alt={course.title} className="h-full w-full object-cover" src={course.thumbnail ?? '/assets/images/blank-image.jpg'} />
               </div>
               <div className="flex flex-1 flex-col justify-between p-5">
                  <div>
                     <h3 className="mb-2 text-xl font-semibold">{course.title}</h3>
                     <p className="text-muted-foreground mb-4 line-clamp-2">{course.short_description}</p>
                  </div>
                  <div className="flex items-center justify-between">
                     <p className="capitalize">
                        {course.pricing_type === 'free' ? (
                           course.pricing_type
                        ) : course.discount ? (
                           <>
                              <span className="text-xl font-bold">
                                 {currency?.symbol}
                                 {course.discount_price}
                              </span>
                              <span className="text-muted-foreground ml-2 text-sm line-through">
                                 {currency?.symbol}
                                 {course.price}
                              </span>
                           </>
                        ) : (
                           <>
                              <span className="text-xl font-bold">
                                 {currency?.symbol}
                                 {course.price}
                              </span>
                           </>
                        )}
                     </p>

                     <Button size="icon" variant="ghost" onClick={() => destroy(route('course-cart.destroy', course.id))} disabled={processing}>
                        <Trash className="h-5 w-5" />
                     </Button>
                  </div>
               </div>
            </div>
         </CardContent>
      </Card>
   );
};

export default CourseCard;
