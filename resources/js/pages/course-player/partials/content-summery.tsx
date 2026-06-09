import StudentFeedback from '@/components/student-feedback';
import Tabs from '@/components/tabs';
import TiptapRenderer from '@/components/text-editor/tiptap-renderer/client-renderer';
import { Separator } from '@/components/ui/separator';
import { TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CoursePlayerProps } from '@/types/page';
import { usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import ReviewForm from '../forms/review';
import Forum from './forum';
import Resource from './resource';

const ContentSummery = () => {
   const { props } = usePage<CoursePlayerProps>();
   const { translate, type } = props;
   const { button } = translate;
   const [isResource, setIsResource] = useState(false);

   useEffect(() => {
      if (type === 'lesson') {
         const watching = props.watching as SectionLesson;

         if (watching.resources.length > 0) {
            setIsResource(true);
         }
      }
   }, [props.watching]);

   const tabs = [
      {
         value: 'summery',
         label: button.summery,
      },
      {
         value: 'resource',
         label: 'Resource',
      },
      {
         value: 'forum',
         label: button.forum,
      },
      {
         value: 'review',
         label: button.review,
      },
   ];

   return (
      <Tabs defaultValue="summery" className="mx-auto grid w-full max-w-5xl overflow-hidden rounded-md pt-1 pb-10">
         <div className="overflow-x-auto overflow-y-hidden">
            <TabsList className="bg-transparent px-0 py-6">
               {tabs.map(({ label, value }) => {
                  if (value === 'resource' && !isResource) {
                     return null;
                  }

                  return (
                     <TabsTrigger
                        key={value}
                        value={value}
                        className="border-primary data-[state=active]:!bg-muted data-[state=active]:before:bg-primary relative flex cursor-pointer items-center justify-start gap-3 rounded-none bg-transparent px-8 py-4 text-start !shadow-none before:absolute before:right-0 before:bottom-0 before:left-0 before:h-1 before:rounded-t-xl data-[state=active]:before:content-['.']"
                     >
                        <span>{label}</span>
                     </TabsTrigger>
                  );
               })}
            </TabsList>
         </div>

         <Separator className="mt-[1px]" />

         <TabsContent value="summery" className="m-0 p-5">
            <TiptapRenderer>{props.watching.summary as any}</TiptapRenderer>
         </TabsContent>
         {isResource && (
            <TabsContent value="resource" className="m-0 p-5">
               <Resource />
            </TabsContent>
         )}
         <TabsContent value="forum" className="m-0 p-5">
            <Forum />
         </TabsContent>
         <TabsContent value="review" className="m-0 space-y-6 p-5">
            <StudentFeedback totalReviews={props.totalReviews} />
            <ReviewForm />
         </TabsContent>
      </Tabs>
   );
};

export default ContentSummery;
