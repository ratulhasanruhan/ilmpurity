import { Button } from '@/components/ui/button';
import DashboardLayout from '@/layouts/dashboard/layout';
import { Link } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import CertificateBuilderForm from './partials/certificate-builder-form';

const CertificateBuilder = ({ template }: CertificateBuilderPageProps) => {
   return (
      <div className="space-y-6">
         <div className="flex items-center justify-between">
            <div>
               <h2 className="text-2xl font-bold">{template ? 'Edit' : 'Create'} Certificate Template</h2>
               <p className="text-muted-foreground">Customize your certificate design and content</p>
            </div>

            <Link href={route('certificate.templates.index')}>
               <Button>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
               </Button>
            </Link>
         </div>

         <CertificateBuilderForm template={template} />
      </div>
   );
};

CertificateBuilder.layout = (page: React.ReactNode) => <DashboardLayout children={page} />;

export default CertificateBuilder;
