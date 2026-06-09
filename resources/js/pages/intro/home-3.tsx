import { IntroPageProps } from '@/types/page';
import { Head } from '@inertiajs/react';
import Blogs from './partials/home-3/blogs';
import CallToAction from './partials/home-3/call-to-action';
import CategoryCourses from './partials/home-3/category-courses';
import Features from './partials/home-3/features';
import Hero from './partials/home-3/hero';
import NewCourses from './partials/home-3/new-courses';
import Overview from './partials/home-3/overview';
import Testimonials from './partials/home-3/testimonials';
import TopCategories from './partials/home-3/top-categories';
import TopInstructors from './partials/home-3/top-instructors';
import Layout from './partials/layout';

const Home2 = ({ page, system }: IntroPageProps) => {
   const { sections } = page;
   const components: any[] = [];

   sections
      .filter((section) => section.active)
      .map((section) => {
         switch (section.slug) {
            case 'hero':
               components.push(Hero);
               break;
            case 'overview':
               components.push(Overview);
               break;
            case 'category_courses':
               components.push(CategoryCourses);
               break;
            case 'top_instructors':
               components.push(TopInstructors);
               break;
            case 'features':
               components.push(Features);
               break;
            case 'top_categories':
               components.push(TopCategories);
               break;
            case 'new_courses':
               components.push(NewCourses);
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
            <Component key={`home-2-${index}`} />
         ))}
      </Layout>
   );
};

export default Home2;
