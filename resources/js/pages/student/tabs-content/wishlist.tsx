import DefaultCard from '@/components/cards/course-card-1';
import ExamCard from '@/components/exam/exam-card-1';
import { Card } from '@/components/ui/card';
import { StudentDashboardProps } from '@/types/page';
import { usePage } from '@inertiajs/react';

const Wishlist = () => {
   const { courseWishlists, examWishlists, translate } = usePage<StudentDashboardProps>().props;
   const { frontend } = translate;

   return (
      <div className="space-y-6">
         <div>
            <h2 className="mb-2 text-xl font-semibold">Course Wishlist</h2>

            {courseWishlists && courseWishlists.length > 0 ? (
               <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3">
                  {courseWishlists.map(({ id, course }) => (
                     <DefaultCard key={id} course={course} wishlists={courseWishlists} />
                  ))}
               </div>
            ) : (
               <Card className="flex items-center justify-center p-6">
                  <p>{frontend.no_wishlist_items}</p>
               </Card>
            )}
         </div>

         <div>
            <h2 className="mb-2 text-xl font-semibold">Exam Wishlist</h2>

            {examWishlists && examWishlists.length > 0 ? (
               <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3">
                  {examWishlists.map(({ id, exam }) => (
                     <ExamCard key={id} exam={exam} viewType="grid" />
                  ))}
               </div>
            ) : (
               <Card className="flex items-center justify-center p-6">
                  <p>{frontend.no_wishlist_items}</p>
               </Card>
            )}
         </div>
      </div>
   );
};

export default Wishlist;
