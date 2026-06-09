import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { CoursePlayerProps } from '@/types/page';
import { usePage } from '@inertiajs/react';
import { Award, CheckCircle2, Eye, Target, XCircle } from 'lucide-react';
import { useState } from 'react';

interface Props {
   quiz: SectionQuiz;
   submission: QuizSubmission;
}

const QuizResultDialog = ({ quiz, submission }: Props) => {
   const [open, setOpen] = useState(false);
   const { props } = usePage<CoursePlayerProps>();
   const { translate } = props;
   const { frontend } = translate;

   const isPassed = submission.is_passed;
   const percentage = Math.round((submission.total_marks / quiz.total_mark) * 100);

   // Helper function to parse JSON strings
   const parseJSON = (data: any): string[] => {
      if (typeof data === 'string') {
         try {
            return JSON.parse(data);
         } catch {
            return [];
         }
      }
      return Array.isArray(data) ? data : [];
   };

   // Helper function to check if answer is correct
   const isAnswerCorrect = (question: QuizQuestion): boolean => {
      const userAnswer = question.answers && question.answers.length > 0 ? question.answers[0] : null;
      if (!userAnswer) return false;
      return userAnswer.is_correct;
   };

   // Helper function to get user's answer
   const getUserAnswer = (question: QuizQuestion): string[] => {
      const userAnswer = question.answers && question.answers.length > 0 ? question.answers[0] : null;
      if (!userAnswer) return [];
      return parseJSON(userAnswer.answers);
   };

   // Helper function to render HTML content
   const renderHTML = (html: string) => {
      return <div dangerouslySetInnerHTML={{ __html: html }} />;
   };

   return (
      <Dialog open={open} onOpenChange={setOpen}>
         <DialogTrigger asChild>
            <Button variant="secondary" size="sm" className="text-sm">
               <Eye className="h-4 w-4" />
               <span>{frontend.result}</span>
            </Button>
         </DialogTrigger>
         <DialogContent className="max-w-4xl p-0">
            <ScrollArea className="max-h-[90vh] p-6">
               <DialogHeader>
                  <DialogTitle className="text-xl">{quiz.title}</DialogTitle>
               </DialogHeader>

               {/* Quiz Statistics */}
               <div className="grid grid-cols-2 gap-4">
                  <Card className={isPassed ? 'border-green-500' : 'border-red-500'}>
                     <CardContent className="flex items-center gap-2 p-4">
                        <Award className={`h-8 w-8 ${isPassed ? 'text-green-500' : 'text-red-500'}`} />
                        <div>
                           <p className="text-2xl font-bold">{percentage}%</p>
                           <p className="text-muted-foreground text-xs">Total Score</p>
                        </div>
                     </CardContent>
                  </Card>

                  <Card>
                     <CardContent className="flex items-center gap-3 p-4">
                        <Target className="h-8 w-8 text-blue-500" />
                        <div>
                           <p className="text-2xl font-bold">
                              {submission.total_marks}/{quiz.total_mark}
                           </p>
                           <p className="text-muted-foreground text-xs">{frontend.total_marks}</p>
                        </div>
                     </CardContent>
                  </Card>

                  <Card>
                     <CardContent className="flex items-center gap-3 p-4">
                        <CheckCircle2 className="h-8 w-8 text-green-500" />
                        <div>
                           <p className="text-2xl font-bold">{submission.correct_answers}</p>
                           <p className="text-muted-foreground text-xs">{frontend.correct_answers}</p>
                        </div>
                     </CardContent>
                  </Card>

                  <Card>
                     <CardContent className="flex items-center gap-3 p-4">
                        <XCircle className="h-8 w-8 text-red-500" />
                        <div>
                           <p className="text-2xl font-bold">{submission.incorrect_answers}</p>
                           <p className="text-muted-foreground text-xs">{frontend.incorrect_answers}</p>
                        </div>
                     </CardContent>
                  </Card>
               </div>

               {/* Questions and Answers */}
               <div className="mt-6 space-y-4">
                  <h3 className="text-lg font-semibold">Quiz Questions</h3>

                  {quiz.quiz_questions &&
                     quiz.quiz_questions.map((question, index) => {
                        const isCorrect = isAnswerCorrect(question);
                        const userAnswers = getUserAnswer(question);
                        const correctAnswers = parseJSON(question.answer);
                        const options = parseJSON(question.options);

                        return (
                           <Card key={question.id} className={isCorrect ? 'border-l-green-500' : 'border-l-red-500'}>
                              <CardContent className="p-4">
                                 {/* Question Header */}
                                 <div className="mb-3 flex items-start justify-between">
                                    <div className="flex-1">
                                       <div className="mb-2 flex items-center gap-2">
                                          <span className="font-semibold">{index + 1}.</span>
                                          <div className="flex-1">{renderHTML(question.title)}</div>
                                       </div>
                                    </div>
                                    <Badge variant={isCorrect ? 'default' : 'destructive'} className="ml-2">
                                       {isCorrect ? <CheckCircle2 className="mr-1 h-3 w-3" /> : <XCircle className="mr-1 h-3 w-3" />}
                                       {isCorrect ? 'Correct' : 'Wrong'}
                                    </Badge>
                                 </div>

                                 {/* Options for single/multiple choice */}
                                 {(question.type === 'single' || question.type === 'multiple') && (
                                    <div className="space-y-2">
                                       {options.map((option, optIndex) => {
                                          const isUserAnswer = userAnswers.includes(option);
                                          const isCorrectAnswer = correctAnswers.includes(option);

                                          return (
                                             <div
                                                key={optIndex}
                                                className={`rounded-md border p-3 ${
                                                   isCorrectAnswer
                                                      ? 'border-green-500 bg-green-50 dark:bg-green-950/20'
                                                      : isUserAnswer
                                                        ? 'border-red-500 bg-red-50 dark:bg-red-950/20'
                                                        : 'bg-muted/50'
                                                }`}
                                             >
                                                <div className="flex items-center justify-between">
                                                   <span>{option}</span>
                                                   <div className="flex gap-2">
                                                      {isUserAnswer && (
                                                         <Badge variant="outline" className="text-xs">
                                                            Your Answer
                                                         </Badge>
                                                      )}
                                                      {isCorrectAnswer && <CheckCircle2 className="h-4 w-4 text-green-600" />}
                                                   </div>
                                                </div>
                                             </div>
                                          );
                                       })}
                                    </div>
                                 )}

                                 {/* Boolean type */}
                                 {question.type === 'boolean' && (
                                    <div className="space-y-2">
                                       {['True', 'False'].map((option) => {
                                          const isUserAnswer = userAnswers.includes(option);
                                          const isCorrectAnswer = correctAnswers.includes(option);

                                          return (
                                             <div
                                                key={option}
                                                className={`rounded-md border p-3 ${
                                                   isCorrectAnswer
                                                      ? 'border-green-500 bg-green-50 dark:bg-green-950/20'
                                                      : isUserAnswer
                                                        ? 'border-red-500 bg-red-50 dark:bg-red-950/20'
                                                        : 'bg-muted/50'
                                                }`}
                                             >
                                                <div className="flex items-center justify-between">
                                                   <span>{option}</span>
                                                   <div className="flex gap-2">
                                                      {isUserAnswer && (
                                                         <Badge variant="outline" className="text-xs">
                                                            Your Answer
                                                         </Badge>
                                                      )}
                                                      {isCorrectAnswer && <CheckCircle2 className="h-4 w-4 text-green-600" />}
                                                   </div>
                                                </div>
                                             </div>
                                          );
                                       })}
                                    </div>
                                 )}
                              </CardContent>
                           </Card>
                        );
                     })}
               </div>
            </ScrollArea>
         </DialogContent>
      </Dialog>
   );
};

export default QuizResultDialog;
