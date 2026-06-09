import InputError from '@/components/input-error';
import LoadingButton from '@/components/loading-button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForm, usePage } from '@inertiajs/react';
import { ExamUpdateProps } from '../../update';

const ExamSettings = () => {
   const { props } = usePage<ExamUpdateProps>();
   const { tab, exam } = props;

   const { data, setData, post, errors, processing } = useForm({
      tab: tab,
      duration_hours: exam.duration_hours || 1,
      duration_minutes: exam.duration_minutes || 0,
      pass_mark: exam.pass_mark || 50,
      max_attempts: exam.max_attempts || 3,
      total_marks: exam.total_marks || 100,
   });

   // Handle form submission
   const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      post(route('exams.update', { exam: exam.id }));
   };

   return (
      <Card className="container p-4 sm:p-6">
         <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-6 md:grid-cols-2">
               <div>
                  <Label>Duration (Hours) *</Label>
                  <Input
                     type="number"
                     name="duration_hours"
                     value={data.duration_hours.toString()}
                     onChange={(e) => setData('duration_hours', parseInt(e.target.value) || 0)}
                     placeholder="1"
                     min="0"
                  />
                  <InputError message={errors.duration_hours} />
               </div>

               <div>
                  <Label>Duration (Minutes) *</Label>
                  <Input
                     type="number"
                     name="duration_minutes"
                     value={data.duration_minutes.toString()}
                     onChange={(e) => setData('duration_minutes', parseInt(e.target.value) || 0)}
                     placeholder="0"
                     min="0"
                     max="59"
                  />
                  <InputError message={errors.duration_minutes} />
               </div>

               <div>
                  <Label>Pass Mark *</Label>
                  <Input
                     type="number"
                     name="pass_mark"
                     value={data.pass_mark.toString()}
                     onChange={(e) => setData('pass_mark', parseInt(e.target.value) || 0)}
                     placeholder="50"
                     min="0"
                     max="100"
                  />
                  <InputError message={errors.pass_mark} />
                  <p className="mt-1 text-xs text-gray-500">Students must score this percentage to pass</p>
               </div>

               <div>
                  <Label>Max Attempts *</Label>
                  <Input
                     type="number"
                     name="max_attempts"
                     value={data.max_attempts.toString()}
                     onChange={(e) => setData('max_attempts', parseInt(e.target.value) || 1)}
                     placeholder="3"
                     min="1"
                  />
                  <InputError message={errors.max_attempts} />
                  <p className="mt-1 text-xs text-gray-500">Maximum number of attempts allowed per student</p>
               </div>

               <div>
                  <Label>Total Marks *</Label>
                  <Input
                     type="number"
                     name="total_marks"
                     value={data.total_marks.toString()}
                     onChange={(e) => setData('total_marks', parseInt(e.target.value) || 1)}
                     placeholder="100"
                     min="1"
                  />
                  <InputError message={errors.total_marks} />
                  <p className="mt-1 text-xs text-gray-500">Total marks for the entire exam</p>
               </div>
            </div>

            <div className="mt-8">
               <LoadingButton loading={processing}>Save Changes</LoadingButton>
            </div>
         </form>
      </Card>
   );
};

export default ExamSettings;
