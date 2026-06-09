import Combobox from '@/components/combobox';
import InputError from '@/components/input-error';
import LoadingButton from '@/components/loading-button';
import TiptapEditor from '@/components/text-editor/tiptap-editor';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import courseLanguages from '@/data/course-languages';
import DashboardLayout from '@/layouts/dashboard/layout';
import { onHandleChange } from '@/lib/inertia';
import { useForm, usePage } from '@inertiajs/react';
import { ReactNode, useMemo } from 'react';
import { CourseUpdateProps } from '../update';

const Basic = () => {
   const { props } = usePage<CourseUpdateProps>();
   const { auth, system, tab, labels, categories, course, instructors, translate } = props;
   const { input, button, common } = translate;

   const { data, setData, post, errors, processing } = useForm({
      tab: tab,
      title: course.title,
      short_description: course.short_description,
      description: course.description,
      status: course.status,
      level: course.level,
      language: course.language,
      instructor_id: course.instructor_id,
      drip_content: Boolean(course.drip_content),
      course_category_id: course.course_category_id,
      course_category_child_id: course.course_category_child_id,
   });

   // Handle form submission
   const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();

      post(route('courses.update', { id: course.id }));
   };

   const transformedCategories = useMemo(() => {
      return categories.flatMap((category) => {
         // Parent categories
         const categoryItem = {
            id: category.id,
            label: category.title,
            value: category.title,
            child_id: '',
         };

         // Child categories
         const childItems =
            category.category_children?.map((child) => ({
               id: child.course_category_id,
               label: `--${child.title}`,
               value: child.title,
               child_id: child.id,
            })) || [];

         return [categoryItem, ...childItems]; // Combine parent + children
      });
   }, [categories]);

   const transformedInstructors = instructors?.map((instructor) => ({
      label: instructor.user.name,
      value: instructor.id as string,
   }));

   let selectedCategory: any;
   categories.map((category) => {
      if (course.course_category_child_id) {
         category.category_children?.map((child) => {
            if (child.id === data.course_category_child_id) {
               selectedCategory = child;
               return;
            }
         });
      } else {
         if (category.id === data.course_category_id) {
            selectedCategory = category;
            return;
         }
      }
   });

   return (
      <Card className="container p-4 sm:p-6">
         <form onSubmit={handleSubmit} className="space-y-4">
            <div>
               <Label>{input.title} *</Label>
               <Input name="title" value={data.title} onChange={(e) => onHandleChange(e, setData)} placeholder={input.title_placeholder} />
               <InputError message={errors.title} />
            </div>

            <div>
               <Label>{input.short_description}</Label>
               <Textarea
                  rows={5}
                  name="short_description"
                  value={data.short_description}
                  onChange={(e) => onHandleChange(e, setData)}
                  placeholder={input.short_description_placeholder}
               />
               <InputError message={errors.short_description} />
            </div>

            <div>
               <Label>{input.description}</Label>
               <TiptapEditor
                  ssr={true}
                  output="html"
                  placeholder={{
                     paragraph: input.description_placeholder,
                     imageCaption: input.description_placeholder,
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
                  <Label>{input.course_instructor} *</Label>
                  <Combobox
                     defaultValue={data.instructor_id as string}
                     data={transformedInstructors || []}
                     placeholder={input.instructor_placeholder}
                     onSelect={(selected) => setData('instructor_id', selected.value)}
                  />
                  <InputError message={errors.instructor_id} />
               </div>
            )}

            <div className="grid gap-6 md:grid-cols-2">
               <div>
                  <Label>{input.category} *</Label>
                  <Combobox
                     data={transformedCategories}
                     placeholder={input.category_placeholder}
                     defaultValue={selectedCategory?.title || ''}
                     onSelect={(selected) => {
                        setData('course_category_id', selected.id as number);
                        setData('course_category_child_id', selected.child_id as number);
                     }}
                  />
                  <InputError message={errors.course_category_id} />
               </div>

               <div>
                  <Label>{input.course_level} *</Label>
                  <Select value={data.level} onValueChange={(value) => setData('level', value)}>
                     <SelectTrigger>
                        <SelectValue placeholder={input.course_level_placeholder} />
                     </SelectTrigger>
                     <SelectContent>
                        {labels.map((label) => (
                           <SelectItem key={label} value={label} className="capitalize">
                              {label}
                           </SelectItem>
                        ))}
                     </SelectContent>
                  </Select>
                  <InputError message={errors.level} />
               </div>

               <div>
                  <Label>{input.course_language} *</Label>
                  <Combobox
                     defaultValue={data.language}
                     data={courseLanguages}
                     placeholder={input.course_language_placeholder}
                     onSelect={(selected) => setData('language', selected.value)}
                  />
                  <InputError message={errors.language} />
               </div>

               <div>
                  <Label>{input.enable_drip_content} *</Label>
                  <RadioGroup
                     defaultValue={data.drip_content ? 'on' : 'off'}
                     className="flex items-center space-x-4 pt-2 pb-1"
                     onValueChange={(value) => setData('drip_content', value == 'on' ? true : false)}
                  >
                     <div className="flex items-center space-x-2">
                        <RadioGroupItem className="cursor-pointer" id="off" value="off" />
                        <Label htmlFor="off">{common.off}</Label>
                     </div>
                     <div className="flex items-center space-x-2">
                        <RadioGroupItem className="cursor-pointer" id="on" value="on" />
                        <Label htmlFor="on">{common.on}</Label>
                     </div>
                  </RadioGroup>
                  <InputError message={errors.drip_content} />
               </div>
            </div>

            <div className="mt-8">
               <LoadingButton loading={processing}>{button.save_changes}</LoadingButton>
            </div>
         </form>
      </Card>
   );
};

Basic.layout = (page: ReactNode) => <DashboardLayout children={page} />;

export default Basic;
