import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Trash2 } from 'lucide-react';
import { useEffect } from 'react';

interface Props {
   data: any;
   setData: (key: string, value: any) => void;
   errors: any;
}

const FillBlankForm = ({ data, setData, errors }: Props) => {
   const answers: string[] = data.options?.answers || [];

   useEffect(() => {
      if (answers.length === 0) {
         setData('options', { answers: [''] });
      }
   }, []);

   const addAnswer = () => {
      const newAnswers = [...answers, ''];
      setData('options', { answers: newAnswers });
   };

   const removeAnswer = (index: number) => {
      const newAnswers = answers.filter((_, i) => i !== index);
      setData('options', { answers: newAnswers });
   };

   const updateAnswer = (index: number, value: string) => {
      const newAnswers = [...answers];
      newAnswers[index] = value;
      setData('options', { answers: newAnswers });
   };

   return (
      <div className="space-y-4">
         <div>
            <Label>Instructions</Label>
            <div className="p-3 bg-blue-50 rounded-md text-sm text-blue-900">
               <p className="font-medium mb-1">How to use fill-in-the-blank questions:</p>
               <p>1. Write your question in the title field above</p>
               <p>2. Use underscores (___) or brackets [blank] to mark where students should fill in answers</p>
               <p>3. Add the correct answer(s) below</p>
            </div>
         </div>

         <div className="space-y-3">
            <div className="flex items-center justify-between">
               <Label>Accepted Answers *</Label>
               <Button type="button" variant="outline" size="sm" onClick={addAnswer}>
                  <Plus className="h-4 w-4" />
                  Add Alternative Answer
               </Button>
            </div>

            <p className="text-sm text-gray-600">Add multiple variations if there are different ways to answer correctly</p>

            {answers.map((answer, index) => (
               <div key={index} className="flex gap-2">
                  <div className="flex-1">
                     <Input placeholder={`Correct answer ${index + 1}`} value={answer} onChange={(e) => updateAnswer(index, e.target.value)} />
                  </div>
                  {answers.length > 1 && (
                     <Button type="button" variant="ghost" size="sm" onClick={() => removeAnswer(index)} className="text-red-600">
                        <Trash2 className="h-4 w-4" />
                     </Button>
                  )}
               </div>
            ))}
         </div>

         <InputError message={errors.options} />
      </div>
   );
};

export default FillBlankForm;

