import InputError from '@/components/input-error';
import LoadingButton from '@/components/loading-button';
import TiptapEditor from '@/components/text-editor/tiptap-editor';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { onHandleChange } from '@/lib/inertia';
import { useForm } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import FillBlankForm from './question-types/fill-blank-form';
import ListeningForm from './question-types/listening-form';
import MatchingForm from './question-types/matching-form';
import MultipleChoiceForm from './question-types/multiple-choice-form';
import OrderingForm from './question-types/ordering-form';
import ShortAnswerForm from './question-types/short-answer-form';

interface Props {
   exam: Exam;
   question?: ExamQuestion;
   handler: React.ReactNode;
}

type QuestionFormData = {
   exam_id: number | string;
   title: string;
   description: string;
   marks: number;
   options: {
      answers?: string[];
      matches?: Array<{ id: number; question: string; answer: string }>;
      items?: string[];
      correct_order?: number[];
      sample_answer?: string;
      audio_url?: string;
      audio_file?: File;
      audio_source?: 'url' | 'upload';
      instructions?: string;
      [key: string]: any;
   };
   question_options: Array<{
      id?: number;
      option_text: string;
      is_correct: boolean;
      sort: number;
   }>;
   question_type: ExamQuestionType;
   exam_question_id: number | null;
};

const questionTypes: { value: ExamQuestionType; label: string }[] = [
   { value: 'multiple_choice', label: 'Multiple Choice' },
   { value: 'multiple_select', label: 'Multiple Select' },
   { value: 'matching', label: 'Matching' },
   { value: 'fill_blank', label: 'Fill in the Blank' },
   { value: 'ordering', label: 'Ordering' },
   { value: 'short_answer', label: 'Short Answer' },
   { value: 'listening', label: 'Listening' },
];

const QuestionDialog = ({ exam, question, handler }: Props) => {
   const [open, setOpen] = useState(false);
   const [isSubmit, setIsSubmit] = useState(false);
   const [isFileSelected, setIsFileSelected] = useState(false);
   const [isFileUploaded, setIsFileUploaded] = useState(false);

   const initialFormData: QuestionFormData = {
      exam_id: exam.id,
      title: question?.title || '',
      description: question?.description || '',
      marks: question?.marks || 1,
      options: question?.options || {},
      question_options: (question?.question_options || []).map((opt) => ({
         id: opt.id ? Number(opt.id) : undefined,
         option_text: opt.option_text,
         is_correct: opt.is_correct,
         sort: opt.sort,
      })),
      question_type: question?.question_type || 'multiple_choice',
      exam_question_id: question?.id ? Number(question.id) : null,
   };

   const { data, setData, post, put, errors, processing, reset, clearErrors } = useForm(initialFormData);

   const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();

      // For listening questions with file upload
      if (data.question_type === 'listening' && data.options?.audio_source === 'upload') {
         // Only wait for upload if it's a NEW question or if a new file was selected
         if (!question || isFileSelected) {
            if (!isFileUploaded) {
               setIsSubmit(true);
               return;
            }
         }
      }

      // Otherwise submit the form immediately
      submitForm();
   };

   const submitForm = () => {
      clearErrors();

      if (question) {
         put(route('exam-questions.update', question.id), {
            preserveScroll: true,
            onSuccess: () => {
               setOpen(false);
               reset();
               setIsSubmit(false);
               setIsFileUploaded(false);
            },
         });
      } else {
         post(route('exam-questions.store'), {
            preserveScroll: true,
            onSuccess: () => {
               setOpen(false);
               reset();
               setIsSubmit(false);
               setIsFileUploaded(false);
            },
         });
      }
   };

   // Auto-submit after file upload completes
   useEffect(() => {
      if (isFileUploaded && isSubmit) {
         submitForm();
      }
   }, [isFileUploaded, isSubmit]);

   // Reset upload states when dialog opens/closes
   useEffect(() => {
      if (!open) {
         setIsSubmit(false);
         setIsFileSelected(false);
         setIsFileUploaded(false);
      }
   }, [open]);

   const renderQuestionTypeForm = () => {
      const props = {
         data,
         setData,
         errors,
      };

      switch (data.question_type) {
         case 'multiple_choice':
         case 'multiple_select':
            return <MultipleChoiceForm {...props} isMultipleSelect={data.question_type === 'multiple_select'} />;
         case 'matching':
            return <MatchingForm {...props} />;
         case 'fill_blank':
            return <FillBlankForm {...props} />;
         case 'ordering':
            return <OrderingForm {...props} />;
         case 'short_answer':
            return <ShortAnswerForm {...props} />;
         case 'listening':
            return (
               <ListeningForm
                  {...props}
                  isSubmit={isSubmit}
                  setIsSubmit={setIsSubmit}
                  setIsFileSelected={setIsFileSelected}
                  setIsFileUploaded={setIsFileUploaded}
               />
            );
         default:
            return null;
      }
   };

   return (
      <Dialog open={open} onOpenChange={setOpen}>
         <DialogTrigger>{handler}</DialogTrigger>
         <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto">
            <DialogHeader>
               <DialogTitle>{question ? 'Edit Question' : 'Create Question'}</DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-6">
               <div className="grid gap-6 md:grid-cols-2">
                  <div>
                     <Label>Question Type *</Label>
                     <Select
                        value={data.question_type}
                        onValueChange={(value: ExamQuestionType) => setData('question_type', value)}
                        disabled={question ? true : false}
                     >
                        <SelectTrigger>
                           <SelectValue placeholder="Select question type" />
                        </SelectTrigger>
                        <SelectContent>
                           {questionTypes.map((type) => (
                              <SelectItem key={type.value} value={type.value}>
                                 {type.label}
                              </SelectItem>
                           ))}
                        </SelectContent>
                     </Select>
                     <InputError message={errors.question_type} />
                  </div>

                  <div>
                     <Label>Marks *</Label>
                     <Input
                        type="number"
                        step="0.5"
                        min="0.5"
                        name="marks"
                        value={data.marks.toString()}
                        onChange={(e) => setData('marks', parseFloat(e.target.value) || 0)}
                        placeholder="Enter marks"
                     />
                     <InputError message={errors.marks} />
                  </div>
               </div>

               <div>
                  <Label>Question Title *</Label>
                  <Input name="title" value={data.title} onChange={(e) => onHandleChange(e, setData)} placeholder="Enter question title" />
                  <InputError message={errors.title} />
               </div>

               <div>
                  <Label>Description (Optional)</Label>
                  <TiptapEditor
                     ssr={true}
                     output="html"
                     placeholder={{
                        paragraph: 'Add additional context or instructions...',
                        imageCaption: 'Add additional context or instructions...',
                     }}
                     contentMinHeight={150}
                     contentMaxHeight={300}
                     initialContent={data.description}
                     onContentChange={(value) =>
                        setData((prev) => ({
                           ...prev,
                           description: value as string,
                        }))
                     }
                  />
                  <InputError message={errors.description} />
               </div>

               {renderQuestionTypeForm()}

               <div className="flex justify-end gap-3 border-t pt-4">
                  <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={processing || isSubmit}>
                     Cancel
                  </Button>
                  <LoadingButton loading={processing || isSubmit} disabled={processing || isSubmit}>
                     {question ? 'Update Question' : 'Create Question'}
                  </LoadingButton>
               </div>
            </form>
         </DialogContent>
      </Dialog>
   );
};

export default QuestionDialog;
