import TiptapRenderer from '@/components/text-editor/tiptap-renderer/client-renderer';
import { Card } from '@/components/ui/card';
import VideoPlayer from '@/components/video-player';
import { cn } from '@/lib/utils';
import { CoursePlayerProps } from '@/types/page';
import { usePage } from '@inertiajs/react';
import DocumentViewer from './document-viewer';
import EmbedViewer from './embed-viewer';
import LessonControl from './lesson-control';

interface LessonViewerProps {
   lesson: SectionLesson;
}

const LessonViewer = ({ lesson }: LessonViewerProps) => {
   const { props } = usePage<CoursePlayerProps>();
   const { translate } = props;
   const { frontend } = translate;
   return lesson ? (
      <Card className={cn('group lesson-container relative')}>
         <LessonControl className="opacity-0 transition-all duration-300 group-hover:opacity-100" />

         {['video_url', 'video'].includes(lesson.lesson_type) && (
            <VideoPlayer
               source={{
                  type: 'video' as const,
                  sources: [
                     {
                        src: lesson.lesson_src || '',
                        type: 'video/mp4' as const,
                     },
                  ],
               }}
            />
         )}

         {lesson.lesson_type === 'document' && <DocumentViewer src={lesson.lesson_src || ''} />}

         {lesson.lesson_type === 'embed' && <EmbedViewer src={lesson.lesson_src || ''} />}

         {lesson.lesson_type === 'text' && (
            <div className="h-full w-full overflow-y-auto">
               <TiptapRenderer>{lesson.lesson_src || ''}</TiptapRenderer>
            </div>
         )}

         {lesson.lesson_type === 'image' && (
            <div className="flex h-full w-full items-center justify-center overflow-y-auto">
               <img className="h-full max-h-[calc(100vh-60px)] min-h-[80vh]" src={lesson.lesson_src} />
            </div>
         )}
      </Card>
   ) : (
      <Card className="min-h-[60vh] w-full overflow-hidden rounded-lg">
         <div className="flex h-full items-center justify-center">
            <p>{frontend.no_lesson_found}</p>
         </div>
      </Card>
   );
};

export default LessonViewer;
