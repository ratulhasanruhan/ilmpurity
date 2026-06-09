import React from 'react';
import Footer from './footer';
import Main from './main';
import Navbar from './navbar';

interface LayoutProps {
   children: React.ReactNode;
   language?: boolean;
   navbarHeight?: boolean;
   customizable?: boolean;
}

const LandingLayout = ({ children, language = false, navbarHeight = true, customizable }: LayoutProps) => {
   return (
      <Main>
         <div className="flex min-h-screen flex-col justify-between overflow-x-hidden">
            <main>
               <Navbar heightCover={navbarHeight} customizable={customizable} language={language} />

               {children}
            </main>

            <Footer />
         </div>
      </Main>
   );
};

export default LandingLayout;
