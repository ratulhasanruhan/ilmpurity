import { IntroPageProps } from '@/types/page';
import { Head } from '@inertiajs/react';
import Blogs from './partials/home-2/blogs';
import CallToAction from './partials/home-2/call-to-action';
import Hero from './partials/home-2/hero';
import NewCourses from './partials/home-2/new-courses';
import Overview from './partials/home-2/overview';
import Partners from './partials/home-2/partners';
import Testimonials from './partials/home-2/testimonials';
import TopCategories from './partials/home-2/top-categories';
import TopCourses from './partials/home-2/top-courses';
import TopInstructors from './partials/home-2/top-instructors';
import Layout from './partials/layout';

const Home1 = ({ system, page }: IntroPageProps) => {
   const { sections } = page;
   const components: any[] = [];

   sections
      .filter((section) => section.active)
      .map((section) => {
         switch (section.slug) {
            case 'hero':
               components.push(Hero);
               break;
            case 'top_categories':
               components.push(TopCategories);
               break;
            case 'overview':
               components.push(Overview);
               break;
            case 'top_courses':
               components.push(TopCourses);
               break;
            case 'new_courses':
               components.push(NewCourses);
               break;
            case 'top_instructors':
               components.push(TopInstructors);
               break;
            case 'testimonials':
               components.push(Testimonials);
               break;
            case 'partners':
               components.push(Partners);
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
            <Component key={`home-1-${index}`} />
         ))}
      </Layout>
   );
};

export default Home1;
