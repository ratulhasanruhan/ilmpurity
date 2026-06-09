import InputError from '@/components/input-error';
import LoadingButton from '@/components/loading-button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { ExamUpdateProps } from '../../update';

const Media = () => {
   const { props } = usePage<ExamUpdateProps>();
   const { tab, exam } = props;

   const [previewThumbnail, setPreviewThumbnail] = useState(exam.thumbnail);

   const { data, setData, post, errors, reset, processing } = useForm({
      tab: tab,
      thumbnail: null as File | null,
   });

   // Handle form submission
   const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      post(route('exams.update', { exam: exam.id }), {
         onSuccess() {
            reset();
         },
      });
   };

   return (
      <Card className="container p-4 sm:p-6">
         <form onSubmit={handleSubmit} className="space-y-4">
            <div>
               <Label>Thumbnail</Label>
               <Input
                  type="file"
                  name="thumbnail"
                  onChange={(e) => {
                     const file = e.target.files?.[0];
                     if (file) {
                        setData('thumbnail', file);
                        // Create preview
                        const reader = new FileReader();
                        reader.onloadend = () => {
                           setPreviewThumbnail(reader.result as string);
                        };
                        reader.readAsDataURL(file);
                     }
                  }}
               />
               <InputError message={errors.thumbnail} />
               <p className="mt-1 text-xs text-gray-500">Recommended size: 400x300px. Max size: 2MB</p>

               {previewThumbnail && (
                  <div className="mt-4">
                     <Label className="mb-2 block">Preview:</Label>
                     <img src={previewThumbnail || '/assets/images/blank-image.jpg'} alt="Thumbnail preview" className="w-full max-w-sm rounded-md" />
                  </div>
               )}
            </div>

            <div className="mt-8">
               <LoadingButton loading={processing}>Save Changes</LoadingButton>
            </div>
         </form>
      </Card>
   );
};

export default Media;
