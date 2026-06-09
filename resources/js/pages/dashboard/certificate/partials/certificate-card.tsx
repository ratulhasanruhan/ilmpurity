import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Link, router } from '@inertiajs/react';
import { Award, Check, Edit, Trash2 } from 'lucide-react';
import { useState } from 'react';
import CertificatePreview from './certificate-preview';

interface CertificateCardProps {
   type: 'course' | 'exam';
   template: CertificateTemplate;
}

const CertificateCard = ({ type, template }: CertificateCardProps) => {
   const [previewTemplate, setPreviewTemplate] = useState<CertificateTemplate | null>(null);

   const handleActivate = (templateId: number) => {
      router.post(
         route('certificate.templates.activate', templateId),
         { type },
         {
            preserveScroll: true,
         },
      );
   };

   const handleDelete = (templateId: number) => {
      if (confirm('Are you sure you want to delete this certificate template?')) {
         router.delete(route('certificate.templates.destroy', templateId), {
            preserveScroll: true,
         });
      }
   };

   const handlePreview = (template: CertificateTemplate) => {
      setPreviewTemplate(template);
   };

   const handleClosePreview = () => {
      setPreviewTemplate(null);
   };

   return (
      <>
         <Card key={template.id} className={`relative ${template.is_active ? 'ring-primary ring-2' : ''}`}>
            {template.is_active && (
               <div className="bg-primary text-primary-foreground absolute top-4 right-4 rounded-full px-3 py-1 text-xs font-semibold">
                  <Check className="mr-1 inline h-3 w-3" />
                  Active
               </div>
            )}
            <CardHeader>
               <CardTitle className="flex items-center">
                  <Award className="mr-2 h-5 w-5" />
                  {template.name}
               </CardTitle>
               <CardDescription>Created: {new Date(template.created_at).toLocaleDateString()}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
               {/* Mini Preview */}
               <div
                  className="cursor-pointer rounded-lg border-2 p-4 text-center transition-all hover:shadow-md"
                  style={{
                     backgroundColor: template.template_data.backgroundColor,
                     borderColor: template.template_data.borderColor,
                  }}
                  onClick={() => handlePreview(template)}
               >
                  <div className="mb-2 text-xs font-bold" style={{ color: template.template_data.primaryColor }}>
                     {template.template_data.titleText}
                  </div>
                  <div className="text-[8px]" style={{ color: template.template_data.secondaryColor }}>
                     {template.template_data.descriptionText}
                  </div>
               </div>

               {/* Color Indicators */}
               <div className="flex gap-2">
                  <div className="flex items-center gap-1">
                     <div className="h-4 w-4 rounded border" style={{ backgroundColor: template.template_data.primaryColor }} />
                     <span className="text-xs">Primary</span>
                  </div>
                  <div className="flex items-center gap-1">
                     <div className="h-4 w-4 rounded border" style={{ backgroundColor: template.template_data.secondaryColor }} />
                     <span className="text-xs">Secondary</span>
                  </div>
               </div>

               {/* Actions */}
               <div className="flex gap-2">
                  {!template.is_active && (
                     <Button size="sm" variant="outline" className="flex-1" onClick={() => handleActivate(template.id as number)}>
                        <Check className="mr-1 h-3 w-3" />
                        Activate
                     </Button>
                  )}
                  <Button asChild size="sm" variant="outline" className="flex-1">
                     <Link href={route('certificate.templates.edit', template.id)}>
                        <Edit className="mr-1 h-3 w-3" />
                        Edit
                     </Link>
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => handleDelete(template.id as number)}>
                     <Trash2 className="h-3 w-3" />
                  </Button>
               </div>
            </CardContent>
         </Card>

         {/* Preview Dialog */}
         {previewTemplate && (
            <Dialog open={!!previewTemplate} onOpenChange={(open) => !open && handleClosePreview()}>
               <DialogContent className="w-full gap-0 overflow-y-auto p-0 sm:max-w-3xl">
                  <ScrollArea className="max-h-[90vh]">
                     <div className="p-6">
                        <DialogHeader className="mb-6">
                           <DialogTitle>Preview: {previewTemplate?.name}</DialogTitle>
                        </DialogHeader>

                        <CertificatePreview
                           template={previewTemplate}
                           studentName="John Doe"
                           courseName="Sample Course Name"
                           completionDate="January 1, 2025"
                        />
                     </div>
                  </ScrollArea>
               </DialogContent>
            </Dialog>
         )}
      </>
   );
};

export default CertificateCard;
