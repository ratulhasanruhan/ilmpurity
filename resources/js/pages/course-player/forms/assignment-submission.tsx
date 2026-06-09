import InputError from '@/components/input-error';
import LoadingButton from '@/components/loading-button';
import TiptapEditor from '@/components/text-editor/tiptap-editor';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useForm } from '@inertiajs/react';
import { AlertCircle, Calendar, CheckCircle2, Clock, FileText, Upload, XCircle } from 'lucide-react';
import { useState } from 'react';

interface Props {
   assignment: CourseAssignment;
   submissions?: AssignmentSubmission[];
}

const AssignmentSubmission = ({ assignment, submissions = [] }: Props) => {
   const [selectedFile, setSelectedFile] = useState<File | null>(null);
   const latestSubmission = submissions.length > 0 ? submissions[0] : null;

   const { data, setData, post, reset, errors, processing } = useForm({
      course_assignment_id: assignment.id,
      submission_text: '',
      attachment: null as File | null,
   });

   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0] || null;
      setSelectedFile(file);
      setData('attachment', file);
   };

   const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();

      post('/dashboard/assignment/submission', {
         onSuccess: () => {
            reset();
            setSelectedFile(null);
         },
      });
   };

   const isDeadlinePassed = assignment.deadline ? new Date(assignment.deadline) < new Date() : false;
   const isLateDeadlinePassed = assignment.late_deadline ? new Date(assignment.late_deadline) < new Date() : false;
   const canSubmit = !isDeadlinePassed || (assignment.late_submission && !isLateDeadlinePassed);
   const remainingAttempts = assignment.retake - submissions.length;

   const getStatusBadge = (status: string) => {
      switch (status) {
         case 'graded':
            return (
               <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700">
                  <CheckCircle2 className="h-3 w-3" />
                  Graded
               </span>
            );
         case 'pending':
            return (
               <span className="inline-flex items-center gap-1 rounded-full bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-700">
                  <Clock className="h-3 w-3" />
                  Pending
               </span>
            );
         case 'late':
            return (
               <span className="inline-flex items-center gap-1 rounded-full bg-orange-100 px-2 py-1 text-xs font-medium text-orange-700">
                  <AlertCircle className="h-3 w-3" />
                  Late Submission
               </span>
            );
         default:
            return (
               <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700">{status}</span>
            );
      }
   };

   return (
      <div className="mx-auto max-w-4xl space-y-6 p-6">
         {/* Assignment Details */}
         <Card>
            <CardHeader>
               <CardTitle>{assignment.title}</CardTitle>
               <CardDescription>
                  {assignment.summary && <div className="prose prose-sm mt-2 max-w-none" dangerouslySetInnerHTML={{ __html: assignment.summary }} />}
               </CardDescription>
            </CardHeader>
            <CardContent>
               <div className="grid gap-4 sm:grid-cols-2">
                  <div className="flex items-center gap-2">
                     <Calendar className="text-muted-foreground h-4 w-4" />
                     <div>
                        <p className="text-sm font-medium">Deadline</p>
                        <p className="text-muted-foreground text-sm">
                           {assignment.deadline ? new Date(assignment.deadline).toLocaleString() : 'No deadline'}
                        </p>
                     </div>
                  </div>
                  <div className="flex items-center gap-2">
                     <FileText className="text-muted-foreground h-4 w-4" />
                     <div>
                        <p className="text-sm font-medium">Total Marks</p>
                        <p className="text-muted-foreground text-sm">
                           {assignment.total_mark} (Pass: {assignment.pass_mark})
                        </p>
                     </div>
                  </div>
                  <div className="flex items-center gap-2">
                     <Clock className="text-muted-foreground h-4 w-4" />
                     <div>
                        <p className="text-sm font-medium">Attempts</p>
                        <p className="text-muted-foreground text-sm">
                           {submissions.length} / {assignment.retake}
                        </p>
                     </div>
                  </div>
                  {assignment.late_submission && (
                     <div className="flex items-center gap-2">
                        <AlertCircle className="text-muted-foreground h-4 w-4" />
                        <div>
                           <p className="text-sm font-medium">Late Deadline</p>
                           <p className="text-muted-foreground text-sm">
                              {assignment.late_deadline ? new Date(assignment.late_deadline).toLocaleString() : 'N/A'}
                           </p>
                        </div>
                     </div>
                  )}
               </div>
            </CardContent>
         </Card>

         {/* Latest Submission Status */}
         {latestSubmission && (
            <Alert>
               <AlertCircle className="h-4 w-4" />
               <AlertTitle>Latest Submission</AlertTitle>
               <AlertDescription>
                  <div className="mt-2 space-y-2">
                     <div className="flex items-center justify-between">
                        <span>Status: {getStatusBadge(latestSubmission.status)}</span>
                        <span className="text-muted-foreground text-sm">
                           Attempt {latestSubmission.attempt_number} of {assignment.retake}
                        </span>
                     </div>
                     {latestSubmission.marks_obtained !== null && (
                        <p className="text-sm">
                           <strong>Grade:</strong> {latestSubmission.marks_obtained} / {assignment.total_mark}
                        </p>
                     )}
                     {latestSubmission.instructor_feedback && (
                        <div className="bg-muted rounded-md p-3">
                           <p className="text-sm font-medium">Instructor Feedback:</p>
                           <p className="text-muted-foreground text-sm">{latestSubmission.instructor_feedback}</p>
                        </div>
                     )}
                  </div>
               </AlertDescription>
            </Alert>
         )}

         {/* Submission Form */}
         {canSubmit && remainingAttempts > 0 ? (
            <Card>
               <CardHeader>
                  <CardTitle>Submit Assignment</CardTitle>
                  <CardDescription>
                     {isDeadlinePassed && assignment.late_submission
                        ? `Late submission allowed until ${new Date(assignment.late_deadline!).toLocaleString()}`
                        : `You have ${remainingAttempts} attempt(s) remaining`}
                  </CardDescription>
               </CardHeader>
               <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                     <div>
                        <Label htmlFor="submission_text">Your Answer</Label>
                        <TiptapEditor
                           ssr={true}
                           output="html"
                           placeholder={{
                              paragraph: 'Type your assignment answer here...',
                              imageCaption: 'Add caption (optional)',
                           }}
                           contentMinHeight={200}
                           contentMaxHeight={500}
                           initialContent={data.submission_text}
                           onContentChange={(value) =>
                              setData((prev) => ({
                                 ...prev,
                                 submission_text: value as string,
                              }))
                           }
                        />
                        <InputError message={errors.submission_text} />
                     </div>

                     <div>
                        <Label htmlFor="attachment">Attach File (Optional)</Label>
                        <div className="mt-2">
                           <label
                              htmlFor="attachment"
                              className="flex cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 px-6 py-8 hover:border-gray-400 hover:bg-gray-100"
                           >
                              <div className="space-y-2 text-center">
                                 <Upload className="mx-auto h-12 w-12 text-gray-400" />
                                 <div className="text-sm text-gray-600">
                                    <span className="font-semibold">Click to upload</span> or drag and drop
                                 </div>
                                 <p className="text-xs text-gray-500">PDF, DOC, DOCX, TXT, ZIP, JPG, PNG (MAX 10MB)</p>
                              </div>
                              <input
                                 id="attachment"
                                 type="file"
                                 className="hidden"
                                 onChange={handleFileChange}
                                 accept=".pdf,.doc,.docx,.txt,.zip,.jpg,.jpeg,.png"
                              />
                           </label>
                           {selectedFile && (
                              <div className="bg-muted mt-2 flex items-center justify-between rounded-md p-3">
                                 <span className="text-sm">{selectedFile.name}</span>
                                 <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => {
                                       setSelectedFile(null);
                                       setData('attachment', null);
                                    }}
                                 >
                                    <XCircle className="h-4 w-4" />
                                 </Button>
                              </div>
                           )}
                        </div>
                        <InputError message={errors.attachment} />
                     </div>

                     <div className="flex justify-end gap-2 pt-4">
                        <Button type="button" variant="outline" onClick={() => reset()}>
                           Reset
                        </Button>
                        <LoadingButton loading={processing} disabled={!data.submission_text && !data.attachment}>
                           Submit Assignment
                        </LoadingButton>
                     </div>
                  </form>
               </CardContent>
            </Card>
         ) : (
            <Alert variant="destructive">
               <AlertCircle className="h-4 w-4" />
               <AlertTitle>Cannot Submit</AlertTitle>
               <AlertDescription>
                  {remainingAttempts <= 0 ? 'You have used all your attempts for this assignment.' : 'The deadline for this assignment has passed.'}
               </AlertDescription>
            </Alert>
         )}

         {/* Submission History */}
         {submissions.length > 0 && (
            <Card>
               <CardHeader>
                  <CardTitle>Submission History</CardTitle>
                  <CardDescription>View all your previous submissions</CardDescription>
               </CardHeader>
               <CardContent>
                  <div className="space-y-4">
                     {submissions.map((submission, index) => (
                        <div key={submission.id}>
                           {index > 0 && <Separator className="my-4" />}
                           <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                 <div>
                                    <p className="font-medium">Attempt {submission.attempt_number}</p>
                                    <p className="text-muted-foreground text-sm">
                                       Submitted: {submission.submitted_at ? new Date(submission.submitted_at).toLocaleString() : 'N/A'}
                                    </p>
                                 </div>
                                 {getStatusBadge(submission.status)}
                              </div>
                              {submission.attachment_name && (
                                 <div className="flex items-center gap-2 text-sm">
                                    <FileText className="h-4 w-4" />
                                    <span>{submission.attachment_name}</span>
                                 </div>
                              )}
                              {submission.marks_obtained !== null && (
                                 <div className="bg-muted rounded-md p-3">
                                    <p className="text-sm font-medium">
                                       Grade: {submission.marks_obtained} / {assignment.total_mark}
                                    </p>
                                    {submission.instructor_feedback && (
                                       <p className="text-muted-foreground mt-1 text-sm">{submission.instructor_feedback}</p>
                                    )}
                                 </div>
                              )}
                           </div>
                        </div>
                     ))}
                  </div>
               </CardContent>
            </Card>
         )}
      </div>
   );
};

export default AssignmentSubmission;
