import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Plus, Trash2 } from 'lucide-react';
import * as React from 'react';

interface Props {
   data: any;
   setData: (key: string, value: any) => void;
   errors: any;
   isMultipleSelect: boolean;
}

const MultipleChoiceForm = ({ data, setData, errors, isMultipleSelect }: Props) => {
   const options = data.question_options || [];

   const addOption = () => {
      const newOptions = [
         ...options,
         {
            option_text: '',
            is_correct: false,
            sort: options.length,
         },
      ];
      setData('question_options', newOptions);
   };

   const removeOption = (index: number) => {
      const newOptions = options.filter((_: any, i: number) => i !== index);
      setData('question_options', newOptions);
   };

   const updateOption = (index: number, field: string, value: any) => {
      const newOptions = [...options];
      newOptions[index] = { ...newOptions[index], [field]: value };
      setData('question_options', newOptions);
   };

   const updateCorrectAnswer = (index: number, checked: boolean) => {
      const newOptions = [...options];
      if (isMultipleSelect) {
         // Multiple select: just toggle this option
         newOptions[index].is_correct = checked;
      } else {
         // Multiple choice: set only this one as correct
         newOptions.forEach((opt: any, i: number) => {
            newOptions[i].is_correct = i === index ? checked : false;
         });
      }
      setData('question_options', newOptions);
   };

   // Initialize with 4 options if empty (only for new questions)
   const [initialized, setInitialized] = React.useState(false);

   React.useEffect(() => {
      if (!initialized && options.length === 0) {
         setData('question_options', [
            { option_text: '', is_correct: false, sort: 0 },
            { option_text: '', is_correct: false, sort: 1 },
            { option_text: '', is_correct: false, sort: 2 },
            { option_text: '', is_correct: false, sort: 3 },
         ]);
         setInitialized(true);
      }
   }, [initialized, options.length]);

   return (
      <div className="space-y-4">
         <div className="flex items-center justify-between">
            <Label>Answer Options *</Label>
            <Button type="button" variant="outline" size="sm" onClick={addOption}>
               <Plus className="h-4 w-4" />
               Add Option
            </Button>
         </div>

         <p className="text-sm text-gray-600">
            {isMultipleSelect
               ? 'Check all correct answers (students can select multiple options)'
               : 'Select the correct answer (students can select only one)'}
         </p>

         <div className="space-y-3">
            {options.map((option: any, index: number) => (
               <div key={index} className="flex items-start gap-3">
                  {isMultipleSelect ? (
                     <Checkbox
                        checked={option.is_correct}
                        onCheckedChange={(checked) => updateCorrectAnswer(index, checked === true)}
                        className="mt-3"
                     />
                  ) : (
                     <RadioGroup
                        value={options.findIndex((opt: any) => opt.is_correct).toString()}
                        onValueChange={(val) => updateCorrectAnswer(parseInt(val), true)}
                     >
                        <RadioGroupItem value={index.toString()} className="mt-3" />
                     </RadioGroup>
                  )}

                  <div className="flex-1">
                     <Input
                        placeholder={`Option ${index + 1}`}
                        value={option.option_text}
                        onChange={(e) => updateOption(index, 'option_text', e.target.value)}
                        className={option.is_correct ? 'border-green-500 bg-green-50' : ''}
                     />
                     <InputError message={errors[`question_options.${index}.option_text`]} />
                  </div>

                  {options.length > 2 && (
                     <Button type="button" variant="ghost" size="sm" onClick={() => removeOption(index)} className="mt-2 text-red-600">
                        <Trash2 className="h-4 w-4" />
                     </Button>
                  )}
               </div>
            ))}
         </div>

         {options.length > 0 && !options.some((opt: any) => opt.is_correct) && (
            <p className="text-sm text-amber-600">⚠️ Please mark at least one option as correct</p>
         )}

         <InputError message={errors.question_options} />
      </div>
   );
};

export default MultipleChoiceForm;
