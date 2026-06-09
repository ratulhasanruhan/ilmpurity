import TiptapRenderer from '@/components/text-editor/tiptap-renderer/client-renderer';
import { format } from 'date-fns';
import { AlertCircle, Calendar, CheckCircle, Clock, FileText } from 'lucide-react';

interface Props {
   assignment: CourseAssignment;
   deadlinePassed: boolean;
}

const AssignmentDetails = ({ assignment, deadlinePassed }: Props) => {
   const formatDate = (date: string) => format(new Date(date), 'MMM d, yyyy');

   return (
      <div className="space-y-6">
         {/* Assignment Info */}
         <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-3 rounded-lg border p-4">
               <Calendar className="text-primary h-5 w-5" />
               <div>
                  <p className="text-muted-foreground text-sm">Deadline</p>
                  <p className="font-medium">{formatDate(assignment.deadline)}</p>
               </div>
            </div>
            <div className="flex items-center gap-3 rounded-lg border p-4">
               <FileText className="text-primary h-5 w-5" />
               <div>
                  <p className="text-muted-foreground text-sm">Total Marks</p>
                  <p className="font-medium">{assignment.total_mark}</p>
               </div>
            </div>
            <div className="flex items-center gap-3 rounded-lg border p-4">
               <CheckCircle className="text-primary h-5 w-5" />
               <div>
                  <p className="text-muted-foreground text-sm">Pass Marks</p>
                  <p className="font-medium">{assignment.pass_mark}</p>
               </div>
            </div>
            <div className="flex items-center gap-3 rounded-lg border p-4">
               <Clock className="text-primary h-5 w-5" />
               <div>
                  <p className="text-muted-foreground text-sm">Retake Allowed</p>
                  <p className="font-medium">
                     {assignment.retake} {assignment.retake > 1 ? 'times' : 'time'}
                  </p>
               </div>
            </div>
         </div>

         {/* Deadline Warning */}
         {deadlinePassed && (
            <div className="bg-destructive/10 border-destructive/20 rounded-lg border p-4">
               <div className="text-destructive flex items-center gap-2">
                  <AlertCircle className="h-5 w-5" />
                  <p className="font-medium">Deadline expired</p>
               </div>
               <p className="text-muted-foreground mt-1 text-sm">
                  {assignment.late_submission
                     ? `Late submission is allowed until ${formatDate(assignment.late_deadline || '')} with ${assignment.late_total_mark} marks.`
                     : 'Late submission is not allowed for this assignment.'}
               </p>
            </div>
         )}

         {/* Overview Section */}
         {assignment.summary && (
            <>
               <h3 className="text-lg font-semibold">OVERVIEW</h3>
               <TiptapRenderer>{assignment.summary}</TiptapRenderer>
            </>
         )}
      </div>
   );
};

export default AssignmentDetails;
