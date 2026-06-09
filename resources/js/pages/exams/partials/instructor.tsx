import RatingStars from '@/components/rating-stars';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ExamPreviewProps } from '@/types/page';
import { Link, usePage } from '@inertiajs/react';
import { Book, Star, Users } from 'lucide-react';

const Instructor = () => {
   const { instructor, translate } = usePage<ExamPreviewProps>().props;
   const { frontend } = translate;
   const {
      user,
      courses_count,
      total_reviews_count,
      total_average_rating,
      total_enrollments_count,
      exams_count,
      total_exam_reviews_count,
      total_exam_average_rating,
      total_exam_instructors_count,
   } = instructor;

   return (
      <div>
         <div className="flex items-center justify-between gap-4">
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
            </div>

            <Button>
               <Link href={route('instructors.show', instructor.id)}>{frontend.view_details}</Link>
            </Button>
         </div>

         <div className="mt-6 flex gap-8">
            <div className="flex items-center gap-2">
               <Book className="h-5 w-5 text-gray-500" />
               <span>{courses_count} Courses</span>
            </div>

            <div className="flex items-center gap-2">
               <Users className="h-5 w-5 text-gray-500" />
               <span>
                  {total_enrollments_count} {frontend.students}
               </span>
            </div>

            <div className="flex items-center gap-2">
               <Star className="h-5 w-5 text-gray-500" />
               <span>{total_reviews_count} Reviews</span>
            </div>

            <div className="flex items-center gap-2">
               <span>{total_average_rating ? Number(total_average_rating).toFixed(1) : 0}</span>
               <RatingStars rating={total_average_rating} starClass="w-4 h-5" />
            </div>
         </div>

         <div className="mt-6 flex gap-8">
            <div className="flex items-center gap-2">
               <Book className="h-5 w-5 text-gray-500" />
               <span>{exams_count} Exams</span>
            </div>

            <div className="flex items-center gap-2">
               <Users className="h-5 w-5 text-gray-500" />
               <span>
                  {total_exam_instructors_count} {frontend.students}
               </span>
            </div>

            <div className="flex items-center gap-2">
               <Star className="h-5 w-5 text-gray-500" />
               <span>{total_exam_reviews_count} Reviews</span>
            </div>

            <div className="flex items-center gap-2">
               <span>{total_exam_average_rating ? Number(total_exam_average_rating).toFixed(1) : 0}</span>
               <RatingStars rating={total_exam_average_rating} starClass="w-4 h-5" />
            </div>
         </div>
      </div>
   );
};

export default Instructor;
