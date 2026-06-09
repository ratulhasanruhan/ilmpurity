import QuestionAnswerResult from '@/components/exam/question-answer-result';
import QuestionStatusBadge from '@/components/exam/question-status-badge';
import QuestionStatusIcon from '@/components/exam/question-status-icon';
import QuestionTypeBadge from '@/components/exam/question-type-badge';
import TiptapRenderer from '@/components/text-editor/tiptap-renderer/server-renderer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Link, router } from '@inertiajs/react';
import { ArrowLeft, Clock } from 'lucide-react';
import { useState } from 'react';

interface AttemptAnswerWithQuestion extends ExamAttemptAnswer {
   exam_question: ExamQuestion;
}

const ExamAttemptReview = ({ attempt }: { attempt: ExamAttempt }) => {
   const [manualGrades, setManualGrades] = useState<Record<number, number>>({});
   const [submitting, setSubmitting] = useState(false);
   const answers = attempt.attempt_answers ?? [];

   const safeQuestion = (answer: AttemptAnswerWithQuestion) => answer.exam_question ?? ({} as ExamQuestion);

   const handleManualGradeChange = (questionId: number, value: string) => {
      const numValue = parseFloat(value) || 0;
      setManualGrades((prev) => ({
         ...prev,
         [questionId]: numValue,
      }));
   };

   const handleSubmitGrades = () => {
      setSubmitting(true);
      router.post(
         route('exam-attempts.grade', attempt.id),
         {
            manual_grades: manualGrades,
         },
         {
            preserveScroll: true,
            onSuccess: () => {
               setSubmitting(false);
               setManualGrades({});
            },
            onError: () => {
               setSubmitting(false);
            },
         },
      );
   };

   const needsManualGrading = answers.some((answer) => {
      const question = safeQuestion(answer);
      return question.question_type === 'listening' || question.question_type === 'short_answer';
   });

   if (!attempt) {
      return (
         <div className="flex h-full items-center justify-center p-10">
            <div className="text-center">
               <h1 className="text-2xl font-semibold text-gray-800">Attempt data unavailable</h1>
               <p className="mt-2 text-sm text-gray-600">Please return to the exam list and try again.</p>
               <div className="mt-4">
                  <Link href={route('student.index', 'exams')}>
                     <Button variant="outline">Back to My Exams</Button>
                  </Link>
               </div>
            </div>
         </div>
      );
   }

   return (
      <div className="space-y-6">
         {/* Question-wise Analysis */}
         <Card>
            <CardHeader>
               <div className="flex items-center justify-between">
                  <CardTitle>Detailed Analysis</CardTitle>
                  {/* <h6 className="text-xl font-semibold">Attempt {attempt.attempt_number} Result</h6> */}

                  <Button asChild variant="outline">
                     <Link href={route('exams.edit', { exam: attempt.exam_id, tab: 'attempts' })}>
                        <ArrowLeft className="h-4 w-4" />
                        Back Attempts
                     </Link>
                  </Button>
               </div>
            </CardHeader>
            <CardContent>
               <div className="space-y-6">
                  {answers.map((answer, index) => {
                     const question = safeQuestion(answer);
                     const questionId = question.id as number;

                     return (
                        <div key={answer.id ?? index} className="overflow-hidden rounded-lg border-2 border-gray-200 bg-white">
                           {/* Question Header */}
                           <div className="border-b border-gray-200 bg-gray-50 p-4">
                              <div className="flex items-start justify-between gap-4">
                                 <div className="flex flex-1 items-start gap-3">
                                    <div className="mt-1 flex-shrink-0">
                                       <QuestionStatusIcon answer={answer} />
                                    </div>
                                    <div className="flex-1">
                                       <div className="mb-2 flex flex-wrap items-center gap-2">
                                          <span className="text-lg font-semibold">Question {index + 1}</span>
                                          {question.question_type && <QuestionTypeBadge type={question.question_type as ExamQuestionType} />}
                                          <QuestionStatusBadge answer={answer} />
                                       </div>
                                       <p className="text-sm font-medium text-gray-700">{question.title}</p>
                                    </div>
                                 </div>
                                 <div className="flex-shrink-0 text-right">
                                    <p className="text-lg font-bold text-gray-900">
                                       {answer.marks_obtained || 0}/{question.marks || 0}
                                    </p>
                                    <p className="text-xs text-gray-500">marks</p>
                                 </div>
                              </div>
                           </div>

                           {/* Question Content */}
                           <div className="p-4">
                              {question.description && <TiptapRenderer>{question.description}</TiptapRenderer>}

                              {/* Render Question with Answer */}
                              <div className="mb-4">
                                 <QuestionAnswerResult answer={answer} question={question} />
                              </div>

                              {/* Manual Grading Section for listening and short_answer */}
                              {(question.question_type === 'listening' || question.question_type === 'short_answer') && (
                                 <div className="mt-4 rounded-lg border-t border-gray-200 bg-yellow-50 p-4 pt-4">
                                    <Label htmlFor={`grade-${questionId}`} className="text-sm font-semibold text-gray-700">
                                       Assign Marks (Max: {question.marks || 0})
                                    </Label>
                                    <Input
                                       id={`grade-${questionId}`}
                                       type="number"
                                       min="0"
                                       max={question.marks || 0}
                                       step="0.5"
                                       placeholder="Enter marks"
                                       value={manualGrades[questionId] ?? answer.marks_obtained ?? ''}
                                       onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleManualGradeChange(questionId, e.target.value)}
                                       className="mt-1 w-full"
                                    />

                                    {answer.is_correct === null && (
                                       <p className="mt-2 flex items-center gap-1 text-xs text-yellow-700">
                                          <Clock className="h-3 w-3" />
                                          This question requires manual grading
                                       </p>
                                    )}
                                 </div>
                              )}
                           </div>
                        </div>
                     );
                  })}
               </div>
            </CardContent>
         </Card>

         {/* Submit Grades Button */}
         {needsManualGrading && (
            <div className="flex justify-end gap-4">
               <Button variant="outline" onClick={() => window.history.back()}>
                  Cancel
               </Button>
               <Button onClick={handleSubmitGrades} disabled={submitting || Object.keys(manualGrades).length === 0}>
                  {submitting ? 'Submitting...' : 'Submit Grades'}
               </Button>
            </div>
         )}
      </div>
   );
};

export default ExamAttemptReview;
