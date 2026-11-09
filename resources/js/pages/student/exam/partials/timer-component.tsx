import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { AlertTriangle, Clock } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

interface Props {
   endTime: string;
   onTimeUp?: () => void;
   attempt: ExamAttempt;
   questionIndex: number;
}

const TimerComponent = ({ endTime, onTimeUp, attempt, questionIndex }: Props) => {
   const [timeLeft, setTimeLeft] = useState<number>(0);
   const [isWarning, setIsWarning] = useState(false);
   const onTimeUpRef = useRef(onTimeUp);
   const submittedRef = useRef(false);

   useEffect(() => {
      onTimeUpRef.current = onTimeUp;
   }, [onTimeUp]);

   useEffect(() => {
      const calculateTimeLeft = () => {
         if (!endTime) {
            return 0;
         }
         const end = new Date(endTime).getTime();
         if (Number.isNaN(end)) {
            return 0;
         }
         const now = new Date().getTime();
         const difference = end - now;
         return Math.max(0, Math.floor(difference / 1000));
      };

      setTimeLeft(calculateTimeLeft());

      const interval = setInterval(() => {
         const remaining = calculateTimeLeft();
         setTimeLeft(remaining);

         // Warning at 5 minutes
         if (remaining <= 300 && remaining > 0) {
            setIsWarning(true);
         }

         if (remaining === 0 && !submittedRef.current) {
            submittedRef.current = true;
            clearInterval(interval);
            onTimeUpRef.current?.();
         }
      }, 1000);

      return () => clearInterval(interval);
   }, [endTime]);

   const formatTime = (seconds: number) => {
      const hours = Math.floor(seconds / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);
      const secs = seconds % 60;

      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
   };

   return (
      <Card className={`${isWarning ? 'border-destructive' : ''}`}>
         <CardContent className="p-4">
            <div className="flex items-center justify-between">
               <h6 className="flex items-center gap-2">
                  {isWarning ? <AlertTriangle className="text-destructive h-5 w-5" /> : <Clock className="h-5 w-5 text-gray-600" />}
                  <span className="font-semibold text-gray-700">Time Remaining</span>
               </h6>

               <Badge variant={isWarning ? 'destructive' : 'secondary'} className="font-mono text-lg">
                  {formatTime(timeLeft)}
               </Badge>
            </div>
            <p className="pl-7 text-sm text-gray-600">
               Question {questionIndex + 1} of {attempt.exam.questions.length}
            </p>

            {isWarning && (
               <p className="text-destructive mt-2 text-sm">Less than 5 minutes remaining! The exam will auto-submit when time runs out.</p>
            )}
         </CardContent>
      </Card>
   );
};

export default TimerComponent;
