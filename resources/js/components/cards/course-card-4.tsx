import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Link } from '@inertiajs/react';

interface Props {
   className?: string;
   enrollment: CourseEnrollment;
}

const CourseCard4 = ({ enrollment, className }: Props) => {
   const { course } = enrollment;

   return (
      <Card className={cn('overflow-hidden shadow-sm', className)}>
         <CardHeader className="p-0">
            <Link
               className="p-2 pb-0"
               href={route('student.course.show', {
                  id: course.id,
                  tab: 'modules',
               })}
            >
               <div className="relative h-[220px] w-full overflow-hidden rounded-lg">
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
         </CardHeader>

         <CardContent className="p-4">
            <div className="mb-3 flex items-center gap-2">
               <div className="flex items-center gap-2">
                  <Avatar className="h-5 w-5">
                     <AvatarImage src={course.instructor.user.photo || ''} alt={course.instructor.user.name} className="object-cover" />
                     <AvatarFallback>IM</AvatarFallback>
                  </Avatar>

                  <p className="text-xs font-medium">{course.instructor.user.name}</p>
               </div>
            </div>

            <Link
               href={route('student.course.show', {
                  id: course.id,
                  tab: 'modules',
               })}
            >
               <p className="hover:text-secondary-foreground text-sm font-semibold">{course.title}</p>
            </Link>
         </CardContent>
      </Card>
   );
};

export default CourseCard4;
