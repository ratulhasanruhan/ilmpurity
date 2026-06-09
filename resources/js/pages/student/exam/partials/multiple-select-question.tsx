import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

interface Props {
   question: ExamQuestion;
   answer: any;
   onAnswerChange: (answer: any) => void;
}

const MultipleSelectQuestion = ({ question, answer, onAnswerChange }: Props) => {
   const selectedOptions = answer?.selected_option_ids || [];

   const handleChange = (optionId: number, checked: boolean) => {
      const newSelectedOptions = checked ? [...selectedOptions, optionId] : selectedOptions.filter((id: number) => id !== optionId);

      onAnswerChange({
         selected_option_ids: newSelectedOptions,
      });
   };

   const handleSelectAll = () => {
      const allOptionIds = question.question_options?.map((opt) => opt.id) || [];
      onAnswerChange({
         selected_option_ids: allOptionIds,
      });
   };

   const handleClearAll = () => {
      onAnswerChange({
         selected_option_ids: [],
      });
   };

   return (
      <div className="space-y-4">
         <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">Select all correct answers:</p>
            <div className="flex gap-2">
               <Button variant="ghost" size="sm" onClick={handleSelectAll}>
                  Select All
               </Button>
               <Button variant="ghost" size="sm" onClick={handleClearAll} disabled={selectedOptions.length === 0}>
                  Clear All
               </Button>
            </div>
         </div>

         <div className="space-y-3">
            {question.question_options?.map((option) => {
               const isChecked = selectedOptions.includes(option.id);
               return (
                  <div
                     key={option.id}
                     className={`flex items-start space-x-3 rounded-lg border-2 p-4 transition-colors ${
                        isChecked ? 'border-primary bg-primary/5' : 'border-gray-200 hover:border-gray-300'
                     }`}
                  >
                     <Checkbox
                        id={`option-${option.id}`}
                        checked={isChecked}
                        onCheckedChange={(checked) => handleChange(option.id as number, checked as boolean)}
                        className="mt-0.5"
                     />
                     <Label htmlFor={`option-${option.id}`} className="flex-1 cursor-pointer font-normal">
                        {option.option_text}
                     </Label>
                  </div>
               );
            })}
         </div>

         {selectedOptions.length > 0 && (
            <p className="text-sm text-gray-600">
               Selected: <span className="font-semibold">{selectedOptions.length}</span> option(s)
            </p>
         )}
      </div>
   );
};

export default MultipleSelectQuestion;
