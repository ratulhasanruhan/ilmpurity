import { IntroPageProps } from '@/types/page';
import { Head } from '@inertiajs/react';
import Blogs from './partials/home-1/blogs';
import CallToAction from './partials/home-1/call-to-action';
import FAQs from './partials/home-1/faqs';
import Hero from './partials/home-1/hero';
import NewCourses from './partials/home-1/new-courses';
import Overview from './partials/home-1/overview';
import Partners from './partials/home-1/partners';
import TopCategories from './partials/home-1/top-categories';
import TopCourses from './partials/home-1/top-courses';
import TopInstructors from './partials/home-1/top-instructors';
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
            case 'partners':
               components.push(Partners);
               break;
            case 'top_categories':
               components.push(TopCategories);
               break;
            case 'top_courses':
               components.push(TopCourses);
               break;
            case 'overview':
               components.push(Overview);
               break;
            case 'new_courses':
               components.push(NewCourses);
               break;
            case 'top_instructors':
               components.push(TopInstructors);
               break;
            case 'faqs':
               components.push(FAQs);
               break;
            case 'blogs':
               components.push(Blogs);
               break;
            case 'call_to_action':
               components.push(CallToAction);
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
