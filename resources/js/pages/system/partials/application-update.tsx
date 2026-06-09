import ChunkedUploaderInput from '@/components/chunked-uploader-input';
import InputError from '@/components/input-error';
import LoadingButton from '@/components/loading-button';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import {
   Dialog,
   DialogClose,
   DialogContent,
   DialogDescription,
   DialogFooter,
   DialogHeader,
   DialogTitle,
   DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { router, useForm } from '@inertiajs/react';
import { AlertTriangle, CheckCircle, RefreshCw, Upload } from 'lucide-react';
import { useEffect, useState } from 'react';

interface Props {
   version: string;
}

const ApplicationUpdate = ({ version }: Props) => {
   const [open, setOpen] = useState(false);
   const [seeding, setSeeding] = useState(false);
   const [isSubmit, setIsSubmit] = useState(false);
   const [isFileSelected, setIsFileSelected] = useState(false);
   const [selectedFileName, setSelectedFileName] = useState<string>('');

   const { data, setData, post, errors, processing, reset } = useForm({
      update_file_url: '',
   });

   const refreshForm = useForm({});
   const handleRefreshServer = () => {
      refreshForm.post(route('system.refresh'));
   };

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();

      if (isFileSelected) {
         setIsSubmit(true);
         return;
      }
   };

   const onResetHandler = () => {
      setIsSubmit(false);
      setIsFileSelected(false);
      setSelectedFileName('');
      reset('update_file_url');
   };

   // Auto-submit form when upload completes and file URL is set
   useEffect(() => {
      if (data.update_file_url && isSubmit) {
         post(route('system.update'), {
            onSuccess: () => {
               setOpen(false);
               onResetHandler();
            },
            onError: () => {
               onResetHandler();
            },
         });
      }
   }, [data.update_file_url]);

   const handleOpenChange = (open: boolean) => {
      if (isSubmit) {
         setOpen(true);
      } else {
         setOpen(open);
         if (!open) {
            onResetHandler();
         }
      }
   };

   const seedHandler = () => {
      setSeeding(true);

      router.get(route('system.update.seeder'), {}, { onFinish: () => setSeeding(false) });
   };

   return (
      <>
         <Card className="border-2">
            <CardHeader className="p-4 sm:p-6">
               <h2 className="flex items-center gap-2 text-xl font-semibold">
                  <Upload className="text-warning h-5 w-5" />
                  Application Update
               </h2>
               <p className="text-muted-foreground mt-1 text-sm">Upload and install the latest version of your application</p>
            </CardHeader>

            <CardContent className="space-y-6 p-4 pt-0 sm:p-6 sm:pt-0">
               <div className="dark:bg-secondary dark:border-border rounded-lg border border-amber-200 bg-amber-50 p-4">
                  <div className="flex items-start">
                     <div className="flex-shrink-0">
                        <AlertTriangle className="h-5 w-5 text-amber-600" />
                     </div>
                     <div className="ml-3">
                        <h3 className="text-sm font-medium text-amber-800">Important Update Guidelines</h3>
                        <div className="mt-2 text-sm text-amber-700">
                           <ul className="list-inside list-disc space-y-1">
                              <li>
                                 <strong>Refresh Server:</strong> Every time refresh server before updating
                              </li>
                              <li>
                                 <strong>Backup First:</strong> Always create a backup before updating
                              </li>
                              <li>
                                 <strong>File Format:</strong> Upload must be a valid ZIP file
                              </li>
                              <li>
                                 <strong>Maintenance Mode:</strong> Site will be temporarily unavailable during update
                              </li>
                              <li>
                                 <strong>Migrations:</strong> Database migrations will be automatically applied
                              </li>
                              <li>
                                 <strong>Downtime:</strong> Update process may take several minutes
                              </li>
                              <li>
                                 <strong>Browser:</strong> Do not refresh or close browser during update
                              </li>
                              <li>
                                 <strong>Seeder:</strong> Run seeder only after updating the application version
                              </li>
                           </ul>
                        </div>
                     </div>
                  </div>
               </div>

               <div className="flex flex-col gap-3 sm:flex-row">
                  <LoadingButton
                     type="button"
                     variant="secondary"
                     onClick={handleRefreshServer}
                     loading={refreshForm.processing}
                     disabled={processing || isSubmit}
                  >
                     <div className="flex items-center gap-2">
                        <RefreshCw className="h-4 w-4" />
                        <span>Refresh Server</span>
                     </div>
                  </LoadingButton>

                  <Button type="button" onClick={() => setOpen(true)}>
                     <Upload className="h-4 w-4" />
                     <span>{isSubmit ? 'Uploading...' : processing ? 'Updating Application...' : 'Update Application'}</span>
                  </Button>

                  {/*  */}
                  <Dialog>
                     <DialogTrigger asChild>
                        {/* <Button variant="destructive" className="text-primary-foreground"></Button> */}
                        <Button variant="ghost" className="bg-destructive/8 hover:bg-destructive/6 text-destructive hover:text-destructive">
                           Run {version} Version Seeder
                        </Button>
                     </DialogTrigger>

                     <DialogContent>
                        <DialogTitle>Run Version {version} Seeder</DialogTitle>
                        <DialogDescription className="space-y-2">
                           <p>This will run the database seeder for version {version}.</p>

                           <div className="rounded-md bg-yellow-50 p-3 text-sm text-yellow-700">
                              <p className="font-medium">Important Notes:</p>
                              <ul className="mt-1 list-inside list-disc space-y-1">
                                 <li>Run this seeder only once after updating to version {version}</li>
                                 <li>Running this multiple times will overwrite existing data</li>
                                 <li>Do not run this seeder after you have added your own content to the website</li>
                              </ul>
                           </div>
                        </DialogDescription>

                        <DialogFooter className="gap-2">
                           <DialogClose asChild>
                              <Button type="button" variant="secondary">
                                 Cancel
                              </Button>
                           </DialogClose>

                           <LoadingButton
                              variant="destructive"
                              loading={seeding}
                              disabled={seeding}
                              className="text-primary-foreground"
                              onClick={seedHandler}
                           >
                              Run Seeder
                           </LoadingButton>
                        </DialogFooter>
                     </DialogContent>
                  </Dialog>
               </div>
            </CardContent>
         </Card>

         {/* Confirmation Dialog */}
         <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
               {processing && (
                  <div className="bg-background/80 absolute inset-0 z-50 flex items-center justify-center rounded-lg backdrop-blur-sm">
                     <div className="text-center">
                        <div className="border-primary mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-t-transparent"></div>
                        <p className="text-sm font-medium">Updating application...</p>
                        <p className="text-muted-foreground mt-1 text-xs">Please do not close this window</p>
                     </div>
                  </div>
               )}

               <ScrollArea className="max-h-[90vh]">
                  <DialogHeader>
                     <DialogTitle className="flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5 text-orange-600" />
                        Confirm Application Update
                     </DialogTitle>
                     <DialogDescription className="space-y-4 text-left">
                        <p>
                           Are you sure you want to update the application with <strong>"{selectedFileName}"</strong>?
                        </p>

                        <div className="rounded-lg border border-orange-200 bg-orange-50 p-4">
                           <p className="mb-2 font-medium text-orange-800">This update will:</p>
                           <ul className="list-inside list-disc space-y-1 text-sm text-orange-700">
                              <li>Put the site in maintenance mode</li>
                              <li>Replace all application files</li>
                              <li>Run database migrations</li>
                              <li>Process may take several minutes</li>
                           </ul>
                        </div>

                        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
                           <p className="mb-1 font-medium text-red-800">⚠️ Important:</p>
                           <p className="text-sm text-red-700">Make sure you have created a backup first! This action cannot be undone.</p>
                        </div>
                     </DialogDescription>
                  </DialogHeader>

                  <form onSubmit={handleSubmit} className="space-y-4 pt-4">
                     <div>
                        <Label>Select File (.zip only)</Label>

                        <ChunkedUploaderInput
                           isSubmit={isSubmit}
                           storage="local"
                           filetype="zip"
                           delayUpload={false}
                           onFileSelected={(file) => {
                              setIsFileSelected(true);
                              setSelectedFileName(file.name);
                           }}
                           onFileUploaded={(fileData) => {
                              setData('update_file_url', fileData.file_url);
                           }}
                           onError={(errors) => {
                              onResetHandler();
                           }}
                           onCancelUpload={() => {
                              onResetHandler();
                           }}
                        />

                        <InputError message={String(errors.update_file_url || '')} />
                     </div>

                     {isFileSelected && selectedFileName && (
                        <div className="rounded-lg border border-green-200 bg-green-50 p-3">
                           <div className="flex items-start">
                              <CheckCircle className="mt-0.5 h-4 w-4 text-green-600" />
                              <div className="ml-2">
                                 <p className="text-sm text-green-800">
                                    <strong>Selected file:</strong> {selectedFileName}
                                 </p>
                                 <p className="mt-1 text-xs text-blue-600">File selected successfully. Click "Update Application" to proceed.</p>
                              </div>
                           </div>
                        </div>
                     )}

                     <DialogFooter className="w-full justify-between space-x-2 pt-8">
                        <DialogClose asChild>
                           <Button type="button" variant="outline">
                              Close
                           </Button>
                        </DialogClose>

                        <LoadingButton
                           type={!isFileSelected ? 'button' : 'submit'}
                           disabled={processing || isSubmit || !isFileSelected}
                           loading={processing || isSubmit}
                        >
                           {isSubmit ? 'Uploading...' : 'Update Application'}
                        </LoadingButton>
                     </DialogFooter>
                  </form>
               </ScrollArea>
            </DialogContent>
         </Dialog>
      </>
   );
};

export default ApplicationUpdate;
