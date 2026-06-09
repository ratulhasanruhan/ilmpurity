import { Button } from '@/components/ui/button';
import { TabsList, TabsTrigger } from '@/components/ui/tabs';
import { StudentDashboardProps } from '@/types/page';
import { router, usePage } from '@inertiajs/react';
import { LayoutDashboard, LogOut, LucideProps } from 'lucide-react';

interface TabListsProps {
   tabs: {
      id: string;
      name: string;
      slug: string;
      Icon: React.ForwardRefExoticComponent<Omit<LucideProps, 'ref'> & React.RefAttributes<SVGSVGElement>>;
   }[];
}

const TabLists = ({ tabs }: TabListsProps) => {
   const { props } = usePage<StudentDashboardProps>();
   const { auth, system, instructor, translate } = props;
   const { button, common } = translate;

   return (
      <div className="w-[230px] p-5">
         <div className="flex flex-col items-center p-6">
            <div className="h-[120px] w-[120px] overflow-hidden rounded-full">
               <img
                  alt={`${auth.user.name}'s profile`}
                  src={auth.user.photo || '/assets/icons/avatar.png'}
                  className="h-full w-full content-center object-cover"
               />
            </div>

            <h6 className="mt-8 mb-1 font-bold">{auth.user.name}</h6>

            <p className="text-muted-foreground text-sm">{auth.user.email}</p>
         </div>

         {instructor && instructor.status === 'approved' && (
            <Button
               variant="ghost"
               className="text-muted-foreground h-11 w-full justify-start gap-3 rounded-none px-5 py-3 text-start"
               onClick={() => router.get(route('dashboard'))}
            >
               <LayoutDashboard className="h-4 w-4" />
               <span>{common.dashboard}</span>
            </Button>
         )}

         <TabsList className="grid h-auto grid-cols-1 gap-2 bg-transparent p-0">
            {tabs.map(({ id, name, slug, Icon }) => (
               <TabsTrigger
                  key={id}
                  value={slug}
                  className="hover:bg-secondary hover:text-secondary-foreground data-[state=active]:!bg-muted data-[state=active]:!text-secondary-foreground relative flex h-10 cursor-pointer items-center justify-start gap-3 rounded-md px-4 text-start"
                  onClick={() => router.get(route('student.index', { tab: slug }))}
               >
                  <Icon className="h-4 w-4" />
                  <span>{name}</span>
               </TabsTrigger>
            ))}

            <Button
               variant="secondary"
               className="bg-background text-primary hover:text-secondary-foreground h-10 w-full justify-start gap-3 rounded-md px-4"
               onClick={() => router.post(route('logout'))}
            >
               <LogOut className="h-4 w-4" />
               <span>{button.logout}</span>
            </Button>
         </TabsList>

         {((system.sub_type === 'collaborative' && !instructor) || (instructor && instructor.status !== 'approved')) && (
            <Button
               variant="outline"
               className="hover:bg-background border-secondary-light mt-7 w-full"
               onClick={() =>
                  router.get(
                     route('student.index', {
                        tab: 'instructor',
                     }),
                  )
               }
            >
               {button.become_instructor}
            </Button>
         )}
      </div>
   );
};

export default TabLists;
