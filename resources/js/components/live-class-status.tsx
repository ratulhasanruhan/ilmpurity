import { Button } from '@/components/ui/button';
import { CoursePlayerProps } from '@/types/page';
import { Link, usePage } from '@inertiajs/react';
import { ExternalLink } from 'lucide-react';
import { useEffect, useState } from 'react';

interface Props {
   courseId: string | number;
   liveClass: CourseLiveClass;
   zoomConfig: ZoomConfigFields;
}

const LiveClassStatus = ({ courseId, liveClass, zoomConfig }: Props) => {
   const { props } = usePage<CoursePlayerProps>();
   const { translate } = props;
   const { frontend } = translate;
   const [currentTime, setCurrentTime] = useState(new Date());

   // Get status of a live class
   const getClassStatus = (liveClass: CourseLiveClass): string => {
      const now = currentTime;
      const classStart = new Date(liveClass.class_date_and_time);
      const classEnd = liveClass.additional_info?.end_time
         ? new Date(liveClass.additional_info.end_time)
         : new Date(classStart.getTime() + 60 * 60 * 1000); // Default 1 hour

      if (now > classEnd) {
         return 'ended';
      } else if (now >= classStart && now <= classEnd) {
         return 'live';
      } else if (classStart > now) {
         return 'upcoming';
      }

      return 'scheduled';
   };

   const status = getClassStatus(liveClass);

   // Auto-rerender every minute, but stop when class has ended
   useEffect(() => {
      // Function to update time and check if class has ended
      const updateTimeAndCheckStatus = () => {
         const newTime = new Date();
         setCurrentTime(newTime);

         // Check if class has ended with new time
         const classEnd = liveClass.additional_info?.end_time
            ? new Date(liveClass.additional_info.end_time)
            : new Date(new Date(liveClass.class_date_and_time).getTime() + 60 * 60 * 1000);

         // Return true if class has ended
         return newTime > classEnd;
      };

      // Immediately check and update status on mount
      const hasEnded = updateTimeAndCheckStatus();

      // Don't set up interval if class has already ended
      if (hasEnded) {
         return;
      }

      // Set up interval to update current time every minute (60000ms)
      const interval = setInterval(() => {
         const classEnded = updateTimeAndCheckStatus();

         // Clear interval if class has ended
         if (classEnded) {
            clearInterval(interval);
         }
      }, 60000); // 60 seconds = 1 minute

      // Cleanup function - runs when component unmounts or dependencies change
      return () => {
         clearInterval(interval);
      };
   }, [liveClass.class_date_and_time, liveClass.additional_info?.end_time]);
   const isSdkConfig = zoomConfig.zoom_web_sdk && zoomConfig.zoom_sdk_client_id && zoomConfig.zoom_sdk_client_secret ? true : false;

   // Get status color
   const getStatusColor = (status: string) => {
      switch (status) {
         case 'live':
            return 'text-green-600 bg-green-100';
         case 'upcoming':
            return 'text-blue-600 bg-blue-100';
         case 'ended':
            return 'text-muted-foreground bg-gray-100';
         default:
            return 'text-orange-600 bg-orange-100';
      }
   };

   return (
      <>
         <span className={`rounded-full px-2 py-1 text-center text-xs font-medium capitalize ${getStatusColor(status)}`}>{status}</span>

         {/* Join button - show for live classes or when about to start */}
         {status === 'live' ? (
            isSdkConfig ? (
               <Link href={route('live-class.start', liveClass.id)}>
                  <Button size="sm" variant={status === 'live' ? 'default' : 'outline'} className="flex w-full items-center gap-2">
                     <ExternalLink className="h-4 w-4" />
                     {frontend.join_class}
                  </Button>
               </Link>
            ) : (
               <a href={liveClass.additional_info.join_url} target="_blank">
                  <Button size="sm" variant={status === 'live' ? 'default' : 'outline'} className="flex w-full items-center gap-2">
                     <ExternalLink className="h-4 w-4" />
                     {frontend.join_class}
                  </Button>
               </a>
            )
         ) : (
            <Button disabled variant="outline" size="sm" className="flex w-full items-center gap-2">
               <ExternalLink className="h-4 w-4" />
               {frontend.join_class}
            </Button>
         )}
      </>
   );
};

export default LiveClassStatus;
