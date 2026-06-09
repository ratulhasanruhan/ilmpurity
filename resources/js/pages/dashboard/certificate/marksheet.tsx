import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import DashboardLayout from '@/layouts/dashboard/layout';
import { SharedData } from '@/types/global';
import { Head, Link } from '@inertiajs/react';
import { ClipboardList, Plus } from 'lucide-react';
import MarkSheetCard from './partials/marksheet-card';

interface MarksheetPageProps extends SharedData {
   templates: MarksheetTemplate[];
}

const MarksheetIndex = ({ templates }: MarksheetPageProps) => {
   const examTemplates = templates.filter((template) => template.type === 'exam');
   const courseTemplates = templates.filter((template) => template.type === 'course');

   return (
      <>
         <Head title="Certificate & Marksheet Templates" />

         <div className="space-y-6">
            <div className="flex items-center justify-between">
               <div>
                  <h2 className="text-xl font-semibold">Marksheet Templates</h2>
                  <p className="text-muted-foreground text-sm">Design marksheets showing course grades</p>
               </div>
               <Link href={route('marksheet.templates.create')}>
                  <Button>
                     <Plus className="mr-2 h-4 w-4" />
                     Create Template
                  </Button>
               </Link>
            </div>

            <div className="py-6">
               <h6 className="mb-3 text-xl font-semibold">Course Marksheet Templates</h6>

               {courseTemplates.length === 0 ? (
                  <Card className="p-12">
                     <div className="flex flex-col items-center justify-center text-center">
                        <ClipboardList className="text-muted-foreground mb-4 h-16 w-16" />
                        <h3 className="mb-2 text-xl font-semibold">No marksheet templates yet</h3>
                        <p className="text-muted-foreground mb-4">Create your first marksheet template to get started</p>
                        <Link href={route('marksheet.templates.create')}>
                           <Button>
                              <Plus className="mr-2 h-4 w-4" />
                              Create Your First Template
                           </Button>
                        </Link>
                     </div>
                  </Card>
               ) : (
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                     {courseTemplates.map((template) => (
                        <MarkSheetCard key={template.id} type="course" template={template} />
                     ))}
                  </div>
               )}
            </div>
         </div>
      </>
   );
};

MarksheetIndex.layout = (page: React.ReactNode) => <DashboardLayout children={page} />;

export default MarksheetIndex;
