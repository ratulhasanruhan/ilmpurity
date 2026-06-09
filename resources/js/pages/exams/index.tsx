import ExamCard from '@/components/exam/exam-card-1';
import TableFooter from '@/components/table/table-footer';
import { getQueryParams } from '@/lib/route';
import { cn } from '@/lib/utils';
import { SharedData } from '@/types/global';
import { Head, usePage } from '@inertiajs/react';
import { ReactNode } from 'react';
import Layout from './layout';

export interface ExamsIndexProps extends SharedData {
   levels: string[];
   prices: string[];
   category?: ExamCategory;
   categoryChild?: ExamCategoryChild;
   exams: Pagination<Exam>;
   categories: ExamCategory[];
}

const Index = (props: ExamsIndexProps) => {
   const { url } = usePage();
   const { exams, category, system } = props;
   const urlParams = getQueryParams(url);

   // Generate meta information based on category
   const siteName = system?.fields?.name || 'Appibrium';
   const totalExams = exams?.total || 0;
   const siteUrl = url;
   const siteOrigin = typeof window !== 'undefined' ? window.location.origin : url.split('/').slice(0, 3).join('/');

   let pageTitle = category ? category.title : 'All';
   let pageDescription = `Browse ${totalExams}+ professional certification exams from expert instructors. Test your skills with our comprehensive exam catalog.`;
   let pageKeywords = 'online exams, certification exams, professional tests, skills assessment, exam preparation';
   let ogTitle = 'All Exams';

   if (category && category.title) {
      pageTitle = `${category.title} Exams`;
      ogTitle = `${category.title} Exams`;
      pageDescription = `Explore ${totalExams} ${category.title.toLowerCase()} certification exams. Test your expertise in ${category.title.toLowerCase()} with industry-standard assessments.`;
      pageKeywords = `${category.title.toLowerCase()}, exams, certification, assessment, ${category.title} test, professional certification`;
   }

   const fullTitle = `${pageTitle} | ${siteName}`;
   const examImage = exams?.data?.[0]?.thumbnail;
   const categoryImage = category?.thumbnail || examImage;

   return (
      <>
         <Head>
            <title>{fullTitle}</title>
            <meta name="description" content={pageDescription} />
            <meta name="keywords" content={pageKeywords} />
            <meta name="author" content={system?.fields?.author || 'UiLib'} />

            {/* Open Graph Tags */}
            <meta property="og:type" content="website" />
            <meta property="og:url" content={siteUrl} />
            <meta property="og:title" content={ogTitle} />
            <meta property="og:description" content={pageDescription} />
            <meta property="og:site_name" content={siteName} />

            {/* Open Graph Image */}
            <meta property="og:image" content={categoryImage} />
            <meta property="og:image:width" content="1200" />
            <meta property="og:image:height" content="630" />
            <meta property="og:image:alt" content={`${pageTitle} - Exam Catalog`} />

            {/* Twitter Card Tags */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={ogTitle} />
            <meta name="twitter:description" content={pageDescription} />
            <meta name="twitter:image" content={categoryImage} />

            {/* Category-specific meta */}
            {category && <meta name="category:name" content={category.title} />}
            {category && <meta name="category:slug" content={category.slug} />}
            <meta name="exams:total" content={totalExams.toString()} />
            <meta name="exams:page" content={(exams?.current_page || 1).toString()} />

            {/* Schema.org structured data */}
            <script type="application/ld+json">
               {JSON.stringify({
                  '@context': 'https://schema.org',
                  '@type': 'CollectionPage',
                  name: pageTitle,
                  description: pageDescription,
                  url: siteUrl,
                  image: categoryImage,
                  provider: {
                     '@type': 'Organization',
                     name: siteName,
                     url: siteOrigin,
                  },
                  mainEntity: {
                     '@type': 'ItemList',
                     name: `${pageTitle} Collection`,
                     description: pageDescription,
                     numberOfItems: totalExams,
                     itemListElement:
                        exams?.data
                           ?.slice(0, 10)
                           .map((exam, index) => ({
                              '@type': 'ExaminationTest',
                              position: index + 1,
                              name: exam.title,
                              description: exam.short_description || exam.description || '',
                              image: exam.thumbnail || exam.banner || '',
                              provider: {
                                 '@type': 'Organization',
                                 name: siteName,
                              },
                              instructor: exam.instructor?.user?.name
                                 ? {
                                      '@type': 'Person',
                                      name: exam.instructor.user.name,
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
                           }))
                           .filter(Boolean) || [],
                  },
                  ...(category && {
                     about: {
                        '@type': 'Thing',
                        name: category.title,
                        description: `Professional ${category.title.toLowerCase()} certification exams`,
                     },
                  }),
               })}
            </script>
         </Head>

         <div
            className={cn(urlParams['view'] && urlParams['view'] === 'list' ? 'space-y-7' : 'grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3')}
         >
            {exams.data.map((exam) => (
               <ExamCard key={exam.id} exam={exam} viewType={urlParams['view'] as 'grid' | 'list'} />
            ))}
         </div>

         <TableFooter
            className="mt-6 p-5 sm:p-7"
            routeName="category.exams"
            paginationInfo={exams}
            routeParams={{
               category: category ? category.slug : 'all',
            }}
         />
      </>
   );
};

Index.layout = (page: ReactNode) => <Layout children={page} />;

export default Index;
