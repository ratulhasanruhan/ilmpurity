import AppLogo from '@/components/app-logo';
import { Link } from '@inertiajs/react';
import Main from './main';

interface Props {
   title: string;
   description: string;
   children: React.ReactNode;
}

const AuthLayout = ({ children, title, description }: Props) => {
   return (
      <Main>
         <div className="bg-background flex min-h-svh flex-col items-center justify-center gap-10 p-6 md:p-10">
            <Link href="/">
               <AppLogo className="h-9" />
            </Link>

            <div className="w-full max-w-sm">
               <div className="flex flex-col gap-8">
                  <div className="space-y-2 text-center">
                     <h1 className="text-2xl font-semibold">{title}</h1>
                     <p className="text-muted-foreground text-center text-sm">{description}</p>
                  </div>

                  {children}
               </div>
            </div>
         </div>
      </Main>
   );
};

export default AuthLayout;
