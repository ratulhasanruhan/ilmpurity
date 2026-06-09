import AppLogo from '@/components/app-logo';
import Appearance from '@/components/appearance';
import Notification from '@/components/notification';
import ProfileToggle from '@/components/profile-toggle';
import { Button } from '@/components/ui/button';
import { useSidebar } from '@/components/ui/sidebar';
import useScreen from '@/hooks/use-screen';
import { CoursePlayerProps } from '@/types/page';
import { Link, usePage } from '@inertiajs/react';
import { Expand, GraduationCap, Heart, Menu, Minimize, SettingsIcon, UserCircle } from 'lucide-react';
import { nanoid } from 'nanoid';

const Navbar = () => {
   const { screen } = useScreen();
   const { open, toggleSidebar } = useSidebar();
   const { props } = usePage<CoursePlayerProps>();
   const { translate } = props;
   const { button } = translate;
   const user = props.auth.user;

   return (
      <header className="bg-primary dark:bg-primary-dark text-primary-foreground dark:text-primary sticky top-0 z-50 h-[60px]">
         <div className="flex h-full items-center justify-between gap-3 px-4 md:px-8">
            <Link href="/">
               <AppLogo theme="light" />
            </Link>

            <p className="hidden font-semibold sm:block">{props.course.title}</p>

            <div className="mr-0 flex items-center gap-2">
               <Appearance />

               <Notification />

               {screen > 768 && (
                  <Button
                     size="icon"
                     variant="secondary"
                     onClick={() => toggleSidebar()}
                     className="border-secondary-light text-secondary-foreground hover:text-secondary-foreground rounded-full"
                  >
                     {open ? <Expand /> : <Minimize />}
                  </Button>
               )}

               <ProfileToggle />

               {screen < 768 && (
                  <Button
                     size="icon"
                     variant="secondary"
                     onClick={() => toggleSidebar()}
                     className="border-secondary-light text-secondary-foreground hover:text-secondary-foreground rounded-full"
                  >
                     <Menu />
                  </Button>
               )}
            </div>
         </div>
      </header>
   );
};

const getStudentMenuItems = (button: any) => [
   {
      id: nanoid(),
      name: button.my_courses,
      slug: 'courses',
      Icon: GraduationCap,
   },
   {
      id: nanoid(),
      name: button.wishlist,
      slug: 'wishlist',
      Icon: Heart,
   },
   {
      id: nanoid(),
      name: button.profile,
      slug: 'profile',
      Icon: UserCircle,
   },
   {
      id: nanoid(),
      name: button.settings,
      slug: 'settings',
      Icon: SettingsIcon,
   },
];

export default Navbar;
