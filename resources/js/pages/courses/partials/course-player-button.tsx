import { Button } from '@/components/ui/button';
import { SharedData } from '@/types/global';
import { Link, router, usePage } from '@inertiajs/react';
import { CourseDetailsProps } from '../show';

// Separate component for the play button to reduce duplication
const EnabledPlayButton = ({ watchHistory }: { watchHistory: WatchHistory }) => {
   const { props } = usePage<SharedData>();
   const { translate } = props;
   const { frontend } = translate;

   return (
      <Button size="lg" className="w-full" asChild>
         <Link
            href={route('course.player', {
               type: watchHistory.current_watching_type,
               watch_history: watchHistory.id,
               lesson_id: watchHistory.current_watching_id,
            })}
         >
            {frontend.play_course}
         </Link>
      </Button>
   );
};

// Disabled play button component
const DisabledPlayButton = ({ course, approvalStatus }: { course: Course; approvalStatus: CourseApprovalValidation }) => {
   const { props } = usePage<SharedData>();
   const { translate } = props;
   const { frontend } = translate;
   const approve_able = approvalStatus.approve_able;

   return approve_able ? (
      <Button size="lg" className="w-full" onClick={() => router.post(route('player.init.watch-history'), { course_id: course.id })}>
         {frontend.play_course}
      </Button>
   ) : (
      <Button disabled size="lg" className="w-full">
         {frontend.course_player}
      </Button>
   );
};

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

const EnrollOrPlayerButton = () => {
   const { auth, course, enrollment, watchHistory, approvalStatus, wishlists, translate } = usePage<CourseDetailsProps>().props;
   const { frontend } = translate;

   // Compute access conditions - improves readability
   const isEnrolled = !!enrollment;
   const hasWatchHistory = !!watchHistory;
   const isAdminOrInstructor = auth.user && ['admin', 'instructor'].includes(auth.user.role);
   const canPlay = hasWatchHistory && (isAdminOrInstructor || isEnrolled);

   const isWishlisted = wishlists.find((wishlist) => wishlist.course_id === course.id);

   const handleWishlist = () => {
      if (isWishlisted) {
         router.delete(route('course-wishlists.destroy', { id: isWishlisted.id }));
      } else {
         router.post(route('course-wishlists.store', { user_id: auth.user?.id, course_id: course.id }));
      }
   };

   // Render the appropriate button based on conditions
   if (canPlay) {
      return <EnabledPlayButton watchHistory={watchHistory} />;
   } else if (isAdminOrInstructor) {
      return <DisabledPlayButton course={course} approvalStatus={approvalStatus} />;
   } else {
      return (
         <>
            <Button className="w-full px-1 sm:px-3" variant="outline" size="lg" onClick={handleWishlist}>
               {isWishlisted ? frontend.remove_from_wishlist : frontend.add_to_wishlist}
            </Button>

            <EnrollmentButton auth={auth} course={course} />
         </>
      );
   }
};

export default EnrollOrPlayerButton;
