import InputError from '@/components/input-error';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { onHandleChange } from '@/lib/inertia';

interface Props {
   data: any;
   setData: (key: string, value: any) => void;
   errors: any;
}

const ExamSeoForm = ({ data, setData, errors }: Props) => {
   return (
      <div className="space-y-4">
         <div className="rounded-lg bg-gray-50 p-4">
            <h4 className="mb-2 font-semibold text-gray-900">Search Engine Optimization</h4>
            <p className="text-sm text-gray-600">Help search engines understand your exam better with proper meta tags.</p>
         </div>

         <div>
            <Label htmlFor="meta_title">Meta Title</Label>
            <Input
               id="meta_title"
               name="meta_title"
               value={data.meta_title}
               onChange={(e) => onHandleChange(e, setData)}
               placeholder={data.title || 'Exam title'}
               maxLength={60}
            />
            <p className="mt-1 text-sm text-gray-500">{(data.meta_title || '').length}/60 characters</p>
            <InputError message={errors.meta_title} />
         </div>

         <div>
            <Label htmlFor="meta_description">Meta Description</Label>
            <Textarea
               id="meta_description"
               name="meta_description"
               value={data.meta_description}
               onChange={(e) => onHandleChange(e, setData)}
               placeholder="Brief description for search results"
               rows={3}
               maxLength={160}
            />
            <p className="mt-1 text-sm text-gray-500">{(data.meta_description || '').length}/160 characters</p>
            <InputError message={errors.meta_description} />
         </div>

         <div>
            <Label htmlFor="meta_keywords">Meta Keywords</Label>
            <Input
               id="meta_keywords"
               name="meta_keywords"
               value={data.meta_keywords}
               onChange={(e) => onHandleChange(e, setData)}
               placeholder="exam, certification, test, assessment"
            />
            <p className="mt-1 text-sm text-gray-500">Comma-separated keywords</p>
            <InputError message={errors.meta_keywords} />
         </div>

         <div className="border-t pt-4">
            <div className="mb-4 rounded-lg bg-gray-50 p-4">
               <h4 className="mb-2 font-semibold text-gray-900">Open Graph (Social Media)</h4>
               <p className="text-sm text-gray-600">Customize how your exam appears when shared on social media.</p>
            </div>

            <div>
               <Label htmlFor="og_title">OG Title</Label>
               <Input
                  id="og_title"
                  name="og_title"
                  value={data.og_title}
                  onChange={(e) => onHandleChange(e, setData)}
                  placeholder={data.title || 'Exam title'}
               />
               <InputError message={errors.og_title} />
            </div>

            <div className="mt-4">
               <Label htmlFor="og_description">OG Description</Label>
               <Textarea
                  id="og_description"
                  name="og_description"
                  value={data.og_description}
                  onChange={(e) => onHandleChange(e, setData)}
                  placeholder="Description for social media shares"
                  rows={3}
               />
               <InputError message={errors.og_description} />
            </div>
         </div>

         {(data.meta_title || data.meta_description) && (
            <div className="mt-6 rounded-lg border bg-white p-4">
               <p className="mb-2 text-sm font-semibold text-gray-600">Search Result Preview:</p>
               <div className="space-y-1">
                  <p className="text-lg font-medium text-blue-600">{data.meta_title || data.title}</p>
                  <p className="text-sm text-green-700">yoursite.com/exams/{data.slug}</p>
                  <p className="text-sm text-gray-600">{data.meta_description || data.short_description}</p>
               </div>
            </div>
         )}
      </div>
   );
};

export default ExamSeoForm;

