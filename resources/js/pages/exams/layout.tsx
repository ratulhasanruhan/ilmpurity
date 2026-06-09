import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import useScreen from '@/hooks/use-screen';
import LandingLayout from '@/layouts/landing-layout';
import { getQueryParams } from '@/lib/route';
import { router, usePage } from '@inertiajs/react';
import { Grid, List, ListFilter } from 'lucide-react';
import { ReactNode, useState } from 'react';
import { ExamsIndexProps } from './index';
import ExamFilter from './partials/exam-filter';

const Layout = ({ children }: { children: ReactNode }) => {
   const { url, props } = usePage<ExamsIndexProps>();
   const { category, translate } = props;
   const { frontend } = translate;
   const [open, setOpen] = useState(false);
   const urlParams = getQueryParams(url);
   const viewType = urlParams['view'] ?? 'grid';
   const { screen } = useScreen();

   const getQueryRoute = (newParams: Record<string, string>, category?: string) => {
      const updatedParams = { ...urlParams };

      if ('search' in updatedParams) {
         delete updatedParams.search;
      }

      return route('category.exams', {
         category: category || 'all',
         ...updatedParams,
         ...newParams,
      });
   };

   const gridListHandler = (view: string) => {
      router.get(getQueryRoute({ view }, category?.slug));
   };

   return (
      <LandingLayout customizable={false}>
         <div className="container flex items-start gap-6 py-6">
            {screen > 768 && (
               <Card className="sticky top-24 w-64 p-4">
                  <ExamFilter />
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
                                 <ExamFilter setOpen={setOpen} />
                              </ScrollArea>
                           </SheetContent>
                        </Sheet>
                     )}

                     <div>
                        <h2 className="text-2xl font-bold capitalize">{category ? category.title : frontend.all} Exams</h2>
                        {category && category.description && <p className="text-muted-foreground mt-1 text-sm">{category.description}</p>}
                     </div>
                  </div>
                  <div className="flex gap-2">
                     <TooltipProvider delayDuration={0}>
                        <Tooltip>
                           <TooltipTrigger asChild>
                              <Button size="icon" variant={viewType === 'grid' ? 'default' : 'outline'} onClick={() => gridListHandler('grid')}>
                                 <Grid className="h-4 w-4" />
                              </Button>
                           </TooltipTrigger>
                           <TooltipContent>
                              <p>{frontend.grid_view}</p>
                           </TooltipContent>
                        </Tooltip>
                     </TooltipProvider>

                     <TooltipProvider delayDuration={0}>
                        <Tooltip>
                           <TooltipTrigger asChild>
                              <Button size="icon" variant={viewType === 'list' ? 'default' : 'outline'} onClick={() => gridListHandler('list')}>
                                 <List className="h-4 w-4" />
                              </Button>
                           </TooltipTrigger>
                           <TooltipContent>
                              <p>{frontend.list_view}</p>
                           </TooltipContent>
                        </Tooltip>
                     </TooltipProvider>
                  </div>
               </div>

               {/* Exam Grid */}
               {children}
            </div>
         </div>
      </LandingLayout>
   );
};

export default Layout;
