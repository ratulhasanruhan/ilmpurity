import { Link } from '@inertiajs/react';
import { ChevronsRight, Home } from 'lucide-react';

interface Props {
   innerPage: Page;
}

const Hero = ({ innerPage }: Props) => {
   return (
      <div className="relative overflow-y-hidden bg-[rgba(255,222,99,0.06)] pt-[212px] pb-[100px]">
         <div className="relative z-10 flex flex-col items-center justify-center space-y-2">
            <h1 className="text-4xl font-bold md:text-[44px]">{innerPage.name}</h1>
            <div className="text-muted-foreground flex items-center gap-1">
               <Link href="/">
                  <Home size={18} />
               </Link>
               <ChevronsRight size={14} />
               <span className="text-sm">{innerPage.slug}</span>
            </div>
         </div>

         <div className="after:pointer-events-none after:absolute after:top-1/2 after:right-0 after:h-[200px] after:w-[200px] after:-translate-y-1/2 after:rounded-full after:bg-[rgba(0,167,111,1)] after:blur-[140px] after:content-['']"></div>
      </div>
   );
};

export default Hero;
