import InputError from '@/components/input-error';
import LoadingButton from '@/components/loading-button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { onHandleChange } from '@/lib/inertia';
import { useForm, usePage } from '@inertiajs/react';
import { CourseUpdateProps } from '../update';

const SEO = () => {
   const { props } = usePage<CourseUpdateProps>();
   const { translate } = props;
   const { dashboard, input, button } = translate;
   const { tab, course } = props;

   const { data, setData, post, errors, processing } = useForm({
      tab: tab,
      meta_title: course.meta_title,
      meta_keywords: course.meta_keywords,
      meta_description: course.meta_description,
      og_title: course.og_title,
      og_description: course.og_description,
   });

   // Handle form submission
   const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();

      post(route('courses.update', { id: course.id }));
   };

   return (
      <Card className="p-4 sm:p-6">
         <form onSubmit={handleSubmit} className="space-y-4">
            <div>
               <Label>{dashboard.meta_title}</Label>
               <Input name="meta_title" value={data.meta_title} onChange={(e) => onHandleChange(e, setData)} placeholder={input.meta_title} />
               <InputError message={errors.meta_title} />
            </div>

            <div>
               <Label>{dashboard.meta_keywords}</Label>
               <Textarea
                  rows={3}
                  name="meta_keywords"
                  value={data.meta_keywords}
                  onChange={(e) => onHandleChange(e, setData)}
                  placeholder={input.meta_keywords}
               />
               <InputError message={errors.meta_keywords} />
            </div>

            <div>
               <Label>{dashboard.meta_description}</Label>
               <Textarea
                  rows={3}
                  name="meta_description"
                  value={data.meta_description}
                  onChange={(e) => onHandleChange(e, setData)}
                  placeholder={input.meta_description}
               />
               <InputError message={errors.meta_description} />
            </div>

            <div>
               <Label>{dashboard.og_title}</Label>
               <Input name="og_title" value={data.og_title} onChange={(e) => onHandleChange(e, setData)} placeholder={input.og_title} />
               <InputError message={errors.og_title} />
            </div>

            <div>
               <Label>{dashboard.og_description}</Label>
               <Textarea
                  rows={3}
                  name="og_description"
                  value={data.og_description}
                  onChange={(e) => onHandleChange(e, setData)}
                  placeholder={input.og_description}
               />
               <InputError message={errors.og_description} />
            </div>

            <div className="mt-8">
               <LoadingButton loading={processing}>{button.save_changes}</LoadingButton>
            </div>
         </form>
      </Card>
   );
};

export default SEO;
