import DataSortModal from '@/components/data-sort-modal';
import QuestionTypeBadge from '@/components/exam/question-type-badge';
import DeleteModal from '@/components/inertia/delete-modal';
import TiptapRenderer from '@/components/text-editor/tiptap-renderer/client-renderer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { router, usePage } from '@inertiajs/react';
import { ArrowRight, ArrowUpDown, CheckCircle2, Circle, CircleCheck, Copy, Edit, HelpCircle, Plus, Trash2 } from 'lucide-react';
import { ExamUpdateProps } from '../../update';
import QuestionDialog from '../question-dialog';

const Questions = () => {
   const { props } = usePage<ExamUpdateProps>();
   const { exam } = props;
   const { questions } = exam;

   const handleDuplicateQuestion = (questionId: number) => {
      router.post(
         route('exam-questions.duplicate', { question: questionId }),
         {},
         {
            preserveScroll: true,
         },
      );
   };

   if (questions.length === 0) {
      return (
         <Card>
            <CardContent className="flex flex-col items-center justify-center py-16">
               <div className="mb-4 rounded-full bg-gray-100 p-6">
                  <HelpCircle className="h-12 w-12 text-gray-400" />
               </div>
               <h3 className="mb-2 text-xl font-semibold text-gray-900">No Questions Yet</h3>
               <p className="mb-6 max-w-md text-center text-gray-600">
                  Start building your exam by adding questions. You can create multiple choice, short answer, and many other question types.
               </p>

               <QuestionDialog
                  exam={exam}
                  handler={
                     <Button>
                        <Plus className="h-4 w-4" />
                        Add First Question
                     </Button>
                  }
               />
            </CardContent>
         </Card>
      );
   }

   return (
      <div className="space-y-4">
         <div className="flex items-center justify-between">
            <div>
               <h3 className="text-lg font-semibold">Exam Questions</h3>
               <p className="text-sm text-gray-600">
                  {questions.length} {questions.length === 1 ? 'question' : 'questions'} • Total: {exam.total_marks} marks
               </p>
            </div>

            <div className="flex items-center gap-2">
               <DataSortModal
                  title="Questions"
                  data={questions}
                  handler={
                     <Button variant="outline" className="flex items-center gap-2">
                        <ArrowUpDown className="h-4 w-4" />
                        Reorder
                     </Button>
                  }
                  onOrderChange={(newOrder, setOpen) => {
                     router.post(
                        route('exam-questions.reorder'),
                        {
                           sortedData: newOrder,
                        },
                        {
                           preserveScroll: true,
                           onSuccess: () => setOpen && setOpen(false),
                        },
                     );
                  }}
                  renderContent={(item) => (
                     <Card className="flex w-full items-center justify-between px-4 py-3">
                        <p>{item.title}</p>
                     </Card>
                  )}
               />
               <QuestionDialog
                  exam={exam}
                  handler={
                     <Button>
                        <Plus className="h-4 w-4" />
                        Add Question
                     </Button>
                  }
               />
            </div>
         </div>

         <div className="space-y-3">
            {questions.map((question, index) => (
               <Card key={question.id} className="transition-shadow hover:shadow-md">
                  <CardContent className="p-5">
                     <div className="flex items-center justify-between">
                        <div className="mb-1 flex items-center gap-2">
                           <span className="text-sm font-medium text-gray-500">Q{index + 1}</span>
                           <QuestionTypeBadge type={question.question_type} />
                           <span className="text-sm font-medium text-blue-600">{question.marks} marks</span>
                        </div>

                        <div className="flex items-center gap-2">
                           <Button
                              size="icon"
                              variant="ghost"
                              className="bg-muted hover:bg-muted-foreground/10 h-8 w-8 rounded-full p-0"
                              onClick={() => handleDuplicateQuestion(question.id as number)}
                           >
                              <Copy className="h-4 w-4" />
                           </Button>

                           <QuestionDialog
                              exam={exam}
                              question={question}
                              handler={
                                 <Button size="icon" variant="ghost" className="bg-muted hover:bg-muted-foreground/10 h-8 w-8 rounded-full p-0">
                                    <Edit className="h-4 w-4" />
                                 </Button>
                              }
                           />

                           <DeleteModal
                              message="Are you sure you want to delete this question?"
                              routePath={route('exam-questions.destroy', question.id)}
                              actionComponent={
                                 <Button size="icon" variant="ghost" className="bg-destructive/8 hover:bg-destructive/6 h-8 w-8 rounded-full p-0">
                                    <Trash2 className="text-destructive text-sm" />
                                 </Button>
                              }
                           />
                        </div>
                     </div>

                     <h4 className="mb-1 font-medium text-gray-900">{question.title}</h4>
                     <TiptapRenderer>{question.description || ''}</TiptapRenderer>

                     {/* Show options for multiple choice/select */}
                     {(question.question_type === 'multiple_choice' || question.question_type === 'multiple_select') &&
                        question.question_options &&
                        question.question_options.length > 0 && (
                           <div className="mt-3 flex flex-wrap items-center gap-x-6 gap-y-3">
                              {question.question_options.map((option) => (
                                 <div key={option.id} className="flex items-center gap-2 text-sm">
                                    {option.is_correct ? (
                                       <CircleCheck strokeWidth={3} className="h-4 w-4 text-green-500" />
                                    ) : (
                                       <Circle strokeWidth={3} className="h-4 w-4 text-gray-300" />
                                    )}

                                    <span className={option.is_correct ? 'font-medium text-green-700' : 'text-gray-600'}>{option.option_text}</span>
                                 </div>
                              ))}
                           </div>
                        )}

                     {/* Show matching pairs */}
                     {question.question_type === 'matching' && question.options?.matches && question.options.matches.length > 0 && (
                        <div className="mt-3 space-y-2">
                           <p className="text-xs font-medium text-gray-500">Matching Pairs:</p>
                           <div className="grid gap-2 sm:grid-cols-2">
                              {question.options.matches.map((match: any, idx: number) => (
                                 <div key={idx} className="flex items-center gap-2 rounded-md bg-gray-50 p-2 text-sm">
                                    <span className="text-gray-700">{match.question}</span>
                                    <ArrowRight className="h-3 w-3 text-gray-400" />
                                    <span className="font-medium text-green-600">{match.answer}</span>
                                 </div>
                              ))}
                           </div>
                        </div>
                     )}

                     {/* Show fill blank answers */}
                     {question.question_type === 'fill_blank' && question.options?.answers && question.options.answers.length > 0 && (
                        <div className="mt-3">
                           <p className="mb-1 text-xs font-medium text-gray-500">Accepted Answers:</p>
                           <div className="flex flex-wrap gap-2">
                              {question.options.answers.map((answer: string, idx: number) => (
                                 <span
                                    key={idx}
                                    className="inline-flex items-center gap-1 rounded-md bg-green-50 px-2 py-1 text-sm font-medium text-green-700"
                                 >
                                    <CheckCircle2 className="h-3 w-3" />
                                    {answer}
                                 </span>
                              ))}
                           </div>
                        </div>
                     )}

                     {/* Show ordering items */}
                     {question.question_type === 'ordering' && question.options?.items && question.options.items.length > 0 && (
                        <div className="mt-3">
                           <p className="mb-1 text-xs font-medium text-gray-500">Correct Order:</p>
                           <ol className="list-inside list-decimal space-y-1 text-sm text-gray-700">
                              {question.options.items.map((item: string, idx: number) => (
                                 <li key={idx}>{item}</li>
                              ))}
                           </ol>
                        </div>
                     )}

                     {/* Show short answer sample */}
                     {question.question_type === 'short_answer' && question.options?.sample_answer && (
                        <div className="mt-3">
                           <p className="mb-1 text-xs font-medium text-gray-500">Guidelines:</p>
                           <p className="rounded-md bg-gray-50 p-2 text-sm text-gray-700">{question.options.sample_answer}</p>
                        </div>
                     )}

                     {/* Show listening info */}
                     {question.question_type === 'listening' && (
                        <div className="mt-3 space-y-2">
                           {question.options?.audio_url && (
                              <audio controls className="h-11 w-full">
                                 <source src={question.options.audio_url} type="audio/mpeg" />
                                 Your browser does not support the audio element.
                              </audio>
                           )}
                           {question.options?.instructions && (
                              <div>
                                 <p className="mb-1 text-xs font-medium text-gray-500">Instructions:</p>
                                 <p className="text-sm text-gray-700">{question.options.instructions}</p>
                              </div>
                           )}
                        </div>
                     )}
                  </CardContent>
               </Card>
            ))}
         </div>
      </div>
   );
};

export default Questions;
