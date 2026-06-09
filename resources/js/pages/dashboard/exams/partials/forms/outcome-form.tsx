import InputError from '@/components/input-error';
import LoadingButton from '@/components/loading-button';
import { Textarea } from '@/components/ui/textarea';
import { onHandleChange } from '@/lib/inertia';
import { useForm } from '@inertiajs/react';

const OutcomeForm = ({ outcome }: { outcome: ExamOutcome }) => {
   const {
      data,
      setData,
      put,
      delete: destroy,
      errors,
      processing,
   } = useForm({
      outcome: outcome ? outcome.outcome : '',
   });

   const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();

      put(route('exam-outcomes.update', { exam_outcome: outcome.id }));
   };

   const handleDelete = () => {
      destroy(route('exam-outcomes.destroy', { exam_outcome: outcome.id }));
   };

   return (
      <form onSubmit={handleSubmit} className="space-y-2">
         <div>
            <Textarea
               required
               name="outcome"
               value={data.outcome || ''}
               placeholder="Enter exam learning outcome"
               onChange={(e) => onHandleChange(e, setData)}
            />

            <InputError message={errors.outcome} />
         </div>

         <div className="flex items-center justify-end gap-2">
            <LoadingButton
               type="button"
               variant="outline"
               loading={processing}
               onClick={handleDelete}
               className="h-7 w-full bg-red-50 text-xs hover:bg-red-100"
            >
               Remove
            </LoadingButton>
            <LoadingButton variant="secondary" className="h-7 w-full text-xs" loading={processing}>
               Save
            </LoadingButton>
         </div>
      </form>
   );
};

export default OutcomeForm;

