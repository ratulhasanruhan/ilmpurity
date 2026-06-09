import Tabs from '@/components/tabs';
import { Separator } from '@/components/ui/separator';
import { TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import LandingLayout from '@/layouts/landing-layout';
import { systemCurrency } from '@/lib/utils';
import { ExamPreviewProps } from '@/types/page';
import { Head, Link } from '@inertiajs/react';
import { ReactNode } from 'react';
import Details from './partials/details';
import ExamHeader from './partials/exam-header';
import CoursePreview from './partials/exam-preview';
import Instructor from './partials/instructor';
import Overview from './partials/overview';
import CourseReviews from './partials/reviews';

const Show = ({ tab, exam, system, translate }: ExamPreviewProps) => {
   const { button } = translate;

   const tabs = [
      {
         value: 'overview',
         label: button.overview,
         Component: <Overview />,
      },
      {
         value: 'details',
         label: button.details,
         Component: <Details />,
      },
      {
         value: 'instructor',
         label: button.instructor,
         Component: <Instructor />,
      },
      {
         value: 'reviews',
         label: button.reviews,
         Component: <CourseReviews />,
      },
   ];

   // Generate meta information for the exam
   const pageTitle = exam.meta_title || `${exam.title} | ${system.fields?.name}`;
   const pageDescription = exam.meta_description || exam.short_description || exam.description || 'Professional certification exam';
   const pageKeywords = exam.meta_keywords || `${exam.title}, certification exam, professional test, ${system.fields?.keywords || 'LMS'}`;
   const ogTitle = exam.og_title || exam.title;
   const ogDescription = exam.og_description || pageDescription;
   const examImage = exam.thumbnail || exam.banner || '';
   const siteName = system.fields?.name;
   const siteUrl = typeof window !== 'undefined' ? window.location.href : '';

   const currency = systemCurrency(system.fields['selling_currency']);

   return (
      <>
         <Head>
            <title>{pageTitle}</title>
            <meta name="description" content={pageDescription} />
            <meta name="keywords" content={pageKeywords} />
            <meta name="author" content={system.fields?.author || 'UiLib'} />

            {/* Open Graph Tags */}
            <meta property="og:type" content="article" />
            <meta property="og:url" content={siteUrl} />
            <meta property="og:title" content={ogTitle} />
            <meta property="og:description" content={ogDescription} />
            <meta property="og:site_name" content={siteName} />

            {/* Open Graph Image */}
            <meta property="og:image" content={examImage} />
            <meta property="og:image:width" content="1200" />
            <meta property="og:image:height" content="630" />
            <meta property="og:image:alt" content={exam.title} />

            {/* Twitter Card Tags */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={ogTitle} />
            <meta name="twitter:description" content={ogDescription} />
            {examImage && <meta name="twitter:image" content={examImage} />}

            {/* Exam-specific meta */}
            <meta name="exam:title" content={exam.title} />
            <meta name="exam:level" content={exam.level || ''} />
            <meta name="exam:price" content={exam.price?.toString() || '0'} />
            <meta name="exam:pricing_type" content={exam.pricing_type} />
            {exam.instructor && <meta name="exam:instructor" content={exam.instructor.user?.name || ''} />}

            {/* Schema.org structured data */}
            <script type="application/ld+json">
               {JSON.stringify({
                  '@context': 'https://schema.org',
                  '@type': 'ExaminationTest',
                  name: exam.title,
                  description: pageDescription,
                  image: examImage,
                  provider: {
                     '@type': 'Organization',
                     name: siteName,
                     url: typeof window !== 'undefined' ? window.location.origin : '',
                  },
                  instructor: exam.instructor
                     ? {
                          '@type': 'Person',
                          name: exam.instructor.user?.name || '',
                       }
                     : undefined,
                  educationalLevel: exam.level,
                  offers:
                     exam.pricing_type === 'paid'
                        ? {
                             '@type': 'Offer',
                             price: exam.price || 0,
                             priceCurrency: 'USD',
                             availability: 'https://schema.org/InStock',
                          }
                        : {
                             '@type': 'Offer',
                             price: 0,
                             priceCurrency: 'USD',
                             availability: 'https://schema.org/InStock',
                          },
                  aggregateRating: {
                     '@type': 'AggregateRating',
                     ratingValue: exam.average_rating,
                  },
               })}
            </script>
         </Head>

         <div className="container grid grid-cols-1 gap-7 py-10 md:grid-cols-3">
            <div className="space-y-8 md:col-span-2">
               <ExamHeader />

               <Tabs value={tab} className="bg-card overflow-hidden rounded-md border shadow">
                  <div className="overflow-x-auto overflow-y-hidden">
                     <TabsList className="vertical-tabs-list">
                        {tabs.map(({ label, value }) => (
                           <Link key={value} href={route('exams.details', { slug: exam.slug, id: exam.id, tab: value })}>
                              <TabsTrigger key={value} value={value} className="vertical-tabs-trigger">
                                 <span>{label}</span>
                              </TabsTrigger>
                           </Link>
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
