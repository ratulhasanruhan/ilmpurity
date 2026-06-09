import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface Props {
   question: ExamQuestion;
   answer: any;
   onAnswerChange: (answer: any) => void;
}

const ShortAnswerQuestion = ({ question, answer, onAnswerChange }: Props) => {
   const answerText = answer?.answer_text || '';
   const wordLimit = question.options?.word_limit || 500;

   const handleChange = (value: string) => {
      onAnswerChange({
         question_id: question.id,
         answer_text: value,
      });
   };

   const wordCount = answerText.trim().split(/\s+/).filter(Boolean).length;

   return (
      <div className="space-y-4">
         <div className="rounded-lg bg-blue-50 p-3">
            <p className="text-sm text-blue-800">
               <span className="font-semibold">Note:</span> This answer will be manually graded by the instructor. Write a clear and
               detailed response.
            </p>
         </div>

         <div>
            <Label htmlFor="answer">Your Answer</Label>
            <Textarea
               id="answer"
               value={answerText}
               onChange={(e) => handleChange(e.target.value)}
               placeholder="Type your answer here..."
               rows={8}
               className="mt-2"
            />
         </div>

         <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">
               Word count: <span className={`font-semibold ${wordCount > wordLimit ? 'text-destructive' : ''}`}>{wordCount}</span>
               {wordLimit && ` / ${wordLimit}`}
            </span>
            {wordCount > wordLimit && <span className="text-destructive">Word limit exceeded!</span>}
         </div>

         {question.options?.expected_answer && (
            <div className="rounded-lg bg-gray-50 p-3">
               <p className="mb-1 text-sm font-semibold text-gray-700">Guidance:</p>
               <p className="text-sm text-gray-600">{question.options.expected_answer}</p>
            </div>
         )}
      </div>
   );
};

export default ShortAnswerQuestion;

