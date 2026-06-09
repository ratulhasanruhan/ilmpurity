import { Button } from '@/components/ui/button';
import { useSidebar } from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const SidebarToggle = ({ className }: { className?: string }) => {
   const { open, isMobile, openMobile, toggleSidebar } = useSidebar();

   return (
      <Button
         variant="outline"
         onClick={() => toggleSidebar()}
         className={cn(
            'bg-secondary-foreground text-primary-foreground hover:bg-secondary-foreground hover:text-primary-foreground z-10 h-10 w-8 rounded-none rounded-bl border-none p-0 shadow-none',
            className,
         )}
      >
         {isMobile ? (
            openMobile ? (
               <ChevronRight className="!h-6 !w-6" />
            ) : (
               <ChevronLeft className="!h-6 !w-6" />
            )
         ) : open ? (
            <ChevronRight className="!h-6 !w-6" />
         ) : (
            <ChevronLeft className="!h-6 !w-6" />
         )}
      </Button>
   );
};

export default SidebarToggle;
