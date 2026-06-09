import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { X } from 'lucide-react';

interface Props {
   question: ExamQuestion;
   answer: any;
   onAnswerChange: (answer: any) => void;
}

const McqQuestion = ({ question, answer, onAnswerChange }: Props) => {
   const selectedOption = answer?.selected_option_id || '';

   const handleChange = (value: string) => {
      onAnswerChange({
         selected_option_id: parseInt(value),
      });
   };

   const handleClear = () => {
      onAnswerChange(null);
   };

   return (
      <div className="space-y-4">
         <div className="flex items-start justify-between">
            <p className="text-sm text-gray-600">Select the correct answer:</p>
            {selectedOption && (
               <Button variant="ghost" size="sm" onClick={handleClear}>
                  <X className="mr-2 h-4 w-4" />
                  Clear Selection
               </Button>
            )}
         </div>

         <RadioGroup value={selectedOption.toString()} onValueChange={handleChange}>
            <div className="space-y-3">
               {question.question_options?.map((option) => (
                  <div
                     key={option.id}
                     className={`flex items-start space-x-3 rounded-lg border-2 p-4 transition-colors ${
                        selectedOption === option.id ? 'border-primary bg-primary/5' : 'border-gray-200 hover:border-gray-300'
                     }`}
                  >
                     <RadioGroupItem value={option.id.toString()} id={`option-${option.id}`} className="mt-0.5" />
                     <Label htmlFor={`option-${option.id}`} className="flex-1 cursor-pointer font-normal">
                        {option.option_text}
                     </Label>
                  </div>
               ))}
            </div>
         </RadioGroup>
      </div>
   );
};

export default McqQuestion;
