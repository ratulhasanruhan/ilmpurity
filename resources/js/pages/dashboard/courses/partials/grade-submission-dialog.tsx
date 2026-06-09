import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { format } from 'date-fns';
import { AlertCircle, Calendar, CheckCircle, Clock, Download, ExternalLink, FileText, Star } from 'lucide-react';
import { useState } from 'react';
import AssignmentGradeForm from './forms/assignment-grade-form';

interface Props {
   submission: AssignmentSubmission;
}

const GradeSubmissionDialog = ({ submission }: Props) => {
   const [open, setOpen] = useState(false);
   const isLate = submission.is_late;
   const isGraded = submission.status === 'graded';
   const totalMarks = isLate ? submission.assignment?.late_total_mark || 0 : submission.assignment?.total_mark || 0;

   // Format date
   const formatDate = (dateString: string) => {
      return format(new Date(dateString), 'MMMM dd, yyyy, hh:mm a');
   };

   return (
      <Dialog open={open} onOpenChange={setOpen}>
         <DialogTrigger asChild>
            <Button variant="secondary" size="sm" className="gap-2">
               <Star className="h-4 w-4" />
               <span>{isGraded ? 'Review' : 'Grade'}</span>
            </Button>
         </DialogTrigger>
         <DialogContent className="max-h-[90vh] max-w-4xl p-0">
            <ScrollArea className="max-h-[90vh]">
               <div className="p-6">
                  <DialogHeader className="mb-6">
                     <DialogTitle className="text-lg">{isGraded ? 'Review Submission' : 'Grade Submission'}</DialogTitle>
                  </DialogHeader>

                  <div className="space-y-6">
                     {/* Student Information */}
                     {/* <div className="bg-muted/50 rounded-lg p-4">
                        <h3 className="mb-3 flex items-center gap-2 font-semibold">
                           <User className="text-primary h-5 w-5" />
                           Student Information
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                           <div>
                              <p className="text-muted-foreground text-sm">Name</p>
                              <p className="font-medium">{submission.student?.name || 'N/A'}</p>
                           </div>
                           <div>
                              <p className="text-muted-foreground text-sm">Email</p>
                              <p className="font-medium">{submission.student?.email || 'N/A'}</p>
                           </div>
                        </div>
                     </div> */}

                     {isLate && (
                        <div className="bg-destructive/10 mt-2 rounded-lg p-3">
                           <div className="text-destructive flex items-center gap-2 text-sm font-medium">
                              <AlertCircle className="h-4 w-4" />
                              <p>Late Submission</p>
                           </div>
                           <p className="text-muted-foreground mt-1 text-xs">
                              Maximum marks is considered as {submission.assignment?.late_total_mark}{' '}
                              {submission.is_late ? 'for late submission' : ''}
                           </p>
                        </div>
                     )}

                     {/* Assignment Information */}
                     <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center gap-3 rounded-lg border p-4">
                           <Calendar className="text-primary h-5 w-5" />
                           <div>
                              <p className="text-muted-foreground text-sm">Submitted At</p>
                              <p className="text-sm font-medium">{formatDate(submission.submitted_at)}</p>
                           </div>
                        </div>
                        <div className="flex items-center gap-3 rounded-lg border p-4">
                           <FileText className="text-primary h-5 w-5" />
                           <div>
                              <p className="text-muted-foreground text-sm">Assignment</p>
                              <p className="font-medium">{submission.assignment?.title || 'N/A'}</p>
                           </div>
                        </div>
                        <div className="flex items-center gap-3 rounded-lg border p-4">
                           <CheckCircle className="text-primary h-5 w-5" />
                           <div>
                              <p className="text-muted-foreground text-sm">Total Marks</p>
                              <p className="font-medium">
                                 {totalMarks}
                                 {isLate && (
                                    <span className="text-muted-foreground ml-1 text-xs">(Late: {submission.assignment?.late_total_mark})</span>
                                 )}
                              </p>
                           </div>
                        </div>
                        <div className="flex items-center gap-3 rounded-lg border p-4">
                           <Clock className="text-primary h-5 w-5" />
                           <div>
                              <p className="text-muted-foreground text-sm">Attempt Number</p>
                              <Badge variant="outline">Attempt #{submission.attempt_number}</Badge>
                           </div>
                        </div>
                     </div>

                     {/* Submission Content */}
                     <div className="space-y-4 rounded-lg border p-4">
                        <h3 className="font-semibold">Submission Details</h3>

                        {/* Attachment */}
                        <div>
                           <p className="mb-2 text-sm font-medium">Submitted {submission.attachment_type === 'url' ? 'URL' : 'File'}:</p>
                           {submission.attachment_type === 'url' ? (
                              <a
                                 href={submission.attachment_path}
                                 target="_blank"
                                 rel="noopener noreferrer"
                                 className="text-primary flex items-center gap-2 hover:underline"
                              >
                                 <ExternalLink className="h-4 w-4" />
                                 {submission.attachment_path}
                              </a>
                           ) : (
                              <Button variant="outline" size="sm" className="gap-2" asChild>
                                 <a href={submission.attachment_path} download>
                                    <Download className="h-4 w-4" />
                                    Download Submission File
                                 </a>
                              </Button>
                           )}
                        </div>

                        {/* Comment */}
                        {submission.comment && (
                           <div>
                              <p className="mb-2 text-sm font-medium">Student Comment:</p>
                              <p className="text-muted-foreground bg-muted rounded-lg p-3 text-sm">{submission.comment}</p>
                           </div>
                        )}
                     </div>

                     {/* Grading Form */}
                     <AssignmentGradeForm isGraded={isGraded} isLate={isLate} totalMarks={totalMarks} submission={submission} />
                  </div>
               </div>
            </ScrollArea>
         </DialogContent>
      </Dialog>
   );
};

export default GradeSubmissionDialog;
