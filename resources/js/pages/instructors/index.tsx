import CourseCard1 from '@/components/cards/course-card-1';
import RatingStars from '@/components/rating-stars';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import LandingLayout from '@/layouts/landing-layout';
import { getQueryParams } from '@/lib/route';
import { SharedData } from '@/types/global';
import { Head, router, usePage } from '@inertiajs/react';
import { Book, Grid, List, Star, Users } from 'lucide-react';
import { ReactNode } from 'react';

interface InstructorPageProps extends SharedData {
   instructor: Instructor;
}

const Index = (props: InstructorPageProps) => {
   const { instructor, translate } = props;
   const { frontend, common } = translate;
   const { url } = usePage();
   const urlParams = getQueryParams(url);
   const viewType = urlParams['view'] ?? 'grid';
   const { id, user, courses, total_reviews_count, total_average_rating, total_enrollments_count } = instructor;

   return (
      <div className="container space-y-10 py-10 md:py-16">
         <Head title={`${user.name} - ${frontend.instructor_profile}`} />

         {/* Instructor Profile Card */}
         <div>
            <div className="flex items-center gap-4">
               <Avatar className="h-12 w-12">
                  <AvatarImage src={user.photo || ''} alt={user.name} className="object-cover" />
                  <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
               </Avatar>

               <div className="group">
                  <h3 className="text-xl font-semibold">{user.name}</h3>
                  <p className="text-gray-500">{user.email}</p>
               </div>

               <div className="ml-auto flex items-center gap-1">
                  <span className="text-xl font-semibold">{total_average_rating ? Number(total_average_rating).toFixed(1) : 0}</span>
                  <RatingStars rating={total_average_rating || 0} starClass="h-4 w-4" />
               </div>
            </div>

            <div className="mt-6 flex gap-8">
               <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-gray-500" />
                  <span>{total_enrollments_count} {common.students}</span>
               </div>
               <div className="flex items-center gap-2">
                  <Book className="h-5 w-5 text-gray-500" />
                  <span>{courses.length} {common.courses}</span>
               </div>
               <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-gray-500" />
                  <span>{total_reviews_count} {common.reviews}</span>
               </div>
            </div>
         </div>

         {/* Course List Header */}
         <div className="mb-4 flex items-center justify-between">
            <h2 className="text-2xl font-bold">{frontend.all_courses}</h2>
            <div className="flex items-center space-x-2">
               <TooltipProvider delayDuration={0}>
                  <Tooltip>
                     <TooltipTrigger asChild>
                        <Button
                           size="icon"
                           variant={viewType === 'grid' ? 'default' : 'outline'}
                           onClick={() => router.get(route('instructors.show', { instructor: id, view: 'grid' }))}
                        >
                           <Grid className="h-4 w-4" />
                        </Button>
                     </TooltipTrigger>
                     <TooltipContent>
                        <p>{frontend.grid_view}</p>
                     </TooltipContent>
                  </Tooltip>
               </TooltipProvider>

               <TooltipProvider delayDuration={0}>
                  <Tooltip>
                     <TooltipTrigger asChild>
                        <Button
                           size="icon"
                           variant={viewType === 'list' ? 'default' : 'outline'}
                           onClick={() => router.get(route('instructors.show', { instructor: id, view: 'list' }))}
                        >
                           <List className="h-4 w-4" />
                        </Button>
                     </TooltipTrigger>
                     <TooltipContent>
                        <p>{frontend.list_view}</p>
                     </TooltipContent>
                  </Tooltip>
               </TooltipProvider>
            </div>
         </div>

         <div className={viewType === 'grid' ? 'grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3' : 'space-y-7'}>
            {courses.map((course) => (
               <CourseCard1 key={course.id} course={course} viewType={viewType as 'grid' | 'list'} />
            ))}
         </div>
      </div>
   );
};

Index.layout = (page: ReactNode) => <LandingLayout children={page} customizable={false} />;

export default Index;
