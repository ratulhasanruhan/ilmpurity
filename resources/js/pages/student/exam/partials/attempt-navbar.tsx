import AppLogo from '@/components/app-logo';
import { Button } from '@/components/ui/button';
import useScreen from '@/hooks/use-screen';
import { cn } from '@/lib/utils';
import { Link } from '@inertiajs/react';
import { Maximize, Minimize } from 'lucide-react';
import { useEffect, useState } from 'react';

interface NavbarProps {
   attempt: ExamAttempt;
   questionIndex: number;
}

const AttemptNavbar = ({ attempt, questionIndex }: NavbarProps) => {
   const { screen } = useScreen();
   const [isSticky, setIsSticky] = useState(false);
   const [isMenuOpen, setIsMenuOpen] = useState(false);
   const [isFullscreen, setIsFullscreen] = useState(false);

   const heightCover = true;
   const questions = attempt.exam.questions || [];

   useEffect(() => {
      const handleScroll = () => {
         const scrollPosition = window.scrollY;
         if (scrollPosition > 100) {
            setIsSticky(true);
         } else {
            setIsSticky(false);
         }
      };

      window.addEventListener('scroll', handleScroll);

      return () => {
         window.removeEventListener('scroll', handleScroll);
      };
   }, []);

   const toggleFullscreen = () => {
      if (!isFullscreen) {
         document.documentElement.requestFullscreen?.();
      } else {
         document.exitFullscreen?.();
      }
      setIsFullscreen(!isFullscreen);
   };

   return (
      <>
         <div className={cn('fixed top-0 z-30 w-full', isMenuOpen && 'bg-background')}>
            <div
               className={cn(
                  'gap-1 !px-4 transition-all duration-200 md:gap-6',
                  isSticky && 'bg-background shadow-card mx-auto w-full',
                  screen < 768 && 'rounded-none',
               )}
            >
               <div className="container flex items-center justify-between">
                  <div className="flex h-[72px] items-center gap-2">
                     {/* Logo */}
                     <Link href="/">
                        <AppLogo />
                     </Link>
                  </div>

                  {screen > 768 && <h1 className="text-xl font-bold">{attempt.exam.title}</h1>}

                  <div className="flex items-center gap-3">
                     <Button variant="outline" size="sm" onClick={toggleFullscreen}>
                        {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
                     </Button>
                  </div>
               </div>
            </div>
         </div>

         {heightCover && <div className="relative z-20 h-[72px] bg-transparent" />}
      </>
   );
};

export default AttemptNavbar;
