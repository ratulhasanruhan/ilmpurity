import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { StudentCourseProps } from '@/types/page';
import { usePage } from '@inertiajs/react';
import { format } from 'date-fns';
import { Download, ExternalLink } from 'lucide-react';

const Resources = () => {
   const { props } = usePage<StudentCourseProps>();
   const { resources } = props;

   // Function to format date in Bengali style if needed
   const formatDate = (dateString: string) => {
      const date = new Date(dateString);
      return format(date, 'MMMM dd, yyyy, hh:mm a');
   };

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
      <div className="space-y-8">
         {resources && resources.length > 0 ? (
            resources.map((section, sectionIndex) => (
               <Card key={section.id}>
                  {/* Module Header */}
                  <div className="bg-muted rounded-t-lg px-4 py-3">
                     <h3 className="text-lg font-semibold">Module: {section.title}</h3>
                  </div>

                  {/* Lessons Table */}
                  <div className="space-y-4 p-4">
                     {section.section_lessons && section.section_lessons.length > 0 ? (
                        section.section_lessons.map((lesson) =>
                           lesson.resources && lesson.resources.length > 0 ? (
                              <div key={lesson.id} className="rounded-md border">
                                 {/* Lesson Title */}
                                 <div className="p-4">
                                    <p className="text-base font-medium">
                                       <span className="font-semibold">Lesson:</span> {lesson.title}
                                    </p>
                                 </div>

                                 {/* Resources Table */}
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
                                          {lesson.resources.map((resource) => (
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
                              </div>
                           ) : null,
                        )
                     ) : (
                        <div className="text-muted-foreground py-8 text-center">No lessons found in this module.</div>
                     )}
                  </div>
               </Card>
            ))
         ) : (
            <div className="py-12 text-center">
               <p className="text-muted-foreground text-lg">No resources available for this course yet.</p>
            </div>
         )}
      </div>
   );
};

export default Resources;
