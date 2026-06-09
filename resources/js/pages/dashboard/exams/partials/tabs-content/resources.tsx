import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { usePage } from '@inertiajs/react';
import { Download, Eye, Pencil, Plus } from 'lucide-react';
import { useState } from 'react';
import { ExamUpdateProps } from '../../update';
import ResourceForm from '../forms/resource-form';

const Resources = () => {
   const [editId, setEditId] = useState('');
   const { exam } = usePage<ExamUpdateProps>().props;

   // Helper to handle file download
   const handleDownload = async (resource: ExamResource, e: React.MouseEvent) => {
      e.preventDefault();

      try {
         // For non-link resources, use the download endpoint
         const url = route('exam-resources.download', resource.id);
         window.open(url, '_blank');
      } catch (error) {
         // Fallback to direct download if the endpoint fails
         window.open(resource.resource, '_blank');
      }
   };

   return (
      <div className="space-y-4 py-3">
         <div className="flex items-center justify-between">
            <div>
               <h3 className="text-lg font-semibold">Exam Resources</h3>
               <p className="text-sm text-gray-600">Exam Resources List</p>
            </div>

            <div className="flex items-center gap-2">
               <ResourceForm
                  title="Add new exam resource"
                  handler={
                     <Button>
                        <Plus className="h-4 w-4" />
                        Add Resource
                     </Button>
                  }
               />
            </div>
         </div>

         <Card className="space-y-4 p-5 shadow-none">
            {exam.resources.length > 0 ? (
               exam.resources.map((resource: ExamResource) => (
                  <div className="border-border rounded-md border p-2">
                     <div key={resource.id} className="flex items-center justify-between gap-2">
                        <div className="w-full px-1">
                           {resource.type === 'link' ? (
                              <a target="_blank" href={resource.resource} className="cursor-pointer text-sm hover:underline">
                                 {resource.title.slice(0, 50) + (resource.title.length > 50 ? '...' : '')}
                              </a>
                           ) : (
                              <span className="cursor-pointer text-sm hover:underline" onClick={(e) => handleDownload(resource, e)}>
                                 {resource.title.slice(0, 50) + (resource.title.length > 50 ? '...' : '')}
                              </span>
                           )}
                        </div>

                        <div className="flex items-center justify-end space-x-2">
                           <ResourceForm
                              title="Update new exam resource"
                              resource={resource}
                              handler={
                                 <Button size="icon" variant="secondary" className="h-7 w-7">
                                    <Pencil className="h-3 w-3" />
                                 </Button>
                              }
                           />

                           {resource.type !== 'link' ? (
                              <Button asChild size="icon" variant="secondary" className="h-7 w-7">
                                 <a target="_blank" href={resource.resource}>
                                    <Eye className="h-3 w-3" />
                                 </a>
                              </Button>
                           ) : (
                              <Button size="icon" variant="secondary" className="h-7 w-7" onClick={(e) => handleDownload(resource, e)}>
                                 <Download className="h-3 w-3" />
                              </Button>
                           )}
                        </div>
                     </div>
                  </div>
               ))
            ) : (
               <div className="rounded-md p-1.5">
                  <div className="w-full px-1 py-6 text-center">
                     <p className="text-sm">No resources available</p>
                  </div>
               </div>
            )}
         </Card>
      </div>
   );
};

export default Resources;
