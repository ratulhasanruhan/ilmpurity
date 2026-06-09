import DataSortModal from '@/components/data-sort-modal';
import DeleteByInertia from '@/components/inertia/delete-modal';
import TiptapRenderer from '@/components/text-editor/tiptap-renderer/client-renderer';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { SharedData } from '@/types/global';
import { router, useForm, usePage } from '@inertiajs/react';
import { Pencil, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import QuestionForm from './question-form';

const getQuestionTypes = (translate: any) => [
   { value: 'single', label: translate.dashboard.single_choice, flag: false },
   { value: 'multiple', label: translate.dashboard.multiple_choice, flag: false },
   { value: 'boolean', label: translate.dashboard.true_false, flag: false },
];

interface Props {
   title: string;
   handler: React.ReactNode;
   quiz: SectionQuiz;
   question?: QuizQuestion;
}

const QuestionQuestions = ({ title, handler, quiz, question }: Props) => {
   const [open, setOpen] = useState(false);
   const [questionType, setQuestionType] = useState(question ? 'add-question' : 'questions');
   const { props } = usePage<SharedData>();
   const { translate } = props;
   const { input, button, dashboard, frontend } = translate;

   const questionTypes = getQuestionTypes(translate);

   // Get the maximum sort value from quiz_questions
   const maxSort = quiz.quiz_questions.length > 0 ? Math.max(...quiz.quiz_questions.map((question) => question.sort)) : 0;

   // Parse the options and answers if they're strings
   const initialOptions = question?.options ? (typeof question.options === 'string' ? JSON.parse(question.options) : question.options) : [];

   const initialAnswer = question?.answer ? (typeof question.answer === 'string' ? JSON.parse(question.answer) : question.answer) : [];

   const { data, setData, post, put, reset, processing, errors } = useForm({
      title: question?.title || '',
      type: question?.type || 'single',
      options: initialOptions,
      answer: initialAnswer,
      sort: question?.sort || maxSort + 1,
      section_quiz_id: quiz.id,
   });

   const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();

      if (question) {
         put(route('quiz.question.update', { id: question.id }), {
            onSuccess: () => setOpen(false),
         });
      } else {
         post(route('quiz.question.store'), {
            onSuccess: () => {
               reset();
               setOpen(false);
            },
         });
      }
   };

   useEffect(() => {
      if (!open) {
         reset();
         setQuestionType(question ? 'add-question' : 'questions');
      }
   }, [open]);

   return (
      <Dialog open={open} onOpenChange={setOpen}>
         <DialogTrigger>{handler}</DialogTrigger>

         <DialogContent className="p-0">
            <ScrollArea className="max-h-[90vh] p-6">
               <DialogHeader className="mb-6">
                  <DialogTitle>{title}</DialogTitle>
               </DialogHeader>

               <div className="space-y-7">
                  <div className="flex items-center gap-4">
                     <QuestionForm
                        quiz={quiz}
                        title={button.add_question}
                        question={question}
                        handler={
                           <Button variant="secondary" className="h-8 text-xs">
                              {button.add_question}
                           </Button>
                        }
                     />

                     <DataSortModal
                        title={button.sort}
                        data={quiz.quiz_questions}
                        handler={
                           <Button variant="secondary" className="h-8 text-xs">
                              {button.sort}
                           </Button>
                        }
                        onOrderChange={(newOrder) => {
                           router.post(
                              route('quiz.question.sort'),
                              {
                                 sortedData: newOrder,
                              },
                              { preserveScroll: true },
                           );
                        }}
                        renderContent={(item) => (
                           <Card className="w-full px-4 py-3">
                              <div
                                 dangerouslySetInnerHTML={{
                                    __html: item.title,
                                 }}
                              />
                           </Card>
                        )}
                     />
                  </div>

                  <div className="space-y-2">
                     {quiz.quiz_questions.length > 0 ? (
                        quiz.quiz_questions.map((question: QuizQuestion) => (
                           <div
                              key={question.id}
                              className="group border-border flex w-full items-center justify-between rounded-md border px-4 py-3"
                           >
                              <TiptapRenderer>{question.title}</TiptapRenderer>

                              <div className="invisible flex items-center gap-2 group-hover:visible">
                                 <DeleteByInertia
                                    routePath={route('quiz.question.delete', {
                                       id: question.id,
                                    })}
                                    actionComponent={
                                       <Button size="icon" variant="secondary" className="text-destructive h-7 w-7">
                                          <Trash2 className="h-3 w-3" />
                                       </Button>
                                    }
                                 />

                                 <QuestionForm
                                    quiz={quiz}
                                    title={dashboard.edit_question}
                                    question={question}
                                    handler={
                                       <Button size="icon" variant="secondary" className="h-7 w-7">
                                          <Pencil className="h-3 w-3" />
                                       </Button>
                                    }
                                 />
                              </div>
                           </div>
                        ))
                     ) : (
                        <div className="flex items-center justify-center">
                           <p className="text-muted-foreground text-sm">{frontend.no_results}</p>
                        </div>
                     )}
                  </div>
               </div>

               <DialogFooter className="w-full justify-between space-x-2 pt-8">
                  <div className="flex w-full items-center gap-4">
                     <DialogClose asChild>
                        <Button type="button" variant="outline">
                           {button.close}
                        </Button>
                     </DialogClose>

                     <TabsList className="p-0">
                        <TabsTrigger asChild value="questions" className={cn(questionType === 'questions' ? 'hidden' : 'block')}>
                           <Button>{button.back}</Button>
                        </TabsTrigger>
                     </TabsList>
                  </div>
               </DialogFooter>
            </ScrollArea>
         </DialogContent>
      </Dialog>
   );
};

export default QuestionQuestions;
