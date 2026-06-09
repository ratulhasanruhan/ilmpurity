import InputError from '@/components/input-error';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { onHandleChange } from '@/lib/inertia';

interface Props {
   data: any;
   setData: (key: string, value: any) => void;
   errors: any;
}

const ExamSettingsForm = ({ data, setData, errors }: Props) => {
   return (
      <div className="space-y-4">
         <div className="grid grid-cols-2 gap-4">
            <div>
               <Label htmlFor="duration_hours">Duration (Hours) *</Label>
               <Input
                  id="duration_hours"
                  name="duration_hours"
                  type="number"
                  value={data.duration_hours}
                  onChange={(e) => onHandleChange(e, setData)}
                  min="0"
                  max="24"
                  required
               />
               <InputError message={errors.duration_hours} />
            </div>

            <div>
               <Label htmlFor="duration_minutes">Duration (Minutes) *</Label>
               <Input
                  id="duration_minutes"
                  name="duration_minutes"
                  type="number"
                  value={data.duration_minutes}
                  onChange={(e) => onHandleChange(e, setData)}
                  min="0"
                  max="59"
                  required
               />
               <InputError message={errors.duration_minutes} />
            </div>
         </div>

         {(data.duration_hours > 0 || data.duration_minutes > 0) && (
            <div className="rounded-lg bg-blue-50 p-3">
               <p className="text-sm text-blue-800">
                  Total exam duration:{' '}
                  <span className="font-semibold">
                     {data.duration_hours > 0 && `${data.duration_hours} hour${data.duration_hours > 1 ? 's' : ''} `}
                     {data.duration_minutes > 0 && `${data.duration_minutes} minute${data.duration_minutes > 1 ? 's' : ''}`}
                  </span>
               </p>
            </div>
         )}

         <div>
            <Label htmlFor="pass_mark">Pass Mark *</Label>
            <Input
               id="pass_mark"
               name="pass_mark"
               type="number"
               value={data.pass_mark}
               onChange={(e) => onHandleChange(e, setData)}
               placeholder="0"
               step="0.01"
               min="0"
               required
            />
            <p className="mt-1 text-sm text-gray-500">Minimum marks required to pass the exam</p>
            <InputError message={errors.pass_mark} />
         </div>

         <div>
            <Label htmlFor="max_attempts">Maximum Attempts Allowed *</Label>
            <div className="space-y-2">
               <Slider
                  value={[data.max_attempts || 1]}
                  onValueChange={(values) => setData('max_attempts', values[0])}
                  min={1}
                  max={10}
                  step={1}
                  className="py-4"
               />
               <div className="flex justify-between text-sm text-gray-600">
                  <span>1 attempt</span>
                  <span className="font-semibold text-gray-900">{data.max_attempts || 1} attempt(s)</span>
                  <span>10 attempts</span>
               </div>
            </div>
            <InputError message={errors.max_attempts} />
         </div>

         <div>
            <Label htmlFor="status">Exam Status *</Label>
            <Select name="status" value={data.status} onValueChange={(value) => setData('status', value)}>
               <SelectTrigger>
                  <SelectValue placeholder="Select status" />
               </SelectTrigger>
               <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
               </SelectContent>
            </Select>
            <p className="mt-1 text-sm text-gray-500">
               {data.status === 'draft' && 'Only visible to you'}
               {data.status === 'published' && 'Visible to all students'}
               {data.status === 'archived' && 'Hidden from students'}
            </p>
            <InputError message={errors.status} />
         </div>
      </div>
   );
};

export default ExamSettingsForm;
