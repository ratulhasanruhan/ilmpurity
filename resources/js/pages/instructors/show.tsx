import CourseCard1 from '@/components/cards/course-card-1';
import RatingStars from '@/components/rating-stars';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import LandingLayout from '@/layouts/landing-layout';
import { getQueryParams } from '@/lib/route';
import { SharedData } from '@/types/global';
import { Head, router, usePage } from '@inertiajs/react';
import { Book, Grid, List, Star, Users } from 'lucide-react';
import { ReactNode } from 'react';

interface InstructorPageProps extends SharedData {
   instructor: Instructor;
}

const Show = ({ instructor, system, translate }: InstructorPageProps & { translate: any }) => {
   const { url } = usePage();
   const urlParams = getQueryParams(url);
   const viewType = urlParams['view'] ?? 'grid';
   const { frontend } = translate;
   const { id, user, courses, total_reviews_count, total_average_rating, total_enrollments_count } = instructor;

   // Generate meta information for the instructor
   const pageTitle = `${user.name} - ${frontend.expert_instructor} | ${system.fields?.name}`;
   const pageDescription = `${frontend.learn_from} ${user.name}, ${frontend.expert_instructor_with} ${courses.length} ${frontend.courses_and} ${total_enrollments_count} ${frontend.students}. ${frontend.average_rating}: ${total_average_rating ? Number(total_average_rating).toFixed(1) : frontend.new} ${frontend.stars}.`;
   const pageKeywords = `${user.name}, instructor, online courses, ${system.fields?.keywords || frontend.instructor_fallback_keywords}, teacher, expert`;
   const instructorImage = user.photo || '';
   const siteName = system.fields?.name;
   const siteUrl = url;
   const siteOrigin = typeof window !== 'undefined' ? window.location.origin : url.split('/').slice(0, 3).join('/');
   const rating = total_average_rating ? Number(total_average_rating).toFixed(1) : null;

   return (
      <div className="container space-y-10 py-10 md:py-16">
         <Head>
            <title>{pageTitle}</title>
            <meta name="description" content={pageDescription} />
            <meta name="keywords" content={pageKeywords} />
            <meta name="author" content={system.fields?.author || frontend.default_author} />

            {/* Open Graph Tags */}
            <meta property="og:type" content="profile" />
            <meta property="og:url" content={siteUrl} />
            <meta property="og:title" content={`${user.name} - ${frontend.expert_instructor}`} />
            <meta property="og:description" content={pageDescription} />
            <meta property="og:site_name" content={siteName} />

            <meta property="og:image" content={instructorImage} />
            <meta property="og:image:width" content="400" />
            <meta property="og:image:height" content="400" />
            <meta property="og:image:alt" content={`${user.name} - ${frontend.instructor_profile}`} />

            {/* Profile specific Open Graph */}
            <meta property="profile:first_name" content={user.name.split(' ')[0]} />
            {user.name.split(' ').length > 1 && <meta property="profile:last_name" content={user.name.split(' ').slice(1).join(' ')} />}

            {/* Twitter Card Tags */}
            <meta name="twitter:card" content="summary" />
            <meta name="twitter:title" content={`${user.name} - ${frontend.expert_instructor}`} />
            <meta name="twitter:description" content={pageDescription} />
            {instructorImage && <meta name="twitter:image" content={instructorImage} />}

            {/* Instructor-specific meta */}
            <meta name="instructor:name" content={user.name} />
            <meta name="instructor:email" content={user.email} />
            <meta name="instructor:courses_count" content={courses.length.toString()} />
            <meta name="instructor:students_count" content={total_enrollments_count.toString()} />
            <meta name="instructor:reviews_count" content={total_reviews_count.toString()} />
            {rating && <meta name="instructor:rating" content={rating} />}

            {/* Schema.org structured data */}
            <script type="application/ld+json">
               {JSON.stringify({
                  '@context': 'https://schema.org',
                  '@type': 'Person',
                  name: user.name,
                  email: user.email,
                  ...(instructorImage && { image: instructorImage }),
                  jobTitle: frontend.online_course_instructor,
                  description: pageDescription,
                  url: siteUrl,
                  worksFor: {
                     '@type': 'Organization',
                     name: siteName,
                     url: siteOrigin,
                  },
                  knowsAbout: courses.map((course) => course.title).filter(Boolean),
                  ...(rating && {
                     aggregateRating: {
                        '@type': 'AggregateRating',
                        ratingValue: rating,
                        reviewCount: total_reviews_count,
                        bestRating: 5,
                        worstRating: 1,
                     },
                  }),
                  hasCredential: courses
                     .map((course) => ({
                        '@type': 'EducationalOccupationalCredential',
                        name: `Instructor of ${course.title}`,
                        ...(course.short_description && { description: course.short_description }),
                     }))
                     .filter((credential) => credential.name),
               })}
            </script>
         </Head>

         {/* Instructor Profile Card */}
         <div>
            <div className="flex items-center gap-4">
               <Avatar className="h-12 w-12">
                  <AvatarImage src={user.photo || ''} alt={user.name} className="object-cover" />
                  <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
               </Avatar>

               <div className="group">
                  <h3 className="text-xl font-semibold">{user.name}</h3>
                  <p className="text-gray-500">{user.email}</p>
               </div>

               <div className="ml-auto flex items-center gap-1">
                  <span className="text-xl font-semibold">{total_average_rating ? Number(total_average_rating).toFixed(1) : 0}</span>
                  <RatingStars rating={total_average_rating || 0} starClass="h-4 w-4" />
               </div>
            </div>

            <div className="mt-6 flex gap-8">
               <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-gray-500" />
                  <span>
                     {total_enrollments_count} {frontend.students}
                  </span>
               </div>
               <div className="flex items-center gap-2">
                  <Book className="h-5 w-5 text-gray-500" />
                  <span>
                     {courses.length} {frontend.courses}
                  </span>
               </div>
               <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-gray-500" />
                  <span>
                     {total_reviews_count} {frontend.reviews}
                  </span>
               </div>
            </div>
         </div>

         {/* Course List Header */}
         <div className="mb-4 flex items-center justify-between">
            <h2 className="text-2xl font-bold">{frontend.all_courses}</h2>
            <div className="flex items-center space-x-2">
               <TooltipProvider delayDuration={0}>
                  <Tooltip>
                     <TooltipTrigger asChild>
                        <Button
                           size="icon"
                           variant={viewType === 'grid' ? 'default' : 'outline'}
                           onClick={() => router.get(route('instructors.show', { instructor: id, view: 'grid' }))}
                        >
                           <Grid className="h-4 w-4" />
                        </Button>
                     </TooltipTrigger>
                     <TooltipContent>
                        <p>{frontend.grid_view}</p>
                     </TooltipContent>
                  </Tooltip>
               </TooltipProvider>

               <TooltipProvider delayDuration={0}>
                  <Tooltip>
                     <TooltipTrigger asChild>
                        <Button
                           size="icon"
                           variant={viewType === 'list' ? 'default' : 'outline'}
                           onClick={() => router.get(route('instructors.show', { instructor: id, view: 'list' }))}
                        >
                           <List className="h-4 w-4" />
                        </Button>
                     </TooltipTrigger>
                     <TooltipContent>
                        <p>{frontend.list_view}</p>
                     </TooltipContent>
                  </Tooltip>
               </TooltipProvider>
            </div>
         </div>

         <div className={viewType === 'grid' ? 'grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3' : 'space-y-7'}>
            {courses.map((course) => (
               <CourseCard1 key={course.id} course={course} viewType={viewType as 'grid' | 'list'} />
            ))}
         </div>
      </div>
   );
};

Show.layout = (page: ReactNode) => <LandingLayout children={page} customizable={false} />;

export default Show;
