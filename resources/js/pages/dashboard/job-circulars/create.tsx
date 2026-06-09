import { Button } from '@/components/ui/button';
import DashboardLayout from '@/layouts/dashboard/layout';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import { ReactNode } from 'react';
import JobCircularForm from './partials/job-circular-form';

const CreateJobCircular = ({ translate }: { translate: LanguageTranslations }) => {
   const { button } = translate;

   return (
      <>
         <Head title={button.create_job} />

         <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
               <div className="flex items-center gap-4">
                  <Button variant="outline" size="icon" asChild>
                     <Link href={route('job-circulars.index')}>
                        <ArrowLeft className="h-4 w-4" />
                     </Link>
                  </Button>

                  <h1 className="text-xl font-semibold">{button.create_job}</h1>
               </div>
            </div>

            <JobCircularForm />
         </div>
      </>
   );
};

CreateJobCircular.layout = (page: ReactNode) => <DashboardLayout children={page} />;

export default CreateJobCircular;
