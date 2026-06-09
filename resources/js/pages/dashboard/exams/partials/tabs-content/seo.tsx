import InputError from '@/components/input-error';
import LoadingButton from '@/components/loading-button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { onHandleChange } from '@/lib/inertia';
import { useForm, usePage } from '@inertiajs/react';
import { ExamUpdateProps } from '../../update';

const SEO = () => {
   const { props } = usePage<ExamUpdateProps>();
   const { tab, exam } = props;

   const { data, setData, post, errors, processing } = useForm({
      tab: tab,
      meta_title: exam.meta_title || '',
      meta_keywords: exam.meta_keywords || '',
      meta_description: exam.meta_description || '',
      og_title: exam.og_title || '',
      og_description: exam.og_description || '',
   });

   // Handle form submission
   const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();

      post(route('exams.update', { exam: exam.id }));
   };

   return (
      <Card className="p-4 sm:p-6">
         <form onSubmit={handleSubmit} className="space-y-4">
            <div>
               <Label>Meta Title</Label>
               <Input name="meta_title" value={data.meta_title} onChange={(e) => onHandleChange(e, setData)} placeholder="Enter meta title for SEO" />
               <InputError message={errors.meta_title} />
            </div>

            <div>
               <Label>Meta Keywords</Label>
               <Textarea
                  rows={3}
                  name="meta_keywords"
                  value={data.meta_keywords}
                  onChange={(e) => onHandleChange(e, setData)}
                  placeholder="Enter meta keywords separated by commas"
               />
               <InputError message={errors.meta_keywords} />
            </div>

            <div>
               <Label>Meta Description</Label>
               <Textarea
                  rows={3}
                  name="meta_description"
                  value={data.meta_description}
                  onChange={(e) => onHandleChange(e, setData)}
                  placeholder="Enter meta description for search engines"
               />
               <InputError message={errors.meta_description} />
            </div>

            <div>
               <Label>OG Title</Label>
               <Input name="og_title" value={data.og_title} onChange={(e) => onHandleChange(e, setData)} placeholder="Enter Open Graph title" />
               <InputError message={errors.og_title} />
            </div>

            <div>
               <Label>OG Description</Label>
               <Textarea
                  rows={3}
                  name="og_description"
                  value={data.og_description}
                  onChange={(e) => onHandleChange(e, setData)}
                  placeholder="Enter Open Graph description for social media"
               />
               <InputError message={errors.og_description} />
            </div>

            <div className="mt-8">
               <LoadingButton loading={processing}>Save Changes</LoadingButton>
            </div>
         </form>
      </Card>
   );
};

export default SEO;
