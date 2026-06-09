import { Button } from '@/components/ui/button';
import { SharedData } from '@/types/global';
import { router, usePage } from '@inertiajs/react';

// Enrollment/Buy button component
const EnrollmentButton = ({ auth, course }: { auth: Auth; course: Course }) => {
   const { props } = usePage<SharedData>();
   const { translate } = props;
   const { frontend } = translate;

   const enrollmentHandler = (course: Course) => {
      router.post(route('enrollments.store'), {
         user_id: auth.user?.id,
         course_id: course.id,
         enrollment_type: 'free',
      });
   };

   return course.pricing_type === 'free' ? (
      <Button size="lg" className="w-full" onClick={() => enrollmentHandler(course)}>
         {frontend.enroll_now}
      </Button>
   ) : (
      <a href={route('payments.index', { from: 'web', item: 'course', id: course.id })}>
         <Button size="lg" className="w-full">
            {frontend.buy_now}
         </Button>
      </a>
   );
};

export default EnrollmentButton;
