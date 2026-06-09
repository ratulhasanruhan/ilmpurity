import RatingStars from '@/components/rating-stars';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ExamPreviewProps } from '@/types/page';
import { Link, usePage } from '@inertiajs/react';
import { Clock, GraduationCap, Users } from 'lucide-react';

const ExamHeader = () => {
   const { exam, instructor, translate } = usePage<ExamPreviewProps>().props;
   const { frontend } = translate;
   const { title, short_description, average_rating } = exam;

   return (
      <div className="space-y-7">
         <h1 className="text-3xl font-semibold md:text-4xl">{title}</h1>

         <p>{short_description}</p>

         <div className="grid grid-cols-2 gap-y-4 lg:grid-cols-3">
            {/* Instructor Info */}
            <Link href={route('instructors.show', instructor.id)}>
               <div className="group flex items-center gap-2">
                  <Avatar>
                     <AvatarImage src={instructor.user.photo || ''} alt={instructor.user.name} className="object-cover" />
                     <AvatarFallback>{instructor.user.name[0]}</AvatarFallback>
                  </Avatar>
                  <span className="font-medium group-hover:underline">{instructor.user.name}</span>
               </div>
            </Link>

            {/* Rating */}
            <div className="flex items-center gap-1">
               <p className="font-semibold">{average_rating ? Number(average_rating).toFixed(1) : 0}</p>
               <RatingStars rating={average_rating || 0} starClass="w-4 h-5" />
            </div>

            {/* Language */}
            {/* <div className="flex items-center gap-2">
               <Languages className="h-5 w-5" />
               <span>{courseLanguage?.label}</span>
            </div> */}

            {/* Certificate */}
            <div className="flex items-center gap-2">
               <GraduationCap className="h-5 w-5" />
               <span>{frontend.course_certificate}</span>
            </div>

            {/* Students */}
            <div className="flex items-center gap-2">
               <Users className="h-5 w-5" />
               <span>
                  {exam.enrollments_count || 0} {frontend.enrolled_students}
               </span>
            </div>

            {/* Duration */}
            <div className="flex items-center gap-2">
               <Clock className="h-5 w-5" />
               <span>
                  {exam.duration_hours} hours {exam.duration_minutes} minutes
               </span>
            </div>
         </div>
      </div>
   );
};

export default ExamHeader;
