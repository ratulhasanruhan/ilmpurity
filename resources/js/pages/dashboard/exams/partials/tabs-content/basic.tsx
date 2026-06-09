import Combobox from '@/components/combobox';
import InputError from '@/components/input-error';
import LoadingButton from '@/components/loading-button';
import TiptapEditor from '@/components/text-editor/tiptap-editor';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { onHandleChange } from '@/lib/inertia';
import { useForm, usePage } from '@inertiajs/react';
import { useMemo } from 'react';
import { ExamUpdateProps } from '../../update';

const Basic = () => {
   const { props } = usePage<ExamUpdateProps>();
   const { auth, system, tab, categories, exam, instructors } = props;

   const { data, setData, post, errors, processing } = useForm({
      tab: tab,
      title: exam.title || '',
      short_description: exam.short_description || '',
      description: exam.description || '',
      status: exam.status || 'draft',
      level: exam.level || '',
      instructor_id: exam.instructor_id || '',
      exam_category_id: exam.exam_category_id || '',
   });

   // Handle form submission
   const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      post(route('exams.update', { exam: exam.id }));
   };

   const transformedCategories = useMemo(() => {
      return categories.map((category) => ({
         label: category.title,
         value: category.id.toString(),
      }));
   }, [categories]);

   const transformedInstructors = instructors?.map((instructor) => ({
      label: instructor.user.name,
      value: instructor.id.toString(),
   }));

   const levels = ['beginner', 'intermediate', 'advanced'];
   const statuses = ['draft', 'published', 'archived'];

   const selectedCategory = categories.find((cat) => cat.id === data.exam_category_id);

   return (
      <Card className="container p-4 sm:p-6">
         <form onSubmit={handleSubmit} className="space-y-4">
            <div>
               <Label>Exam Title *</Label>
               <Input name="title" value={data.title} onChange={(e) => onHandleChange(e, setData)} placeholder="Enter exam title" />
               <InputError message={errors.title} />
            </div>

            <div>
               <Label>Short Description</Label>
               <Textarea
                  rows={5}
                  name="short_description"
                  value={data.short_description}
                  onChange={(e) => onHandleChange(e, setData)}
                  placeholder="Brief description for exam cards"
               />
               <InputError message={errors.short_description} />
            </div>

            <div>
               <Label>Description</Label>
               <TiptapEditor
                  ssr={true}
                  output="html"
                  placeholder={{
                     paragraph: 'Enter detailed exam description...',
                     imageCaption: 'Enter detailed exam description...',
                  }}
                  contentMinHeight={256}
                  contentMaxHeight={640}
                  initialContent={data.description}
                  onContentChange={(value) =>
                     setData((prev) => ({
                        ...prev,
                        description: value as string,
                     }))
                  }
               />
               <InputError message={errors.description} />
            </div>

            {auth.user.role === 'admin' && system.sub_type === 'collaborative' && (
               <div>
                  <Label>Exam Instructor *</Label>
                  <Combobox
                     defaultValue={data.instructor_id.toString()}
                     data={transformedInstructors || []}
                     placeholder="Select instructor"
                     onSelect={(selected) => setData('instructor_id', selected.value as string)}
                  />
                  <InputError message={errors.instructor_id} />
               </div>
            )}

            <div className="grid gap-6 md:grid-cols-2">
               <div>
                  <Label>Category *</Label>
                  <Combobox
                     data={transformedCategories}
                     placeholder="Select category"
                     defaultValue={selectedCategory?.title || ''}
                     onSelect={(selected) => {
                        setData('exam_category_id', selected.value as string);
                     }}
                  />
                  <InputError message={errors.exam_category_id} />
               </div>

               <div>
                  <Label>Difficulty Level *</Label>
                  <Select value={data.level} onValueChange={(value) => setData('level', value)}>
                     <SelectTrigger>
                        <SelectValue placeholder="Select level" />
                     </SelectTrigger>
                     <SelectContent>
                        {levels.map((level) => (
                           <SelectItem key={level} value={level} className="capitalize">
                              {level}
                           </SelectItem>
                        ))}
                     </SelectContent>
                  </Select>
                  <InputError message={errors.level} />
               </div>

               <div>
                  <Label>Status *</Label>
                  <Select value={data.status} onValueChange={(value) => setData('status', value as any)}>
                     <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                     </SelectTrigger>
                     <SelectContent>
                        {statuses.map((status) => (
                           <SelectItem key={status} value={status} className="capitalize">
                              {status}
                           </SelectItem>
                        ))}
                     </SelectContent>
                  </Select>
                  <InputError message={errors.status} />
               </div>
            </div>

            <div className="mt-8">
               <LoadingButton loading={processing}>Save Changes</LoadingButton>
            </div>
         </form>
      </Card>
   );
};

export default Basic;
