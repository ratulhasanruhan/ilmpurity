import AppLogo from '@/components/app-logo';
import Notification from '@/components/notification';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useSidebar } from '@/components/ui/sidebar';
import useScreen from '@/hooks/use-screen';
import { CoursePlayerProps } from '@/types/page';
import { Link, router, usePage } from '@inertiajs/react';
import { Expand, GraduationCap, Heart, LayoutDashboard, LogOut, Menu, Minimize, SettingsIcon, UserCircle } from 'lucide-react';
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

               <DropdownMenu>
                  <DropdownMenuTrigger className="cursor-pointer outline-none">
                     {user && user.photo ? (
                        <Avatar className="h-9 w-9">
                           <AvatarImage src={user.photo} alt={user.name ?? ''} className="h-full w-full content-center object-cover" />
                           <AvatarFallback>{user.name?.charAt(0)}</AvatarFallback>
                        </Avatar>
                     ) : (
                        <UserCircle className="text-muted-foreground h-9 w-9 rounded-full" />
                     )}
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                     {(user.role === 'admin' || user.role === 'instructor') && (
                        <DropdownMenuItem className="cursor-pointer px-3" onClick={() => router.get(route('dashboard'))}>
                           <LayoutDashboard className="mr-1 h-4 w-4" />
                           <span>{button.dashboard}</span>
                        </DropdownMenuItem>
                     )}

                     {(user.role === 'student' || user.role === 'instructor') &&
                        getStudentMenuItems(button).map(({ id, name, Icon, slug }) => (
                           <DropdownMenuItem
                              key={id}
                              className="cursor-pointer px-3"
                              onClick={() => router.get(route('student.index', { tab: slug }))}
                           >
                              <Icon className="mr-1 h-4 w-4" />
                              <span>{name}</span>
                           </DropdownMenuItem>
                        ))}

                     <DropdownMenuItem className="cursor-pointer px-3" onClick={() => router.post('/logout')}>
                        <LogOut className="mr-1 h-4 w-4" />
                        <span>{button.log_out}</span>
                     </DropdownMenuItem>
                  </DropdownMenuContent>
               </DropdownMenu>

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
