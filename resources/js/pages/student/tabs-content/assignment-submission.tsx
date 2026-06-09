import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { AlertCircle, CheckCircle, Clock, Download } from 'lucide-react';
import AssignmentSubmissionForm from '../partials/assignment-submission-form';

interface Props {
   assignment: CourseAssignment;
   setDialogOpen: (open: boolean) => void;
}

const AssignmentSubmission = ({ assignment, setDialogOpen }: Props) => {
   const hasSubmission = assignment.submissions && assignment.submissions.length > 0;
   const latestSubmission = hasSubmission ? assignment.submissions[0] : null;
   const isGraded = latestSubmission?.status === 'graded';

   // Format date
   const formatDate = (dateString: string | undefined) => {
      if (!dateString) return 'N/A';
      return format(new Date(dateString), 'MMMM dd, yyyy, hh:mm a');
   };

   return (
      <div className="space-y-6">
         {hasSubmission ? (
            <div className="overflow-hidden rounded-lg border">
               <div className="bg-primary/10 border-b p-4">
                  <h3 className="flex items-center gap-2 font-semibold">
                     {isGraded ? (
                        <>
                           <CheckCircle className="h-5 w-5 text-green-600" />
                           Graded
                        </>
                     ) : latestSubmission?.is_late ? (
                        <>
                           <AlertCircle className="text-destructive h-5 w-5" />
                           Late Submission
                        </>
                     ) : (
                        <>
                           <Clock className="h-5 w-5 text-blue-600" />
                           Under Review
                        </>
                     )}
                  </h3>
               </div>

               <div className="space-y-4 p-6">
                  {/* Grading Info */}
                  {isGraded && (
                     <div className="rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-800 dark:bg-green-950">
                        <div className="mb-2 flex items-center justify-between">
                           <span className="font-medium">Marks Obtained</span>
                           <span className="text-2xl font-bold text-green-600">
                              {latestSubmission?.marks_obtained} / {assignment.total_mark}
                           </span>
                        </div>
                        {latestSubmission?.instructor_feedback && (
                           <div className="mt-4 border-t border-green-200 pt-4 dark:border-green-800">
                              <p className="mb-2 text-sm font-medium">Instructor Feedback:</p>
                              <p className="text-muted-foreground text-sm">{latestSubmission.instructor_feedback}</p>
                           </div>
                        )}
                     </div>
                  )}

                  {/* Submission Details */}
                  <div className="space-y-3">
                     <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Submitted At:</span>
                        <span className="font-medium">{formatDate(latestSubmission?.submitted_at)}</span>
                     </div>
                     <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Attempt Number:</span>
                        <Badge variant="secondary">Attempt {latestSubmission?.attempt_number}</Badge>
                     </div>
                     <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Status:</span>
                        <Badge variant={isGraded ? 'default' : latestSubmission?.is_late ? 'destructive' : 'secondary'}>
                           {latestSubmission?.status === 'graded' ? 'Graded' : latestSubmission?.is_late ? 'Late Submission' : 'Pending'}
                        </Badge>
                     </div>
                  </div>

                  {/* Submitted Content */}
                  {latestSubmission?.comment && (
                     <div className="border-t pt-4">
                        <p className="mb-2 text-sm font-medium">Your Comment:</p>
                        <p className="text-muted-foreground bg-muted rounded-lg p-3 text-sm">{latestSubmission.comment}</p>
                     </div>
                  )}

                  {/* Submitted Attachment */}
                  {latestSubmission?.attachment_path && (
                     <div className="border-t pt-4">
                        <p className="mb-2 text-sm font-medium">Submitted {latestSubmission.attachment_type === 'url' ? 'URL' : 'File'}:</p>
                        {latestSubmission.attachment_type === 'url' ? (
                           <a
                              href={latestSubmission.attachment_path}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary hover:underline"
                           >
                              {latestSubmission.attachment_path}
                           </a>
                        ) : (
                           <Button variant="outline" size="sm" className="gap-2" asChild>
                              <a href={`/storage/${latestSubmission.attachment_path}`} download>
                                 <Download className="h-4 w-4" />
                                 Download File
                              </a>
                           </Button>
                        )}
                     </div>
                  )}
               </div>
            </div>
         ) : (
            <>
               <div className="bg-secondary-lighter rounded-lg p-4">
                  <h3 className="mb-2 font-semibold">Submission Guidelines</h3>
                  <ul className="text-muted-foreground list-inside list-disc space-y-2 text-sm">
                     <li>Follow the instructions carefully.</li>
                     <li>Submit your assignment by following one of the two methods</li>
                     <li className="ml-6">○ Upload a file (ZIP, PDF, DOC, etc.)</li>
                     <li className="ml-6">○ Share a public URL (GitHub, Google Drive, etc.)</li>
                     <li>Add any comments or notes in the comment field below.</li>
                  </ul>
               </div>

               <AssignmentSubmissionForm assignment={assignment} setDialogOpen={setDialogOpen} />
            </>
         )}
      </div>
   );
};

export default AssignmentSubmission;
