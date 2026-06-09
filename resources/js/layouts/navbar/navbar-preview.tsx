import AppLogo from '@/components/app-logo';
import Appearance from '@/components/appearance';
import Notification from '@/components/notification';
import ProfileToggle from '@/components/profile-toggle';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Link } from '@inertiajs/react';
import { ChevronDown, Menu, X } from 'lucide-react';
import { Fragment, useState } from 'react';

interface NavbarPreviewProps {
   auth: boolean;
   navbar: Navbar;
}

const NavbarPreview = ({ auth, navbar }: NavbarPreviewProps) => {
   const [isMenuOpen, setIsMenuOpen] = useState(false);

   const renderNavItems = (item: NavbarItem) => {
      if (!item.active) return null;

      switch (item.type) {
         case 'url':
            return (
               <Link key={item.id} href={item.value || ''} className="py-1 text-sm font-normal">
                  {item.title}
               </Link>
            );

         case 'dropdown':
            return (
               <DropdownMenu key={item.id}>
                  <DropdownMenuTrigger className="flex cursor-pointer items-center py-1 text-sm">
                     {item.title}
                     <ChevronDown className="ml-1 h-4 w-4" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="min-w-20">
                     {item.items &&
                        Array.isArray(item.items) &&
                        item.items.map((subItem: any, idx: number) => (
                           <DropdownMenuItem key={idx} asChild className="cursor-pointer px-5">
                              <Link href={subItem.url || ''}>{subItem.title}</Link>
                           </DropdownMenuItem>
                        ))}
                  </DropdownMenuContent>
               </DropdownMenu>
            );

         default:
            return null;
      }
   };

   const renderActionItems = (item: NavbarItem) => {
      if (item.type === 'action' && item.active) {
         switch (item.slug) {
            // case 'search':
            //    return <SearchInput placeholder="Search courses, instructors..." onChangeValue={() => {}} />;

            case 'theme':
               return <Appearance />;

            case 'notification':
               return <Notification />;

            case 'profile':
               return <ProfileToggle />;

            default:
               return null;
         }
      }

      return null;
   };

   const sortedItems = navbar.navbar_items.sort((a, b) => a.sort - b.sort);

   return (
      <div className="border-border bg-background rounded-lg border px-4 transition-colors">
         <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-10">
               <Link href="/">
                  <AppLogo />
               </Link>

               {/* Desktop Navigation */}
               <div className="hidden gap-4 md:flex md:items-center">
                  {sortedItems.map((item) => (
                     <Fragment key={item.id}>{renderNavItems(item)}</Fragment>
                  ))}
               </div>
            </div>

            <div className="flex items-center gap-2">
               {auth ? (
                  sortedItems.map((item) => <Fragment key={item.id}>{renderActionItems(item)}</Fragment>)
               ) : (
                  <>
                     <Button asChild variant="outline" className="h-auto rounded-sm px-5 py-2.5 shadow-none">
                        <Link href={route('register')}>Sign Up</Link>
                     </Button>
                     <Button asChild className="h-auto rounded-sm px-5 py-2.5 shadow-none">
                        <Link href={route('login')}>Log In</Link>
                     </Button>
                  </>
               )}

               {/* Mobile menu button */}
               <Button size="icon" variant="secondary" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                  {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
               </Button>
            </div>
         </div>

         {/* Mobile Menu */}
         {isMenuOpen && (
            <ScrollArea className="animate-fade-in h-[calc(100vh-72px)] border-t md:hidden">
               <div className="flex flex-col space-y-4 py-4">
                  {sortedItems.map((item) => (
                     <Fragment key={item.id}>{renderNavItems(item)}</Fragment>
                  ))}
               </div>
            </ScrollArea>
         )}
      </div>
   );
};

export default NavbarPreview;
