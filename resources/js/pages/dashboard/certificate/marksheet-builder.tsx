import { Button } from '@/components/ui/button';
import DashboardLayout from '@/layouts/dashboard/layout';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import MarksheetBuilderForm from './partials/marksheet-builder-form';

const MarksheetBuilder = ({ template }: MarksheetBuilderPageProps) => {
   return (
      <>
         <Head title={`${template ? 'Edit' : 'Create'} Marksheet Template`} />

         <div className="space-y-6">
            <div className="flex items-center justify-between">
               <div>
                  <h2 className="text-2xl font-bold">{template ? 'Edit' : 'Create'} Marksheet Template</h2>
                  <p className="text-muted-foreground">Customize your marksheet design and content</p>
               </div>

               <Link href={route('marksheet.templates.index')}>
                  <Button>
                     <ArrowLeft className="mr-2 h-4 w-4" />
                     Back
                  </Button>
               </Link>
            </div>

            <MarksheetBuilderForm template={template} />
         </div>
      </>
   );
};

MarksheetBuilder.layout = (page: React.ReactNode) => <DashboardLayout children={page} />;

export default MarksheetBuilder;
