import ExamCard2 from '@/components/exam/exam-card-2';
import { Card } from '@/components/ui/card';
import { StudentDashboardProps } from '@/types/page';
import { usePage } from '@inertiajs/react';

const MyExams = () => {
   const { examEnrollments, translate } = usePage<StudentDashboardProps>().props;
   const { frontend } = translate;

   return examEnrollments && examEnrollments.length > 0 ? (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3">
         {examEnrollments.map((enrollment) => (
            <ExamCard2 key={enrollment.id} enrollment={enrollment} />
         ))}
      </div>
   ) : (
      <Card className="flex items-center justify-center p-6">
         <p>{frontend.no_courses_found}</p>
      </Card>
   );
};

export default MyExams;
