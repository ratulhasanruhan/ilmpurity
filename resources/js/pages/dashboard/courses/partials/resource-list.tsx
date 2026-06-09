import { Button } from '@/components/ui/button';
import { Download, Eye, Pencil } from 'lucide-react';
import { useState } from 'react';
import ResourceForm from './forms/resource-form';

interface Props {
   lesson: SectionLesson;
   isSubmit: boolean;
   setIsSubmit: (value: boolean) => void;
   setOpen: (value: boolean) => void;
}

const ResourceList = ({ lesson, isSubmit, setIsSubmit, setOpen }: Props) => {
   const [editId, setEditId] = useState('');

   // Helper to handle file download
   const handleDownload = async (resource: LessonResource, e: React.MouseEvent) => {
      e.preventDefault();
      try {
         // For non-link resources, use the download endpoint
         const url = route('resources.download', resource.id);
         window.open(url, '_blank');
      } catch (error) {
         // Fallback to direct download if the endpoint fails
         window.open(resource.resource, '_blank');
      }
   };

   return (
      <div className="space-y-4 py-3">
         {lesson.resources.length > 0 ? (
            lesson.resources.map((resource: LessonResource) => (
               <div className="bg-muted rounded-md p-1.5">
                  {resource.id === editId ? (
                     <div className="relative">
                        <ResourceForm lesson={lesson} resource={resource} isSubmit={isSubmit} setIsSubmit={setIsSubmit} setIsOpen={setOpen} />
                        <Button variant="secondary" className="absolute right-0 bottom-0" onClick={() => setEditId('')}>
                           Cancel
                        </Button>
                     </div>
                  ) : (
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
                           <Button size="icon" variant="secondary" className="h-7 w-7" onClick={() => setEditId(resource.id as string)}>
                              <Pencil className="h-3 w-3" />
                           </Button>

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
                  )}
               </div>
            ))
         ) : (
            <div className="bg-muted rounded-md p-1.5">
               <div className="w-full px-1 py-6 text-center">
                  <p className="text-sm">No resources available</p>
               </div>
            </div>
         )}
      </div>
   );
};

export default ResourceList;
