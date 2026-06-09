import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import useScreen from '@/hooks/use-screen';
import LandingLayout from '@/layouts/landing-layout';
import { getQueryParams } from '@/lib/route';
import { router, usePage } from '@inertiajs/react';
import { ListFilter } from 'lucide-react';
import { ReactNode, useState } from 'react';
import { BlogsIndexProps } from '..';
import BlogFilter from './blog-filter';

const Layout = ({ children }: { children: ReactNode }) => {
   const { url, props } = usePage<BlogsIndexProps>();
   const { category } = props;
   const [open, setOpen] = useState(false);
   const urlParams = getQueryParams(url);
   const { screen } = useScreen();

   const getQueryRoute = (newParams: Record<string, string>, category: string, category_child?: string) => {
      const updatedParams = { ...urlParams };

      if ('search' in updatedParams) {
         delete updatedParams.search;
      }

      return route('blogs.guest', {
         category,
         category_child,
         ...updatedParams,
         ...newParams,
      });
   };

   const gridListHandler = (view: string) => {
      router.get(getQueryRoute({ view }, category?.slug || 'all'));
   };

   return (
      <LandingLayout customizable={false}>
         <div className="container flex items-start gap-6 py-6">
            {screen > 768 && (
               <Card className="sticky top-24 w-64 p-4">
                  <BlogFilter />
               </Card>
            )}

            {/* Main Content */}
            <div className="flex-1">
               <div className="mb-6 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                     {screen < 768 && (
                        <Sheet open={open} onOpenChange={setOpen}>
                           <SheetTrigger asChild>
                              <Button size="icon" variant="outline">
                                 <ListFilter className="h-5 w-5" />
                              </Button>
                           </SheetTrigger>

                           <SheetContent side="left" className="border-border w-[220px]">
                              <ScrollArea className="h-full">
                                 <BlogFilter setOpen={setOpen} />
                              </ScrollArea>
                           </SheetContent>
                        </Sheet>
                     )}

                     <div>
                        <h2 className="text-2xl font-bold capitalize">{category ? category?.name : 'All'} Blogs</h2>
                        {category && category.description && <p className="text-muted-foreground mt-1 text-sm">{category?.description}</p>}
                     </div>
                  </div>
               </div>

               {/* Blog Grid */}
               {children}
            </div>
         </div>
      </LandingLayout>
   );
};

export default Layout;
