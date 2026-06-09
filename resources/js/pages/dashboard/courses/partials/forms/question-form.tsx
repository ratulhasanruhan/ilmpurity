import InputError from '@/components/input-error';
import LoadingButton from '@/components/loading-button';
import Tabs from '@/components/tabs';
import TagInput from '@/components/tag-input';
import TiptapEditor from '@/components/text-editor/tiptap-editor';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SharedData } from '@/types/global';
import { useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';

const getQuestionTypes = (translate: any) => [
   { value: 'single', label: translate.dashboard.single_choice, flag: false },
   { value: 'multiple', label: translate.dashboard.multiple_choice, flag: false },
   { value: 'boolean', label: translate.dashboard.true_false, flag: false },
];

interface Props {
   title: string;
   quiz: SectionQuiz;
   handler: React.ReactNode;
   question?: QuizQuestion;
}

const QuestionForm = ({ title, handler, quiz, question }: Props) => {
   const [open, setOpen] = useState(false);
   const { props } = usePage<SharedData>();
   const { translate } = props;
   const { frontend, dashboard, input, button } = translate;

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

   return (
      <Dialog open={open} onOpenChange={setOpen}>
         <DialogTrigger>{handler}</DialogTrigger>

         <DialogContent className="p-0">
            <ScrollArea className="max-h-[90vh] p-6">
               <DialogHeader className="mb-6">
                  <DialogTitle>{title}</DialogTitle>
               </DialogHeader>

               <form onSubmit={handleSubmit} className="relative space-y-4 p-0.5">
                  <div>
                     <Label>{dashboard.question_type}</Label>
                     <Select
                        value={data.type}
                        onValueChange={(value) => {
                           setData('type', value);

                           if (value === 'boolean') {
                              setData('answer', ['True']);
                           } else {
                              setData('answer', []);
                           }
                        }}
                     >
                        <SelectTrigger>
                           <SelectValue placeholder={input.question_type} />
                        </SelectTrigger>
                        <SelectContent>
                           {questionTypes.map((type) => (
                              <SelectItem key={type.value} value={type.value}>
                                 {type.label}
                              </SelectItem>
                           ))}
                        </SelectContent>
                     </Select>
                  </div>

                  <div>
                     <Label>{dashboard.question_title}</Label>
                     <TiptapEditor
                        ssr={true}
                        output="html"
                        placeholder={{
                           paragraph: 'Type your content here...',
                           imageCaption: 'Type caption for image (optional)',
                        }}
                        contentMinHeight={256}
                        contentMaxHeight={640}
                        initialContent={data.title}
                        onContentChange={(value) =>
                           setData((prev) => ({
                              ...prev,
                              title: value as string,
                           }))
                        }
                     />
                     <InputError message={errors.title} />
                  </div>

                  {data.type !== 'boolean' && (
                     <>
                        <div>
                           <Label>{input.options}</Label>
                           <TagInput
                              defaultTags={data.options}
                              placeholder={input.question_options_placeholder}
                              onChange={(values: any) => setData('options', values)}
                           />
                        </div>
                        {data.type === 'multiple' ? (
                           <div>
                              <Label>{input.answer}</Label>
                              <TagInput
                                 defaultTags={data.answer}
                                 whitelist={data.options}
                                 enforceWhitelist={true}
                                 placeholder={input.answer_options_placeholder}
                                 onChange={(values) => setData('answer', values)}
                              />
                           </div>
                        ) : (
                           <div>
                              <Label>{input.answer}</Label>
                              <Input
                                 type="text"
                                 value={data.answer}
                                 placeholder={input.answer_placeholder}
                                 onChange={(e) => setData('answer', [e.target.value])}
                              />
                           </div>
                        )}
                     </>
                  )}

                  {data.type === 'boolean' && (
                     <div>
                        <Label>{input.answer}</Label>
                        <Tabs defaultValue="True" value={data.answer[0]} onValueChange={(value) => setData('answer', [value])}>
                           <TabsList className="w-full">
                              <TabsTrigger value="True" className="w-full">
                                 {frontend.true}
                              </TabsTrigger>
                              <TabsTrigger value="False" className="w-full">
                                 {frontend.false}
                              </TabsTrigger>
                           </TabsList>
                        </Tabs>
                     </div>
                  )}

                  <LoadingButton loading={processing} className="absolute right-0 -bottom-16">
                     {button.submit}
                  </LoadingButton>
               </form>
            </ScrollArea>
         </DialogContent>
      </Dialog>
   );
};

export default QuestionForm;
