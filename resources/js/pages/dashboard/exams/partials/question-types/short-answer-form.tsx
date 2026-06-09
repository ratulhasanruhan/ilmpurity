import InputError from '@/components/input-error';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface Props {
   data: any;
   setData: (key: string, value: any) => void;
   errors: any;
}

const ShortAnswerForm = ({ data, setData, errors }: Props) => {
   return (
      <div className="space-y-4">
         <div>
            <Label>Instructions</Label>
            <div className="rounded-md bg-blue-50 p-3 text-sm text-blue-900">
               <p className="mb-1 font-medium">About short answer questions:</p>
               <p>• Students will type their answer in a text box</p>
               <p>• These questions require manual grading by the instructor</p>
               <p>• You can optionally provide a sample answer or grading rubric below</p>
            </div>
         </div>

         <div>
            <Label>Guidelines (Optional)</Label>
            <Textarea
               placeholder="Enter a sample answer or guidelines for grading this question..."
               rows={5}
               value={data.options?.sample_answer || ''}
               onChange={(e) =>
                  setData('options', {
                     ...data.options,
                     sample_answer: e.target.value,
                  })
               }
            />
            <p className="mt-1 text-xs text-gray-500">This will help you or other graders evaluate student responses consistently</p>
            <InputError message={errors.options} />
         </div>
      </div>
   );
};

export default ShortAnswerForm;
