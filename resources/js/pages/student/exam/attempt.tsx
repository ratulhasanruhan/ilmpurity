import {
   AlertDialog,
   AlertDialogAction,
   AlertDialogCancel,
   AlertDialogContent,
   AlertDialogDescription,
   AlertDialogFooter,
   AlertDialogHeader,
   AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import Footer from '@/layouts/footer';
import Main from '@/layouts/main';
import { Head, router } from '@inertiajs/react';
import { AlertTriangle, ChevronLeft, ChevronRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import AttemptNavbar from './partials/attempt-navbar';
import QuestionNavigator from './partials/question-navigator';
import QuestionRenderer from './partials/question-renderer';
import TimerComponent from './partials/timer-component';

interface Props {
   attempt: ExamAttempt;
}

const TakeExam = ({ attempt }: Props) => {
   const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
   const [answers, setAnswers] = useState<Record<number, any>>({});
   const [markedQuestions, setMarkedQuestions] = useState<Set<number>>(new Set());
   const [showSubmitDialog, setShowSubmitDialog] = useState(false);
   const [isSubmitting, setIsSubmitting] = useState(false);

   const durationSeconds = ((attempt.exam.duration_hours || 0) * 60 + (attempt.exam.duration_minutes || 0)) * 60;
   const attemptStart = attempt.start_time ? new Date(attempt.start_time).getTime() : Date.now();
   const effectiveDuration = durationSeconds > 0 ? durationSeconds : 60 * 60; // default to 1 hour when not configured
   const computedDeadline = attempt.end_time ? attempt.end_time : new Date(attemptStart + effectiveDuration * 1000).toISOString();

   const questions = attempt.exam.questions || [];
   const currentQuestion = questions[currentQuestionIndex];
   const answeredQuestions = new Set(Object.keys(answers).map(Number));

   // Load saved answers from localStorage
   useEffect(() => {
      const savedAnswers = localStorage.getItem(`exam-attempt-${attempt.id}`);
      if (savedAnswers) {
         try {
            const parsed = JSON.parse(savedAnswers);
            setAnswers(parsed.answers || {});
            setMarkedQuestions(new Set(parsed.marked || []));
         } catch (error) {
            console.error('Failed to load saved answers:', error);
         }
      }
   }, [attempt.id]);

   // Auto-save answers to localStorage every 30 seconds
   useEffect(() => {
      const interval = setInterval(() => {
         saveToLocalStorage();
      }, 30000);

      return () => clearInterval(interval);
   }, [answers, markedQuestions]);

   // Warn before leaving page
   useEffect(() => {
      const handleBeforeUnload = (e: BeforeUnloadEvent) => {
         e.preventDefault();
         e.returnValue = '';
      };

      window.addEventListener('beforeunload', handleBeforeUnload);
      return () => window.removeEventListener('beforeunload', handleBeforeUnload);
   }, []);

   const saveToLocalStorage = () => {
      localStorage.setItem(
         `exam-attempt-${attempt.id}`,
         JSON.stringify({
            answers,
            marked: Array.from(markedQuestions),
            lastSaved: new Date().toISOString(),
         }),
      );
   };

   const saveAnswerToBackend = async (questionId: number, answer: any) => {
      await router.post(
         route('exam-attempts.answer', attempt.id),
         {
            question_id: questionId,
            answer_data: answer,
         },
         {
            preserveScroll: true,
            preserveState: true,
         },
      );
   };

   const handleAnswerChange = (answer: any) => {
      if (!currentQuestion) return;

      setAnswers((prev) => ({
         ...prev,
         [currentQuestion.id]: answer,
      }));

      // Save to backend
      saveAnswerToBackend(currentQuestion.id as number, answer);
      saveToLocalStorage();
   };

   const handlePrevious = () => {
      if (currentQuestionIndex > 0) {
         setCurrentQuestionIndex(currentQuestionIndex - 1);
      }
   };

   const handleNext = () => {
      if (currentQuestionIndex < questions.length - 1) {
         setCurrentQuestionIndex(currentQuestionIndex + 1);
      }
   };

   const handleSubmit = async () => {
      setIsSubmitting(true);
      saveToLocalStorage();

      const formattedAnswers = Object.entries(answers).map(([questionId, value]) => ({
         exam_question_id: Number(questionId),
         answer_data: value,
      }));

      router.post(
         route('exam-attempts.submit', attempt.id),
         {
            exam_attempt_id: attempt.id,
            answers: formattedAnswers,
         },
         {
            onError: (errors) => {
               console.log(errors);
            },
            onSuccess: () => {
               localStorage.removeItem(`exam-attempt-${attempt.id}`);
            },
            onFinish: () => {
               setIsSubmitting(false);
            },
         },
      );
   };

   // Keyboard shortcuts
   useEffect(() => {
      const handleKeyPress = (e: KeyboardEvent) => {
         if (e.key === 'ArrowRight' && currentQuestionIndex < questions.length - 1) {
            handleNext();
         } else if (e.key === 'ArrowLeft' && currentQuestionIndex > 0) {
            handlePrevious();
         }
      };

      window.addEventListener('keydown', handleKeyPress);
      return () => window.removeEventListener('keydown', handleKeyPress);
   }, [currentQuestionIndex, questions.length]);

   const unansweredCount = questions.length - answeredQuestions.size;

   return (
      <Main>
         <Head title={`Taking: ${attempt.exam.title}`} />

         <main className="flex min-h-screen flex-col justify-between overflow-x-hidden">
            <AttemptNavbar attempt={attempt} questionIndex={currentQuestionIndex} />

            <div className="container py-12">
               <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
                     {/* Main Content */}
                     <div className="space-y-4 lg:col-span-3">
                        {/* Timer */}
                        <TimerComponent attempt={attempt} endTime={computedDeadline} questionIndex={currentQuestionIndex} />

                        {/* Question */}
                        {currentQuestion && (
                           <QuestionRenderer
                              question={currentQuestion}
                              questionNumber={currentQuestionIndex + 1}
                              answer={answers[currentQuestion.id as number]}
                              onAnswerChange={handleAnswerChange}
                           />
                        )}

                        {/* Navigation */}
                        <div className="flex items-center justify-between rounded-lg bg-white p-4 shadow">
                           <Button onClick={handlePrevious} disabled={currentQuestionIndex === 0} variant="outline">
                              <ChevronLeft className="mr-2 h-4 w-4" />
                              Previous
                           </Button>

                           {/* <Button onClick={handleMarkForReview} variant={markedQuestions.has(currentQuestion.id as number) ? 'default' : 'outline'}>
                           <Flag className="mr-2 h-4 w-4" />
                           {markedQuestions.has(currentQuestion.id as number) ? 'Unmark' : 'Mark for Review'}
                        </Button> */}

                           {currentQuestionIndex < questions.length - 1 ? (
                              <Button onClick={handleNext}>
                                 Next
                                 <ChevronRight className="ml-2 h-4 w-4" />
                              </Button>
                           ) : (
                              <Button onClick={() => setShowSubmitDialog(true)} variant="default">
                                 Submit Exam
                              </Button>
                           )}
                        </div>
                     </div>

                     {/* Sidebar */}
                     <div className="lg:col-span-1">
                        <QuestionNavigator
                           questions={questions}
                           currentQuestionIndex={currentQuestionIndex}
                           answeredQuestions={answeredQuestions}
                           markedQuestions={markedQuestions}
                           onNavigate={setCurrentQuestionIndex}
                        />
                     </div>
                  </div>
               </div>

               {/* Submit Confirmation Dialog */}
               <AlertDialog open={showSubmitDialog} onOpenChange={setShowSubmitDialog}>
                  <AlertDialogContent>
                     <AlertDialogHeader>
                        <AlertDialogTitle className="flex items-center gap-2">
                           <AlertTriangle className="h-5 w-5 text-yellow-600" />
                           Submit Exam?
                        </AlertDialogTitle>
                        <AlertDialogDescription className="space-y-3">
                           <p>Are you sure you want to submit your exam? This action cannot be undone.</p>
                           {unansweredCount > 0 && (
                              <div className="rounded-lg bg-yellow-50 p-3">
                                 <p className="text-sm font-semibold text-yellow-800">
                                    Warning: You have {unansweredCount} unanswered question{unansweredCount > 1 ? 's' : ''}!
                                 </p>
                              </div>
                           )}
                           <div className="text-sm">
                              <p>
                                 <strong>Answered:</strong> {answeredQuestions.size} / {questions.length}
                              </p>
                              <p>
                                 <strong>Marked for review:</strong> {markedQuestions.size}
                              </p>
                           </div>
                        </AlertDialogDescription>
                     </AlertDialogHeader>
                     <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setShowSubmitDialog(false)}>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleSubmit} disabled={isSubmitting}>
                           {isSubmitting ? 'Submitting...' : 'Yes, Submit Exam'}
                        </AlertDialogAction>
                     </AlertDialogFooter>
                  </AlertDialogContent>
               </AlertDialog>
            </div>

            <Footer />
         </main>
      </Main>
   );
};

export default TakeExam;
