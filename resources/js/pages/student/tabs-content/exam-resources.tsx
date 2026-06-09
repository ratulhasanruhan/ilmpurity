import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { StudentExamProps } from '@/types/page';
import { usePage } from '@inertiajs/react';
import { format } from 'date-fns';
import { Download, ExternalLink } from 'lucide-react';

const ExamResources = () => {
   const { exam } = usePage<StudentExamProps>().props;

   // Function to format date in Bengali style if needed
   const formatDate = (dateString: string) => {
      const date = new Date(dateString);
      return format(date, 'MMMM dd, yyyy, hh:mm a');
   };

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
      <div className="space-y-8">
         {exam.resources.length > 0 ? (
            <Card>
               <div className="bg-muted rounded-t-lg px-4 py-3">
                  <h3 className="text-lg font-semibold">Exam Resources</h3>
               </div>

               <div className="overflow-hidden border-t">
                  <Table>
                     <TableHeader className="bg-muted/50">
                        <TableRow>
                           <TableHead className="px-4 font-semibold">Title</TableHead>
                           <TableHead className="px-4 font-semibold">Date & Time</TableHead>
                           <TableHead className="px-4 text-right font-semibold">Action</TableHead>
                        </TableRow>
                     </TableHeader>
                     <TableBody>
                        {exam.resources.map((resource, index) => (
                           <TableRow key={resource.id} className="hover:bg-muted/30">
                              <TableCell className="px-4 py-3 font-medium">{resource.title}</TableCell>
                              <TableCell className="text-muted-foreground px-4 py-3">{formatDate(resource.created_at)}</TableCell>
                              <TableCell className="px-4 py-3 text-right">
                                 <div className="flex items-center justify-end gap-2">
                                    {resource.type === 'link' ? (
                                       <Button asChild size="sm" variant="secondary">
                                          <a target="_blank" href={resource.resource}>
                                             <ExternalLink className="h-3 w-3" />
                                             Check
                                          </a>
                                       </Button>
                                    ) : (
                                       <Button size="sm" variant="secondary" onClick={(e) => handleDownload(resource, e)}>
                                          <Download className="h-3 w-3" />
                                          Download
                                       </Button>
                                    )}
                                 </div>
                              </TableCell>
                           </TableRow>
                        ))}
                     </TableBody>
                  </Table>
               </div>
            </Card>
         ) : (
            <div className="py-12 text-center">
               <p className="text-muted-foreground text-lg">No resources available for this exam yet.</p>
            </div>
         )}
      </div>
   );
};

export default ExamResources;
