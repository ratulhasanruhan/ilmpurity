import Tabs from '@/components/tabs';
import { TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DashboardLayout from '@/layouts/dashboard/layout';
import { SharedData } from '@/types/global';
import { router } from '@inertiajs/react';
import { BookText, CircleDollarSign, FilePenLine, FileText, FlaskConical, FolderInput, Settings, TvMinimalPlay } from 'lucide-react';
import { nanoid } from 'nanoid';
import { ReactNode } from 'react';
import Assignment from './partials/assignment';
import Basic from './partials/basic';
import CourseUpdateHeader from './partials/course-update-header';
import Curriculum from './partials/curriculum';
import Info from './partials/info';
import LiveClass from './partials/live-class';
import Media from './partials/media';
import Pricing from './partials/pricing';
import SEO from './partials/seo';
import Submissions from './partials/submissions';

export interface CourseUpdateProps extends SharedData {
   tab?: string;
   assignment?: string;
   course: Course;
   prices: string[];
   lastSectionSort: number;
   lastLessonSort: number;
   statuses: string[];
   labels: string[];
   expiries: string[];
   categories: CourseCategory[];
   submissions: Pagination<AssignmentSubmission>;
   watchHistory: WatchHistory | null;
   approvalStatus: CourseApprovalValidation;
   zoomConfig: ZoomConfigFields;
   assignments: CourseAssignment[];
   instructors: Instructor[] | null;
}

const Update = (props: CourseUpdateProps) => {
   const { tab, assignment, course, translate } = props;
   const { button } = translate;

   const tabs = [
      {
         id: nanoid(),
         name: button.curriculum,
         slug: 'curriculum',
         Icon: FilePenLine,
         Component: Curriculum,
      },
      {
         id: nanoid(),
         name: button.live_class,
         slug: 'live-class',
         Icon: TvMinimalPlay,
         Component: LiveClass,
      },
      {
         id: nanoid(),
         name: 'Assignment',
         slug: 'assignment',
         Icon: FileText,
         Component: assignment ? Submissions : Assignment,
      },
      {
         id: nanoid(),
         name: button.basic,
         slug: 'basic',
         Icon: Settings,
         Component: Basic,
      },
      {
         id: nanoid(),
         name: button.pricing,
         slug: 'pricing',
         Icon: CircleDollarSign,
         Component: Pricing,
      },
      {
         id: nanoid(),
         name: button.info,
         slug: 'info',
         Icon: BookText,
         Component: Info,
      },
      {
         id: nanoid(),
         name: button.media,
         slug: 'media',
         Icon: FolderInput,
         Component: Media,
      },
      {
         id: nanoid(),
         name: button.seo,
         slug: 'seo',
         Icon: FlaskConical,
         Component: SEO,
      },
   ];

   return (
      <section className="space-y-8">
         <CourseUpdateHeader />

         <Tabs value={tab ?? tabs[0].slug} className="grid grid-rows-1 gap-5 md:grid-cols-4">
            <div className="col-span-full md:col-span-1">
               <TabsList className="horizontal-tabs-list space-y-1">
                  {tabs.map(({ id, name, slug, Icon }) => (
                     <TabsTrigger
                        key={id}
                        value={slug}
                        className="horizontal-tabs-trigger"
                        onClick={() =>
                           router.get(
                              route('courses.edit', {
                                 course: course.id,
                                 tab: slug,
                              }),
                           )
                        }
                     >
                        <Icon className="h-4 w-4" />
                        <span>{name}</span>
                     </TabsTrigger>
                  ))}
               </TabsList>
            </div>

            <div className="col-span-full md:col-span-3">
               {tabs.map(({ id, slug, Component }) => (
                  <TabsContent key={id} value={slug} className="m-0">
                     <Component />
                  </TabsContent>
               ))}
            </div>
         </Tabs>
      </section>
   );
};

Update.layout = (page: ReactNode) => <DashboardLayout children={page} />;

export default Update;
