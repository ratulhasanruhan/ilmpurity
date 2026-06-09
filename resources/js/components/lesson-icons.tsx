import { Circle, CircleCheck, File, FileText, Image, Lock, Video } from 'lucide-react';

type Props =
   | {
        type: 'active' | 'inactive';
        dripContent: false;
        lesson: SectionLesson;
        isCompleted: boolean;
        isCurrentLesson: boolean;
        isNext: boolean;
     }
   | {
        type: 'active' | 'inactive';
        dripContent: true;
        lesson: SectionLesson;
        isCompleted: boolean;
        isCurrentLesson?: boolean;
        isNext?: boolean;
     };

const LessonIcons = (props: Props) => {
   const { type, lesson, dripContent, isCompleted, isCurrentLesson, isNext } = props;

   return (
      <div className="flex items-center gap-2">
         {type === 'active' ? (
            <>
               {isCompleted ? (
                  <CircleCheck className="h-4 w-4" />
               ) : dripContent ? (
                  <>{!isCurrentLesson ? <Circle className="h-4 w-4" /> : isNext ? <Circle className="h-4 w-4" /> : <Lock className="h-4 w-4" />}</>
               ) : (
                  <Lock className="h-4 w-4" />
               )}
            </>
         ) : (
            <Lock className="h-4 w-4" />
         )}

         <div className="bg-secondary flex h-6 w-6 items-center justify-center rounded-full">
            {['video', 'video_url', 'embed'].includes(lesson.lesson_type) && <Video className="h-4 w-4" />}

            {['document', 'iframe'].includes(lesson.lesson_type) && <File className="h-4 w-4" />}

            {lesson.lesson_type === 'text' && <FileText className="h-4 w-4" />}

            {lesson.lesson_type === 'image' && <Image className="h-4 w-4" />}
         </div>
      </div>
   );
};

export default LessonIcons;
