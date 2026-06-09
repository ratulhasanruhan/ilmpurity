import { Badge } from '@/components/ui/badge';
import { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { AlertCircle, Clock } from 'lucide-react';
import AssignmentDialog from './assignment-dialog';

// Function to format date
const formatDate = (dateString: string | undefined) => {
   if (!dateString) return 'N/A';
   const date = new Date(dateString);
   return format(date, 'MMMM dd, yyyy, hh:mm a');
};

// Function to check if deadline has passed
const isDeadlinePassed = (deadline: string) => {
   if (!deadline) return false;
   return new Date() > new Date(deadline);
};

// Function to get submission status
const getSubmissionStatus = (assignment: CourseAssignment) => {
   if (!assignment.submissions || assignment.submissions.length === 0) {
      return { status: 'not_submitted', label: 'Not Submitted', variant: 'secondary' as const };
   }

   const latestSubmission = assignment.submissions[0];

   if (latestSubmission.status === 'graded') {
      return { status: 'graded', label: 'Graded', variant: 'default' as const };
   } else if (latestSubmission.is_late) {
      return { status: 'late', label: 'Late Submission', variant: 'destructive' as const };
   } else {
      return { status: 'submitted', label: 'Submitted', variant: 'default' as const };
   }
};

export const AssignmentColumns: ColumnDef<CourseAssignment>[] = [
   {
      accessorKey: 'title',
      header: 'Title',
      cell: ({ row }) => {
         const assignment = row.original;
         return (
            <div className="space-y-1 py-1">
               <p className="font-medium">{assignment.title}</p>
               <div className="text-muted-foreground flex items-center gap-4 text-sm">
                  <span>Total Marks: {assignment.total_mark}</span>
                  <span>Pass Marks: {assignment.pass_mark}</span>
               </div>
            </div>
         );
      },
   },
   {
      accessorKey: 'deadline',
      header: 'Deadline',
      cell: ({ row }) => {
         const assignment = row.original;
         const deadlinePassed = isDeadlinePassed(assignment.deadline);

         return (
            <div className="flex items-center gap-2 py-1">
               {deadlinePassed ? <AlertCircle className="text-destructive h-4 w-4" /> : <Clock className="text-muted-foreground h-4 w-4" />}
               <span className={deadlinePassed ? 'text-destructive' : ''}>{formatDate(assignment.deadline)}</span>
            </div>
         );
      },
   },
   {
      accessorKey: 'marks_obtained',
      header: () => <div className="text-center">Obtained Marks</div>,
      cell: ({ row }) => {
         const assignment = row.original;
         const hasSubmission = assignment.submissions && assignment.submissions.length > 0;
         const latestSubmission = hasSubmission ? assignment.submissions[0] : null;

         const isGraded = latestSubmission?.status === 'graded';
         const isLate = latestSubmission?.is_late;

         // Determine total marks based on late submission
         const totalMarks = isLate ? assignment.late_total_mark || 0 : assignment.total_mark || 0;

         return (
            <div className="py-1 text-center">
               {isGraded ? (
                  <div>
                     <p className="font-semibold">
                        {latestSubmission?.marks_obtained} / {totalMarks}
                     </p>
                     {isLate && <p className="text-muted-foreground text-xs">(Late: Max {latestSubmission?.assignment?.late_total_mark})</p>}
                  </div>
               ) : (
                  <div>
                     <p className="text-muted-foreground text-sm">Not Graded</p>
                     <p className="text-muted-foreground text-xs">Max: {totalMarks}</p>
                  </div>
               )}
            </div>
         );
      },
   },
   {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
         const assignment = row.original;
         const submissionStatus = getSubmissionStatus(assignment);

         return (
            <div className="py-1">
               <Badge variant={submissionStatus.variant}>{submissionStatus.label}</Badge>
            </div>
         );
      },
   },
   {
      id: 'actions',
      header: () => <div className="text-right">Action</div>,
      cell: ({ row }) => {
         const assignment = row.original;

         return (
            <div className="flex justify-end py-1">
               <AssignmentDialog assignment={assignment} />
            </div>
         );
      },
   },
];
