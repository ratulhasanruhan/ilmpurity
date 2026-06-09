import LoadingButton from '@/components/loading-button';
import Tabs from '@/components/tabs';
import TiptapRenderer from '@/components/text-editor/tiptap-renderer/client-renderer';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { TabsContent } from '@/components/ui/tabs';
import { CoursePlayerProps } from '@/types/page';
import { useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';
import LessonControl from './lesson-control';

type QuizAnswer = {
   question_id: string;
   answer: string[];
};

interface QuizViewerProps {
   quiz: SectionQuiz;
}

const QuizViewer = ({ quiz }: QuizViewerProps) => {
   const { auth, translate } = usePage<CoursePlayerProps>().props;
   const { frontend } = translate;
   const [finished, setFinished] = useState(false);
   const [currentTab, setCurrentTab] = useState('summary');
   const submissions = quiz.quiz_submissions;

   const { data, setData, post, reset, processing } = useForm({
      submission_id: submissions.length > 0 ? submissions[0].id : null,
      section_quiz_id: quiz.id,
      user_id: auth.user.id,
      answers: [] as QuizAnswer[],
   });

   const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();

      post(route('quiz-submissions.store'), {
         onSuccess: () => {
            reset();
            setFinished(false);
            setCurrentTab('summary');
         },
      });
   };

   const handleCheckboxChange = (questionId: string, option: string, checked: boolean) => {
      if (checked) {
         const existingAnswer = data.answers.find((ans) => ans.question_id === questionId);

         if (existingAnswer) {
            setData(
               'answers',
               data.answers.map((ans) =>
                  ans.question_id === questionId
                     ? {
                          ...ans,
                          answer: [...ans.answer, option],
                       }
                     : ans,
               ),
            );
         } else {
            setData('answers', [
               ...data.answers,
               {
                  question_id: questionId,
                  answer: [option],
               },
            ]);
         }
      } else {
         setData(
            'answers',
            data.answers
               .map((ans) =>
                  ans.question_id === questionId
                     ? {
                          ...ans,
                          answer: ans.answer.filter((a) => a !== option),
                       }
                     : ans,
               )
               .filter((ans) => ans.answer.length > 0),
         );
      }
   };

   const handleRadioChange = (questionId: string, value: string) => {
      const existingAnswerIndex = data.answers.findIndex((ans) => ans.question_id === questionId);

      if (existingAnswerIndex >= 0) {
         setData(
            'answers',
            data.answers.map((ans, index) => (index === existingAnswerIndex ? { ...ans, answer: [value] } : ans)),
         );
      } else {
         setData('answers', [
            ...data.answers,
            {
               question_id: questionId,
               answer: [value],
            },
         ]);
      }
   };

   const quizBack = (index: number) => {
      const previousQuestion = index - 1;

      if (previousQuestion < 0) {
         setCurrentTab('summary');
      } else {
         setCurrentTab(quiz.quiz_questions[previousQuestion].id.toString());
      }

      setFinished(false);
   };

   const quizNext = (index: number) => {
      const totalQuestions = quiz.quiz_questions.length;
      const currentQuestion = index + 1;

      if (currentQuestion === totalQuestions) {
         setFinished(true);
      } else {
         setCurrentTab(quiz.quiz_questions[currentQuestion].id.toString());
      }
   };

   // Add this helper function to check if current question has an answer
   const hasAnswerForCurrentQuestion = (questionId: string) => {
      return data.answers.some((ans) => ans.question_id === questionId && ans.answer.length > 0);
   };

   // Function to start/restart the quiz
   const startQuiz = () => {
      // Reset all form data
      setData({
         submission_id: submissions.length > 0 ? submissions[0].id : null,
         section_quiz_id: quiz.id,
         user_id: auth.user.id,
         answers: [] as QuizAnswer[],
      });

      // Reset state
      setFinished(false);

      // Start from first question
      setCurrentTab(quiz.quiz_questions[0].id.toString());
   };

   return (
      <Card className="group relative h-full max-h-[80vh] w-full overflow-hidden rounded-lg">
         <LessonControl className="opacity-0 transition-all duration-300 group-hover:opacity-100" />

         <p className="p-6 text-center text-lg font-bold">{quiz.title}</p>

         <Separator />

         <form onSubmit={handleSubmit}>
            <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full p-6">
               <TabsContent value="summary">
                  <div className="flex justify-between p-6">
                     <div className="space-y-2">
                        <p>{frontend.summery}</p>

                        <div className="flex gap-2 text-sm">
                           <p className="text-gray-500">{frontend.duration}</p>
                           <p>:{` ${quiz.hours} ${frontend.hours} ${quiz.minutes} ${frontend.minutes} ${quiz.seconds} ${frontend.seconds}`}</p>
                        </div>
                        <div className="flex gap-2 text-sm">
                           <p className="text-gray-500">{frontend.total_questions}</p>
                           <p>: {quiz.quiz_questions.length}</p>
                        </div>
                        <div className="flex gap-2 text-sm">
                           <p className="text-gray-500">{frontend.total_marks}</p>
                           <p>: {quiz.total_mark}</p>
                        </div>
                        <div className="flex gap-2 text-sm">
                           <p className="text-gray-500">{frontend.pass_marks}</p>
                           <p>: {quiz.pass_mark}</p>
                        </div>
                        <div className="flex gap-2 text-sm">
                           <p className="text-gray-500">{frontend.retake}</p>
                           <p>: {quiz.retake}</p>
                        </div>
                     </div>
                     <div className="space-y-2">
                        <p>{frontend.result}</p>

                        <div className="flex gap-2 text-sm">
                           <p className="text-gray-500">{frontend.retake_attempts}</p>
                           <p>: {submissions[0]?.attempts || 0}</p>
                        </div>
                        <div className="flex gap-2 text-sm">
                           <p className="text-gray-500">{frontend.correct_answers}</p>
                           <p>: {submissions[0]?.correct_answers || 0}</p>
                        </div>
                        <div className="flex gap-2 text-sm">
                           <p className="text-gray-500">{frontend.incorrect_answers}</p>
                           <p>: {submissions[0]?.incorrect_answers || 0}</p>
                        </div>
                        <div className="flex gap-2 text-sm">
                           <p className="text-gray-500">{frontend.total_marks}</p>
                           <p>: {submissions[0]?.total_marks || 0}</p>
                        </div>
                        <div className="flex gap-2 text-sm">
                           <p className="text-gray-500">Status</p>
                           <p>: {submissions[0]?.is_passed ? frontend.passed : frontend.not_passed}</p>
                        </div>
                     </div>
                  </div>

                  <div className="flex justify-center p-6">
                     {submissions[0]?.attempts >= quiz.retake ? (
                        <Button type="button" size="lg">
                           {frontend.quiz_submitted}
                        </Button>
                     ) : (
                        <Button size="lg" type="button" onClick={startQuiz}>
                           {submissions[0] ? frontend.retake_quiz : frontend.start_quiz}
                        </Button>
                     )}
                  </div>
               </TabsContent>

               {quiz.quiz_questions.map((question, index) => {
                  // Parse the options and answers if they're strings
                  const options = question?.options ? (typeof question.options === 'string' ? JSON.parse(question.options) : question.options) : [];

                  return (
                     <TabsContent value={question.id.toString()} className="space-y-6">
                        <TiptapRenderer>{question.title}</TiptapRenderer>

                        {question.type === 'boolean' ? (
                           <RadioGroup
                              className="space-y-2"
                              defaultValue={data.answers.find((ans) => ans.question_id === question.id.toString())?.answer[0] || undefined}
                              onValueChange={(value) => handleRadioChange(question.id.toString(), value)}
                           >
                              <div className="flex items-center space-x-2">
                                 <RadioGroupItem className="cursor-pointer" id="True" value="True" />
                                 <Label htmlFor="True" className="capitalize">
                                    {frontend.true}
                                 </Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                 <RadioGroupItem className="cursor-pointer" id="False" value="False" />
                                 <Label htmlFor="False" className="capitalize">
                                    {frontend.false}
                                 </Label>
                              </div>
                           </RadioGroup>
                        ) : (
                           <div className="space-y-4">
                              {options.map((option: string) => (
                                 <div key={option} className="flex items-center gap-2">
                                    <Checkbox
                                       id={option}
                                       checked={data.answers.some((ans) => ans.question_id === question.id.toString() && ans.answer.includes(option))}
                                       onCheckedChange={(checked) => handleCheckboxChange(question.id.toString(), option, checked as boolean)}
                                    />
                                    <Label htmlFor={option} className="capitalize">
                                       {option}
                                    </Label>
                                 </div>
                              ))}
                           </div>
                        )}

                        <div className="flex justify-center gap-2 p-6">
                           <Button type="button" onClick={() => quizBack(index)}>
                              Back
                           </Button>

                           {finished ? (
                              <LoadingButton loading={processing}>Finish</LoadingButton>
                           ) : (
                              <Button type="button" onClick={() => quizNext(index)} disabled={!hasAnswerForCurrentQuestion(question.id.toString())}>
                                 Next
                              </Button>
                           )}
                        </div>
                     </TabsContent>
                  );
               })}
            </Tabs>
         </form>
      </Card>
   );
};

export default QuizViewer;
