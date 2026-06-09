import Tabs from '@/components/tabs';
import { Separator } from '@/components/ui/separator';
import { TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import LandingLayout from '@/layouts/landing-layout';
import { SharedData } from '@/types/global';
import { Head } from '@inertiajs/react';
import { ReactNode } from 'react';
import CourseHeader from './partials/course-header';
import CoursePreview from './partials/course-preview';
import CourseReviews from './partials/course-reviews';
import Curriculum from './partials/curriculum';
import Details from './partials/details';
import Instructor from './partials/instructor';
import Overview from './partials/overview';

export interface CourseDetailsProps extends SharedData {
   course: Course;
   enrollment: CourseEnrollment;
   watchHistory: WatchHistory | null;
   approvalStatus: CourseApprovalValidation;
   wishlists: CourseWishlist[];
   reviews: Pagination<CourseReview>;
   totalReviews: CourseTotalReview;
}

const Show = ({ course, system, translate }: CourseDetailsProps & { translate: any }) => {
   const { button, frontend } = translate;

   const tabs = [
      {
         value: 'overview',
         label: button.overview,
         Component: <Overview course={course} />,
      },
      {
         value: 'curriculum',
         label: button.curriculum,
         Component: <Curriculum course={course} />,
      },
      {
         value: 'details',
         label: button.details,
         Component: <Details course={course} />,
      },
      {
         value: 'instructor',
         label: button.instructor,
         Component: <Instructor course={course} />,
      },
      {
         value: 'reviews',
         label: button.reviews,
         Component: <CourseReviews />,
      },
   ].filter((tab) => {
      if (tab.value === 'instructor') {
         return system.sub_type === 'collaborative' ? true : false;
      }

      return true;
   });

   // Generate meta information for the course
   const pageTitle = course.meta_title || `${course.title} | ${system.fields?.name}`;
   const pageDescription = course.meta_description || course.short_description || course.description || frontend.learn_comprehensive_course;
   const pageKeywords = course.meta_keywords || `${course.title}, ${frontend.online_course_learning_lms}, ${system.fields?.keywords || 'LMS'}`;
   const ogTitle = course.og_title || course.title;
   const ogDescription = course.og_description || pageDescription;
   const courseImage = course.thumbnail || '';
   const siteName = system.fields?.name;
   const siteUrl = window.location.href;

   return (
      <>
         <Head>
            <title>{pageTitle}</title>
            <meta name="description" content={pageDescription} />
            <meta name="keywords" content={pageKeywords} />
            <meta name="author" content={system.fields?.author || frontend.default_author} />

            {/* Open Graph Tags */}
            <meta property="og:type" content="article" />
            <meta property="og:url" content={siteUrl} />
            <meta property="og:title" content={ogTitle} />
            <meta property="og:description" content={ogDescription} />
            <meta property="og:site_name" content={siteName} />

            {/* Open Graph Image */}
            <meta property="og:image" content={courseImage} />
            <meta property="og:image:width" content="1200" />
            <meta property="og:image:height" content="630" />
            <meta property="og:image:alt" content={course.title} />

            {/* Twitter Card Tags */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={ogTitle} />
            <meta name="twitter:description" content={ogDescription} />
            {courseImage && <meta name="twitter:image" content={courseImage} />}

            {/* Course-specific meta */}
            <meta name="course:title" content={course.title} />
            <meta name="course:level" content={course.level} />
            <meta name="course:language" content={course.language} />
            <meta name="course:price" content={course.price?.toString() || '0'} />
            <meta name="course:pricing_type" content={course.pricing_type} />
            {course.instructor && <meta name="course:instructor" content={course.instructor.user?.name || ''} />}

            {/* Schema.org structured data */}
            <script type="application/ld+json">
               {JSON.stringify({
                  '@context': 'https://schema.org',
                  '@type': 'Course',
                  name: course.title,
                  description: pageDescription,
                  image: courseImage,
                  provider: {
                     '@type': 'Organization',
                     name: siteName,
                     url: window.location.origin,
                  },
                  instructor: course.instructor
                     ? {
                          '@type': 'Person',
                          name: course.instructor.user?.name || '',
                       }
                     : undefined,
                  courseCode: course.slug,
                  educationalLevel: course.level,
                  inLanguage: course.language,
                  offers:
                     course.pricing_type === 'paid'
                        ? {
                             '@type': 'Offer',
                             price: course.price || 0,
                             priceCurrency: 'USD',
                             availability: 'https://schema.org/InStock',
                          }
                        : {
                             '@type': 'Offer',
                             price: 0,
                             priceCurrency: 'USD',
                             availability: 'https://schema.org/InStock',
                          },
               })}
            </script>
         </Head>

         <div className="container grid grid-cols-1 gap-7 py-10 md:grid-cols-3">
            <div className="space-y-8 md:col-span-2">
               <CourseHeader course={course} />

               <Tabs defaultValue="overview" className="bg-card overflow-hidden rounded-md border shadow">
                  <div className="overflow-x-auto overflow-y-hidden">
                     <TabsList className="vertical-tabs-list">
                        {tabs.map(({ label, value }) => (
                           <TabsTrigger key={value} value={value} className="vertical-tabs-trigger">
                              <span>{label}</span>
                           </TabsTrigger>
                        ))}
                     </TabsList>
                  </div>

                  <Separator className="mt-[1px]" />

                  {tabs.map(({ value, Component }) => (
                     <TabsContent key={value} value={value} className="m-0 p-5">
                        {Component}
                     </TabsContent>
                  ))}
               </Tabs>
            </div>

            <div>
               <CoursePreview />
            </div>
         </div>
      </>
   );
};

Show.layout = (page: ReactNode) => <LandingLayout children={page} customizable={false} />;

export default Show;
