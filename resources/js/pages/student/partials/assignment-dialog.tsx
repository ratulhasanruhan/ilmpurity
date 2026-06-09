import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CheckCircle } from 'lucide-react';
import { useState } from 'react';
import AssignmentDetails from '../tabs-content/assignment-details';
import AssignmentSubmission from '../tabs-content/assignment-submission';

interface Props {
   assignment: CourseAssignment;
}

const AssignmentDialog = ({ assignment }: Props) => {
   const [open, setOpen] = useState(false);
   const hasSubmission = assignment.submissions && assignment.submissions.length > 0;

   // Check if deadline passed
   const isDeadlinePassed = (deadline: string | undefined) => {
      if (!deadline) return false;
      return new Date() > new Date(deadline);
   };

   const deadlinePassed = isDeadlinePassed(assignment.deadline);

   return (
      <Dialog open={open} onOpenChange={setOpen}>
         <DialogTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 gap-2">
               {hasSubmission ? (
                  <>
                     <CheckCircle className="h-4 w-4" />
                     <span>Check</span>
                  </>
               ) : (
                  <span>Submit</span>
               )}
            </Button>
         </DialogTrigger>

         <DialogContent className="max-h-[90vh] max-w-4xl p-0">
            <Tabs defaultValue="details" className="w-full">
               <DialogHeader className="p-6 pb-0">
                  <TabsList className="grid h-11 w-full grid-cols-2">
                     <TabsTrigger value="details" className="h-9">
                        Assignment Details
                     </TabsTrigger>
                     <TabsTrigger value={deadlinePassed ? '' : 'submit'} className="h-9" disabled={deadlinePassed}>
                        Assignment Submission
                     </TabsTrigger>
                  </TabsList>
               </DialogHeader>

               <div className="max-h-[calc(90vh-92px)] overflow-y-auto p-6">
                  {/* Assignment Details Tab */}
                  <TabsContent value="details" className="m-0">
                     <AssignmentDetails assignment={assignment} deadlinePassed={deadlinePassed} />
                  </TabsContent>

                  {/* Submit Assignment Tab */}
                  {!deadlinePassed && (
                     <TabsContent value="submit" className="m-0">
                        <AssignmentSubmission assignment={assignment} setDialogOpen={setOpen} />
                     </TabsContent>
                  )}
               </div>
            </Tabs>
         </DialogContent>
      </Dialog>
   );
};

export default AssignmentDialog;
