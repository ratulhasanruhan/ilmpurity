import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import DashboardLayout from '@/layouts/dashboard/layout';
import { SharedData } from '@/types/global';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Eye } from 'lucide-react';
import { ReactNode } from 'react';
import JobCircularForm from './partials/job-circular-form';

interface Props extends SharedData {
   jobCircular: JobCircular;
   locations: string[];
   jobTypes: Record<string, string>;
   workTypes: Record<string, string>;
   experienceLevels: Record<string, string>;
   statuses: Record<string, string>;
   currencies: Record<string, string>;
}

const EditJobCircular = ({ jobCircular, statuses, translate }: Props) => {
   const { button, dashboard, common } = translate;

   const getStatusBadge = (status: string) => {
      const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
         draft: 'outline',
         active: 'default',
         paused: 'secondary',
         closed: 'destructive',
         expired: 'destructive',
      };

      return <Badge variant={variants[status] || 'outline'}>{statuses[status] || status}</Badge>;
   };

   return (
      <>
         <Head title={`Edit ${jobCircular.title}`} />

         <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
               <div className="flex items-center gap-4">
                  <Button variant="outline" size="icon" asChild>
                     <Link href={route('job-circulars.index')}>
                        <ArrowLeft className="h-4 w-4" />
                     </Link>
                  </Button>

                  <div className="flex items-center gap-3">
                     <h1 className="text-xl font-semibold">{button.edit_job}</h1>
                     {getStatusBadge(jobCircular.status)}
                  </div>
               </div>
               <Button variant="outline" asChild>
                  <Link href={route('job-circulars.show', jobCircular.id)}>
                     <Eye className="mr-2 h-4 w-4" />
                     {common.preview}
                  </Link>
               </Button>
            </div>

            <JobCircularForm jobCircular={jobCircular} />
         </div>
      </>
   );
};

EditJobCircular.layout = (page: ReactNode) => <DashboardLayout children={page} />;

export default EditJobCircular;
