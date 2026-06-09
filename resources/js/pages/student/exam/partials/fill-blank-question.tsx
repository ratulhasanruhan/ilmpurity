import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useEffect, useState } from 'react';

interface Props {
   question: ExamQuestion;
   answer: any;
   onAnswerChange: (answer: any) => void;
}

const FillBlankQuestion = ({ question, answer, onAnswerChange }: Props) => {
   const blanks = question.options?.blanks;
   const totalInputs = blanks?.length ?? 1;
   const buildInitialValues = () => {
      if (Array.isArray(answer?.answers)) {
         const existing = answer?.answers as string[];
         return Array.from({ length: totalInputs }, (_, index) => existing[index] || '');
      }
      if (answer?.answers && typeof answer.answers === 'object') {
         const record = answer.answers as Record<string, string>;
         return Array.from({ length: totalInputs }, (_, index) => record[index] || '');
      }
      return Array.from({ length: totalInputs }, () => '');
   };

   const [values, setValues] = useState<string[]>(buildInitialValues);

   useEffect(() => {
      setValues(buildInitialValues());
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [question.id]);

   const emitChange = (newValues: string[]) => {
      setValues(newValues);
      onAnswerChange({
         answers: newValues,
      });
   };

   const handleChange = (index: number, value: string) => {
      const newValues = [...values];
      newValues[index] = value;
      emitChange(newValues);
   };

   // Parse description placeholders when blanks metadata provided
   const questionText = question.description || '';
   const parts = blanks ? questionText.split(/\[BLANK_(\d+)\]/g) : [questionText];

   return (
      <div className="space-y-4">
         <p className="text-sm text-gray-600">Fill in the blanks with appropriate answers:</p>

         <div className="rounded-lg bg-gray-50 p-6">
            <div className="prose prose-sm max-w-none">
               {blanks
                  ? parts.map((part, index) => {
                       if (index % 2 === 0) {
                          return <span key={index} dangerouslySetInnerHTML={{ __html: part }} />;
                       }
                       const placeholderIndex = parseInt(part, 10);
                       return (
                          <span key={index} className="inline-block align-middle">
                             <Input
                                type="text"
                                value={values[placeholderIndex] || ''}
                                onChange={(e) => handleChange(placeholderIndex, e.target.value)}
                                placeholder={`Blank ${placeholderIndex + 1}`}
                                className="mx-2 inline-block w-48"
                                autoComplete="off"
                             />
                          </span>
                       );
                    })
                  : (
                       <span dangerouslySetInnerHTML={{ __html: questionText }} />
                    )}
            </div>
         </div>

         <div className="space-y-2">
            <Label className="text-sm font-semibold">Your Answers:</Label>
            {Array.from({ length: totalInputs }).map((_, index) => (
               <div key={index} className="flex items-center gap-3 rounded border p-2">
                  <span className="text-sm font-semibold text-gray-600">Blank {index + 1}:</span>
                  <Input
                     type="text"
                     value={values[index] || ''}
                     onChange={(e) => handleChange(index, e.target.value)}
                     placeholder="Your answer"
                     className="flex-1"
                     autoComplete="off"
                  />
               </div>
            ))}
         </div>

         {question.options?.case_sensitive && (
            <p className="text-sm text-yellow-600">
               <span className="font-semibold">Note:</span> Answers are case-sensitive.
            </p>
         )}
      </div>
   );
};

export default FillBlankQuestion;
