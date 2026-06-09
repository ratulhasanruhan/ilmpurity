import DynamicCertificate from '@/components/dynamic-certificate';
import DynamicMarksheet from '@/components/dynamic-marksheet';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { StudentExamProps } from '@/types/page';
import { usePage } from '@inertiajs/react';
import { format } from 'date-fns';
import { Award, ClipboardList, Lock } from 'lucide-react';

const ExamCertificate = () => {
   const { props } = usePage<StudentExamProps>();
   const { exam, bestAttempt, certificateTemplate, marksheetTemplate, studentMarks, auth } = props;
   console.log(bestAttempt);

   // Check if exam is passed
   const isPassed = bestAttempt?.is_passed || false;
   const hasCompletedAttempt = bestAttempt?.status === 'completed';

   if (!hasCompletedAttempt) {
      return (
         <Alert>
            <Lock className="h-4 w-4" />
            <AlertTitle>Certificate & Marksheet Locked</AlertTitle>
            <AlertDescription>Complete at least one exam attempt to unlock your certificate and marksheet.</AlertDescription>
         </Alert>
      );
   }

   if (!isPassed) {
      return (
         <Alert>
            <Lock className="h-4 w-4" />
            <AlertTitle>Certificate & Marksheet Locked</AlertTitle>
            <AlertDescription>You need to pass the exam to unlock your certificate and marksheet.</AlertDescription>
         </Alert>
      );
   }

   const completionDate = bestAttempt?.end_time ? format(new Date(bestAttempt.end_time), 'MMMM d, yyyy') : format(new Date(), 'MMMM d, yyyy');

   // Check if both are unavailable
   if (!certificateTemplate && !marksheetTemplate) {
      return (
         <div className="p-6">
            <Card>
               <CardContent className="flex flex-col items-center justify-center p-12 text-center">
                  <Award className="text-muted-foreground mb-4 h-16 w-16" />
                  <h3 className="mb-2 text-xl font-semibold">No Certificate or Marksheet Available</h3>
                  <p className="text-muted-foreground">The instructor hasn't set up certificates or marksheets for this exam yet.</p>
               </CardContent>
            </Card>
         </div>
      );
   }

   return (
      <div>
         <Tabs defaultValue="certificate" className="w-full">
            <TabsList className="mb-6 grid h-11 w-full grid-cols-2">
               <TabsTrigger value="certificate" className="flex h-9 cursor-pointer items-center gap-2">
                  <Award className="h-4 w-4" />
                  Certificate
               </TabsTrigger>
               <TabsTrigger disabled value="" className="flex h-9 cursor-pointer items-center gap-2">
                  <ClipboardList className="h-4 w-4" />
                  Marksheet
               </TabsTrigger>
            </TabsList>

            <TabsContent value="certificate">
               {!certificateTemplate ? (
                  <Card>
                     <CardContent className="flex flex-col items-center justify-center p-12 text-center">
                        <Award className="text-muted-foreground mb-4 h-16 w-16" />
                        <h3 className="mb-2 text-xl font-semibold">No Certificate Available</h3>
                        <p className="text-muted-foreground">The instructor hasn't set up certificates for this exam yet.</p>
                     </CardContent>
                  </Card>
               ) : (
                  <DynamicCertificate
                     template={certificateTemplate}
                     courseName={exam.title}
                     studentName={auth.user.name}
                     completionDate={completionDate}
                  />
               )}
            </TabsContent>

            <TabsContent value="marksheet">
               {!marksheetTemplate || !studentMarks ? (
                  <Card>
                     <CardContent className="flex flex-col items-center justify-center p-12 text-center">
                        <ClipboardList className="text-muted-foreground mb-4 h-16 w-16" />
                        <h3 className="mb-2 text-xl font-semibold">No Marksheet Available</h3>
                        <p className="text-muted-foreground">
                           {!marksheetTemplate
                              ? "The instructor hasn't set up marksheets for this exam yet."
                              : 'No marks data available. Complete exam attempts to view your marksheet.'}
                        </p>
                     </CardContent>
                  </Card>
               ) : (
                  <DynamicMarksheet
                     template={marksheetTemplate}
                     courseName={exam.title}
                     studentName={auth.user.name}
                     completionDate={completionDate}
                     studentMarks={studentMarks}
                  />
               )}
            </TabsContent>
         </Tabs>
      </div>
   );
};

export default ExamCertificate;
