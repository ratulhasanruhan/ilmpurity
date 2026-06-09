import CourseCard1 from '@/components/cards/course-card-1';
import TableFooter from '@/components/table/table-footer';
import { getQueryParams } from '@/lib/route';
import { cn } from '@/lib/utils';
import { SharedData } from '@/types/global';
import { Head, usePage } from '@inertiajs/react';
import { ReactNode } from 'react';
import Layout from './layout';

export interface CoursesIndexProps extends SharedData {
   levels: string[];
   prices: string[];
   expiries: string[];
   category?: CourseCategory;
   categoryChild?: CourseCategoryChild;
   courses: Pagination<Course>;
   categories: CourseCategory[];
   wishlists: CourseWishlist[];
}

const Index = (props: CoursesIndexProps) => {
   const { url } = usePage();
   const { courses, wishlists, category, categoryChild, system, translate } = props;
   const { frontend } = translate;
   const urlParams = getQueryParams(url);

   // Generate meta information based on category
   const siteName = system?.fields?.name || 'Appibrium';
   const totalCourses = courses?.total || 0;
   const siteUrl = url;
   const siteOrigin = typeof window !== 'undefined' ? window.location.origin : url.split('/').slice(0, 3).join('/');

   let pageTitle = category ? category.title : 'All';
   let pageDescription = `Browse ${totalCourses}+ online courses from expert instructors. Learn new skills with our comprehensive course catalog.`;
   let pageKeywords = 'online courses, learning platform, education, skills, training, e-learning';
   let ogTitle = frontend.all_courses;

   if (category && categoryChild) {
      pageTitle = `${categoryChild.title} Courses in ${category.title}`;
      ogTitle = `${categoryChild.title} - ${category.title} Courses`;
      pageDescription = `Learn ${categoryChild.title.toLowerCase()} with ${totalCourses} specialized courses in ${category.title.toLowerCase()}. Expert instructors, practical projects, and industry-relevant curriculum.`;
      pageKeywords = `${categoryChild.title.toLowerCase()}, ${category.title.toLowerCase()}, courses, training, ${categoryChild.title} certification, ${category.title} skills`;
   } else if (category) {
      pageTitle = `${category.title} Courses`;
      ogTitle = `${category.title} Courses`;
      pageDescription = `Explore ${totalCourses} ${category.title.toLowerCase()} courses taught by industry experts. Master ${category.title.toLowerCase()} skills with hands-on projects and comprehensive curriculum.`;
      pageKeywords = `${category.title.toLowerCase()}, courses, training, online learning, ${category.title} certification, ${category.title} skills`;
   }

   const fullTitle = `${pageTitle} | ${siteName}`;
   const courseImage = courses?.data?.[0]?.thumbnail;
   const categoryImage = category?.thumbnail || courseImage;

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
            <meta property="og:image:alt" content={`${pageTitle} - Course Catalog`} />

            {/* Twitter Card Tags */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={ogTitle} />
            <meta name="twitter:description" content={pageDescription} />
            <meta name="twitter:image" content={categoryImage} />

            {/* Category-specific meta */}
            {category && <meta name="category:name" content={category.title} />}
            {category && <meta name="category:slug" content={category.slug} />}
            {categoryChild && <meta name="category:child" content={categoryChild.title} />}
            <meta name="courses:total" content={totalCourses.toString()} />
            <meta name="courses:page" content={(courses?.current_page || 1).toString()} />

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
                     numberOfItems: totalCourses,
                     itemListElement:
                        courses?.data
                           ?.slice(0, 10)
                           .map((course, index) => ({
                              '@type': 'Course',
                              position: index + 1,
                              name: course.title,
                              description: course.short_description || course.description || '',
                              image: course.thumbnail || course.banner || '',
                              provider: {
                                 '@type': 'Organization',
                                 name: siteName,
                              },
                              instructor: course.instructor?.user?.name
                                 ? {
                                      '@type': 'Person',
                                      name: course.instructor.user.name,
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
                           }))
                           .filter(Boolean) || [],
                  },
                  ...(category && {
                     about: {
                        '@type': 'Thing',
                        name: category.title,
                        description: `Learn ${category.title.toLowerCase()} with comprehensive online courses`,
                     },
                  }),
                  ...(categoryChild && {
                     specialty: {
                        '@type': 'Thing',
                        name: categoryChild.title,
                        description: `Specialized ${categoryChild.title.toLowerCase()} courses and training`,
                     },
                  }),
               })}
            </script>
         </Head>

         <div
            className={cn(urlParams['view'] && urlParams['view'] === 'list' ? 'space-y-7' : 'grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3')}
         >
            {courses.data.map((course) => (
               <CourseCard1 key={course.id} course={course} wishlists={wishlists} viewType={urlParams['view'] as 'grid' | 'list'} />
            ))}
         </div>

         <TableFooter
            className="mt-6 p-5 sm:p-7"
            routeName="category.courses"
            paginationInfo={courses}
            routeParams={{
               category: category ? category.slug : 'all',
               category_child: categoryChild ? categoryChild.slug : '',
            }}
         />
      </>
   );
};

Index.layout = (page: ReactNode) => <Layout children={page} />;

export default Index;
