import { IntroPageProps } from '@/types/page';
import { Head } from '@inertiajs/react';
import Blogs from './partials/home-5/blogs';
import CallToAction from './partials/home-5/call-to-action';
import FAQs from './partials/home-5/faqs';
import Hero from './partials/home-5/hero';
import Instructor from './partials/home-5/instructor';
import Statistics from './partials/home-5/statistics';
import Testimonials from './partials/home-5/testimonials';
import TopCategories from './partials/home-5/top-categories';
import TopCourse from './partials/home-5/top-course';
import TopCourses from './partials/home-5/top-courses';
import Layout from './partials/layout';

const Home3 = ({ page, system }: IntroPageProps) => {
   const { sections } = page;
   const components: any[] = [];

   sections
      .filter((section) => section.active)
      .map((section) => {
         switch (section.slug) {
            case 'hero':
               components.push(Hero);
               break;
            case 'statistics':
               components.push(Statistics);
               break;
            case 'top_categories':
               components.push(TopCategories);
               break;
            case 'top_course':
               components.push(TopCourse);
               break;
            case 'top_courses':
               components.push(TopCourses);
               break;
            case 'instructor':
               components.push(Instructor);
               break;
            case 'faqs':
               components.push(FAQs);
               break;
            case 'testimonials':
               components.push(Testimonials);
               break;
            case 'call_to_action':
               components.push(CallToAction);
               break;
            case 'blogs':
               components.push(Blogs);
               break;
            default:
               break;
         }
      });

   return (
      <Layout>
         <Head title={system.fields.name} />

         {components.map((Component, index) => (
            <Component key={`home-3-${index}`} />
         ))}
      </Layout>
   );
};

export default Home3;
