import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { SharedData } from '@/types/global';
import { router, usePage } from '@inertiajs/react';
import { GraduationCap, Heart, LayoutDashboard, LogOut, SettingsIcon, UserCircle } from 'lucide-react';
import { nanoid } from 'nanoid';

const ProfileToggle = () => {
   const { props } = usePage<SharedData>();
   const { user } = props.auth;
   const { button } = props.translate;

   const studentMenuItems = [
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

   return (
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

         <DropdownMenuContent align="end" className="w-[160px]">
            {(user.role === 'admin' || user.role === 'instructor') && (
               <DropdownMenuItem className="cursor-pointer px-3" onClick={() => router.get(route('dashboard'))}>
                  <LayoutDashboard className="mr-1 h-4 w-4" />
                  <span>{button.dashboard}</span>
               </DropdownMenuItem>
            )}

            {(user.role === 'student' || user.role === 'instructor') &&
               studentMenuItems.map(({ id, name, Icon, slug }) => (
                  <DropdownMenuItem key={id} className="cursor-pointer px-3" onClick={() => router.get(route('student.index', { tab: slug }))}>
                     <Icon className="mr-1 h-4 w-4" />
                     <span>{name}</span>
                  </DropdownMenuItem>
               ))}

            <DropdownMenuItem className="cursor-pointer px-3" onClick={() => router.post('/logout')}>
               <LogOut className="mr-1 h-4 w-4" />
               <span>{button.logout}</span>
            </DropdownMenuItem>
         </DropdownMenuContent>
      </DropdownMenu>
   );
};

export default ProfileToggle;
