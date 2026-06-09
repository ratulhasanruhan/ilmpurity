import { Badge } from '@/components/ui/badge';
import { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import GradeSubmissionDialog from './grade-submission-dialog';

const SubmissionsTableColumn = (translate: LanguageTranslations): ColumnDef<AssignmentSubmission>[] => {
   const { table } = translate;

   return [
      {
         accessorKey: 'student',
         header: 'Student Name',
         cell: ({ row }) => {
            const student = row.original.student;
            return (
               <div className="py-1">
                  <p className="font-medium">{student?.name || 'N/A'}</p>
                  <p className="text-muted-foreground text-xs">{student?.email || ''}</p>
               </div>
            );
         },
      },
      {
         accessorKey: 'is_late',
         header: () => <div className="text-center">Submission</div>,
         cell: ({ row }) => {
            const isLate = row.getValue('is_late') as boolean;
            return (
               <div className="py-1 text-center">
                  <Badge variant={isLate ? 'destructive' : 'default'}>{isLate ? 'Late Submission' : 'On Time'}</Badge>
               </div>
            );
         },
      },
      // {
      //    accessorKey: 'attachment_path',
      //    header: 'Submission',
      //    cell: ({ row }) => {
      //       const submission = row.original;
      //       return (
      //          <div className="py-1">
      //             {submission.attachment_type === 'url' ? (
      //                <a
      //                   target="_blank"
      //                   rel="noopener noreferrer"
      //                   href={submission.attachment_path}
      //                   className="text-primary flex items-center gap-1 text-sm hover:underline"
      //                >
      //                   <ExternalLink className="h-3 w-3" />
      //                   View URL
      //                </a>
      //             ) : (
      //                <a href={submission.attachment_path} download className="text-primary flex items-center gap-1 text-sm hover:underline">
      //                   <FileText className="h-3 w-3" />
      //                   Download File
      //                </a>
      //             )}
      //          </div>
      //       );
      //    },
      // },
      {
         accessorKey: 'submitted_at',
         header: 'Submitted At',
         cell: ({ row }) => {
            const date = row.getValue('submitted_at') as string;
            return (
               <div className="py-1 text-sm">
                  <p>{format(new Date(date), 'MMM dd, yyyy')}</p>
                  <p className="text-muted-foreground text-xs">{format(new Date(date), 'hh:mm a')}</p>
               </div>
            );
         },
      },
      {
         accessorKey: 'status',
         header: () => <div className="text-center">Status</div>,
         cell: ({ row }) => {
            const status = row.getValue('status') as string;
            const isLate = row.original.is_late;

            const getVariant = () => {
               if (status === 'graded') return 'default';
               if (isLate) return 'destructive';
               return 'secondary';
            };

            const getLabel = () => {
               if (status === 'graded') return 'Graded';
               if (isLate) return 'Late';
               return 'Pending';
            };

            return (
               <div className="py-1 text-center">
                  <Badge variant={getVariant()}>{getLabel()}</Badge>
               </div>
            );
         },
      },
      {
         accessorKey: 'marks_obtained',
         header: () => <div className="text-center">Marks</div>,
         cell: ({ row }) => {
            const marks = row.getValue('marks_obtained') as number;
            const submission = row.original;
            const isGraded = submission.status === 'graded';
            const isLate = submission.is_late;

            // Determine total marks based on late submission
            const totalMarks = isLate ? submission.assignment?.late_total_mark || 0 : submission.assignment?.total_mark || 0;

            return (
               <div className="py-1 text-center">
                  {isGraded ? (
                     <div>
                        <p className="font-semibold">
                           {marks} / {totalMarks}
                        </p>
                        {isLate && <p className="text-muted-foreground text-xs">(Late: Max {submission.assignment?.late_total_mark})</p>}
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
         id: 'actions',
         header: () => <div className="text-end">{table.action}</div>,
         cell: ({ row }) => {
            const submission = row.original;

            return (
               <div className="flex justify-end gap-2 py-1">
                  <GradeSubmissionDialog submission={submission} />
               </div>
            );
         },
      },
   ];
};

export default SubmissionsTableColumn;
