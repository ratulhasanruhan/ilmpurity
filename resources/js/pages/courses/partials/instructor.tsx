import RatingStars from '@/components/rating-stars';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { SharedData } from '@/types/global';
import { Link, usePage } from '@inertiajs/react';
import { Book, Star, Users } from 'lucide-react';

const Instructor = ({ course }: { course: Course }) => {
   const { props } = usePage<SharedData>();
   const { translate } = props;
   const { frontend } = translate;
   const { instructor } = course;
   const { user, courses } = instructor;
   const enrollmentsCount = courses.reduce((acc, course) => acc + (course.enrollments_count || 0), 0);

   return (
      <div>
         <h6 className="mb-4 text-xl font-semibold">{frontend.instructor}</h6>
         <Separator className="my-4" />

         <div className="flex items-center gap-4">
            <Link href={route('instructors.show', instructor.id)}>
               <Avatar className="h-12 w-12">
                  <AvatarImage src={user.photo || ''} alt="@shadcn" className="object-cover" />
                  <AvatarFallback>CN</AvatarFallback>
               </Avatar>
            </Link>

            <Link href={route('instructors.show', instructor.id)}>
               <div className="group">
                  <h3 className="text-xl font-semibold group-hover:underline">{user.name}</h3>
                  <p className="text-gray-500">{user.email}</p>
               </div>
            </Link>

            <div className="ml-auto flex items-center gap-1">
               <span className="text-xl font-semibold">
                  {instructor.total_average_rating ? Number(instructor.total_average_rating).toFixed(1) : 0}
               </span>

               <RatingStars rating={instructor.total_average_rating} starClass="w-4 h-5" />
            </div>
         </div>

         <div className="mt-6 flex gap-8">
            <div className="flex items-center gap-2">
               <Users className="h-5 w-5 text-gray-500" />
               <span>{enrollmentsCount} {frontend.students}</span>
            </div>
            <div className="flex items-center gap-2">
               <Book className="h-5 w-5 text-gray-500" />
               <span>{courses.length} Courses</span>
            </div>
            <div className="flex items-center gap-2">
               <Star className="h-5 w-5 text-gray-500" />
               <span>{instructor.total_reviews_count} Reviews</span>
            </div>
         </div>

         <Button className="mt-6">
            <Link href={route('instructors.show', instructor.id)}>{frontend.view_details}</Link>
         </Button>
      </div>
   );
};

export default Instructor;
