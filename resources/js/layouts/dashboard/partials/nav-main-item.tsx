import { AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { SidebarMenuButton, useSidebar } from '@/components/ui/sidebar';
import { routeLastSegment, routeSecondSegment } from '@/lib/route';
import { cn } from '@/lib/utils';
import { SharedData } from '@/types/global';
import { Link, usePage } from '@inertiajs/react';
import { Dot } from 'lucide-react';

interface NavMainItemProps {
   pageRoute: RoutePage;
}

const NavMainItem = (props: NavMainItemProps) => {
   const page = usePage<SharedData>();
   const { auth, direction } = page.props;
   const { state, toggleSidebar } = useSidebar();

   const { pageRoute } = props;
   const { Icon, name, path, children, slug } = pageRoute;
   const compact = state === 'collapsed' ? true : false;

   const activeAccordion = (slug: string) => {
      return routeSecondSegment(page.url) === slug;
   };

   const activeRoute = (slug: string) => {
      return routeLastSegment(page.url) === slug;
   };

   // Child routes can share the same last segment (e.g., "create").
   // To avoid multiple items being marked active, we also require the parent
   // accordion slug (second segment) to match.
   const activeChildRoute = (parentSlug: string, childSlug: string) => {
      return activeAccordion(parentSlug) && activeRoute(childSlug);
   };

   return children.length > 0 ? (
      <AccordionItem value={slug} className="border-0">
         <div
            onClick={() => compact && toggleSidebar()}
            className={cn(
               'hover:bg-muted h-9 overflow-hidden rounded-sm',
               activeAccordion(slug) && 'bg-secondary text-secondary-foreground hover:text-secondary-foreground hover:bg-secondary-light',
            )}
         >
            <AccordionTrigger
               className={cn(
                  'h-9 cursor-pointer py-0 pr-2 font-normal hover:no-underline',
                  compact && '[&>svg]:hidden',
                  direction === 'rtl' && 'pr-0',
               )}
            >
               <SidebarMenuButton
                  className={cn(
                     'cursor-pointer hover:bg-transparent active:bg-transparent',
                     activeAccordion(slug) && 'hover:text-secondary-foreground active:text-secondary-foreground',
                  )}
               >
                  <Icon className="h-4 w-4" />
                  <span>{name}</span>
               </SidebarMenuButton>
            </AccordionTrigger>
         </div>

         <AccordionContent className={cn('space-y-1 p-0 py-2', compact ? 'hidden' : '')}>
            {children.map(({ path, name, slug, access }, index: number) => {
               if (access.includes(auth.user.role)) {
                  return (
                     <SidebarMenuButton asChild key={index} isActive={activeChildRoute(pageRoute.slug, slug)} className="h-9 px-3">
                        <Link href={path} prefetch>
                           <Dot className="w-12" />
                           <span className="text-sm font-normal capitalize">{name}</span>
                        </Link>
                     </SidebarMenuButton>
                  );
               }
            })}
         </AccordionContent>
      </AccordionItem>
   ) : (
      <SidebarMenuButton
         asChild
         isActive={activeRoute(slug)}
         className={cn(
            'h-9',
            activeRoute(slug)
               ? 'data-[active=true]:bg-secondary data-[active=true]:text-secondary-foreground data-[active=true]:hover:bg-secondary-light'
               : '',
         )}
      >
         <Link href={path} prefetch>
            <Icon className="h-4 w-4" />
            <span>{name}</span>
         </Link>
      </SidebarMenuButton>
   );
};

export default NavMainItem;
