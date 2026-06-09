import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Head, Link } from '@inertiajs/react';
import { AlertTriangle, CheckCircle, Shield } from 'lucide-react';
import ApplicationBackup from './partials/application-backup';
import ApplicationBackupList from './partials/application-backup-list';
import ApplicationReboot from './partials/application-reboot';
import ApplicationUpdate from './partials/application-update';

export interface MaintenanceProps {
   version: string;
   recentBackups: ApplicationBackup[];
   flash: {
      error: string;
      warning: string;
      success: string;
   };
}

const Maintenance = ({ version, flash, recentBackups }: MaintenanceProps) => {
   return (
      <div className="px-3 py-6 sm:p-6 md:p-10">
         <Head title="App Maintenance" />

         {/* Admin Info */}
         <Card className="mb-7 border-blue-200 bg-blue-50">
            <CardHeader className="flex-row items-center justify-between p-3 sm:p-4">
               <div className="m-0 flex items-center gap-2">
                  <Shield className="h-5 w-5 text-blue-600" />
                  <CardTitle className="text-lg text-blue-900">Admin Verified</CardTitle>
               </div>

               <Link href={route('dashboard')}>
                  <Button>Back To Dashboard</Button>
               </Link>
            </CardHeader>
         </Card>

         <div className="md:px-3">
            <div className="mb-6 flex flex-col justify-between gap-7 sm:flex-row sm:items-center">
               <div>
                  <h1 className="text-2xl font-bold text-nowrap">App Maintenance</h1>
                  <p className="text-muted-foreground text-sm md:text-base">Update, backup and restore your application safely and automatically.</p>
               </div>

               <div>
                  <h1 className="text-2xl font-bold text-nowrap">App Version</h1>
                  <p className="text-muted-foreground text-sm text-nowrap md:text-base">
                     Current Version: <span className="text-primary font-bold">{version}</span>
                  </p>
               </div>
            </div>

            {/* Flash Messages */}
            {flash?.success && (
               <div className="mb-6 rounded-lg border border-green-200 bg-green-50 p-4">
                  <div className="flex items-start">
                     <CheckCircle className="mt-0.5 h-5 w-5 text-green-600" />
                     <div className="ml-3">
                        <p className="text-sm text-green-800">{String(flash.success)}</p>
                     </div>
                  </div>
               </div>
            )}

            {flash?.error && (
               <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4">
                  <div className="flex items-start">
                     <AlertTriangle className="mt-0.5 h-5 w-5 text-red-600" />
                     <div className="ml-3">
                        <p className="text-sm text-red-800">{String(flash.error)}</p>
                     </div>
                  </div>
               </div>
            )}

            <div className="space-y-6">
               {/* Update Section */}
               <ApplicationUpdate version={version} />

               {/* Reboot Section */}
               <ApplicationReboot />

               {/* Backup Section */}
               <ApplicationBackup />

               {/* Backup History Section */}
               <ApplicationBackupList recentBackups={recentBackups} />
            </div>
         </div>
      </div>
   );
};

export default Maintenance;
