import Combobox from '@/components/combobox';
import { DateTimePicker } from '@/components/datetime-picker';
import InputError from '@/components/input-error';
import LoadingButton from '@/components/loading-button';
import TiptapEditor from '@/components/text-editor/tiptap-editor';
import { Accordion, AccordionContent, AccordionItem } from '@/components/ui/accordion';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/hooks/use-auth';
import DashboardLayout from '@/layouts/dashboard/layout';
import { onHandleChange } from '@/lib/inertia';
import { SharedData } from '@/types/global';
import { useForm } from '@inertiajs/react';
import { ReactNode, useMemo } from 'react';

interface Props extends SharedData {
   categories: ExamCategory[];
   instructors: Instructor[];
}

const CreateExam = (props: Props) => {
   const { user } = useAuth();
   const { categories, instructors, system, translate } = props;
   const { input } = translate;

   const { data, setData, post, errors, processing } = useForm({
      title: '',
      short_description: '',
      description: '',
      status: 'draft',
      level: '',
      pricing_type: 'paid',
      price: '',
      discount: false as boolean,
      discount_price: '',
      duration_hours: 1,
      duration_minutes: 0,
      pass_mark: 50,
      max_attempts: 3,
      total_marks: 100,
      expiry_type: 'lifetime',
      expiry_duration: new Date(),
      thumbnail: null as File | null,
      instructor_id: user.role === 'admin' && system.sub_type === 'collaborative' ? '' : user.instructor_id,
      exam_category_id: '',
   });

   // Handle form submission
   const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      post(route('exams.store'));
   };

   const transformedCategories = useMemo(() => {
      return categories.map((category) => ({
         label: category.title,
         value: category.id.toString(),
      }));
   }, [categories]);

   const transformedInstructors = useMemo(() => {
      return instructors.map((instructor) => ({
         label: instructor.user.name,
         value: instructor.id.toString(),
      }));
   }, [instructors]);

   const levels = ['beginner', 'intermediate', 'advanced'];
   const pricingTypes = ['paid', 'free'];
   const expiryTypes = ['lifetime', 'limited_time'];

   return (
      <Card className="container p-6">
         <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
               {/* Left Column */}
               <div className="space-y-4">
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
               </div>

               {/* Right Column */}
               <div className="space-y-4">
                  {user?.role === 'admin' && system?.sub_type === 'collaborative' && (
                     <div>
                        <Label htmlFor="instructor_id">Exam Instructor *</Label>
                        <Combobox
                           data={transformedInstructors || []}
                           placeholder="Select instructor"
                           defaultValue={data.instructor_id?.toString() || ''}
                           onSelect={(selected) => setData('instructor_id', selected.value as string)}
                        />
                        <InputError message={errors.instructor_id} />
                     </div>
                  )}

                  <div className="grid gap-6 md:grid-cols-2">
                     <div>
                        <Label htmlFor="exam_category_id">Category *</Label>
                        <Combobox
                           data={transformedCategories}
                           placeholder="Select category"
                           onSelect={(selected) => {
                              setData('exam_category_id', selected.value as string);
                           }}
                        />
                        <InputError message={errors.exam_category_id} />
                     </div>

                     <div>
                        <Label htmlFor="level">Difficulty Level *</Label>
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
                  </div>

                  <div className="grid gap-6 md:grid-cols-3">
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
                     </div>
                  </div>

                  <div className="grid gap-6 md:grid-cols-2">
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
                     </div>
                  </div>

                  <div>
                     <Label>Pricing Type *</Label>
                     <RadioGroup
                        defaultValue={data.pricing_type}
                        className="flex items-center space-x-4 pt-2 pb-1"
                        onValueChange={(value: string) => setData('pricing_type', value)}
                     >
                        {pricingTypes.map((type) => (
                           <div key={type} className="flex items-center space-x-2">
                              <RadioGroupItem className="cursor-pointer" id={type} value={type} />
                              <Label htmlFor={type} className="cursor-pointer capitalize">
                                 {type}
                              </Label>
                           </div>
                        ))}
                     </RadioGroup>
                     <InputError message={errors.pricing_type} />

                     <Accordion collapsible type="single" value={data.pricing_type}>
                        <AccordionItem value="paid" className="border-none">
                           <AccordionContent className="space-y-4 p-0.5">
                              <div className="pt-3">
                                 <Label htmlFor="price">Price *</Label>
                                 <Input
                                    type="number"
                                    name="price"
                                    value={data.price.toString()}
                                    onChange={(e) => setData('price', e.target.value)}
                                    placeholder="Enter your exam price ($0)"
                                 />
                                 <InputError message={errors.price} />
                              </div>

                              <div className="space-y-2">
                                 <div className="flex items-center space-x-2">
                                    <Checkbox
                                       id="discount"
                                       name="discount"
                                       checked={data.discount}
                                       onCheckedChange={(checked) => {
                                          setData('discount', checked === true);
                                       }}
                                    />
                                    <Label htmlFor="discount" className="cursor-pointer">
                                       Exam Discount
                                    </Label>
                                 </div>

                                 {data.discount && (
                                    <div>
                                       <Input
                                          type="number"
                                          name="discount_price"
                                          value={data.discount_price.toString()}
                                          onChange={(e) => setData('discount_price', e.target.value)}
                                          placeholder="Enter discount price"
                                       />
                                       <InputError message={errors.discount_price} />
                                    </div>
                                 )}
                              </div>
                           </AccordionContent>
                        </AccordionItem>
                     </Accordion>
                  </div>

                  <div>
                     <Label>{input.expiry_period_type}</Label>
                     <RadioGroup
                        defaultValue={data.expiry_type}
                        className="flex items-center space-x-4 pt-2 pb-1"
                        onValueChange={(value) => setData('expiry_type', value)}
                     >
                        {expiryTypes.map((expiry) => (
                           <div key={expiry} className="flex items-center space-x-2">
                              <RadioGroupItem className="cursor-pointer" id={expiry} value={expiry} />
                              <Label htmlFor={expiry} className="capitalize">
                                 {expiry}
                              </Label>
                           </div>
                        ))}
                     </RadioGroup>
                     <InputError message={errors.expiry_type} />

                     <Accordion collapsible type="single" value={data.expiry_type}>
                        <AccordionItem value="limited_time" className="border-none">
                           <AccordionContent className="space-y-4 p-0.5">
                              <div className="pt-3">
                                 <Label htmlFor="expiry_duration">{input.expiry_date}</Label>
                                 <DateTimePicker date={data.expiry_duration} setDate={(date) => setData('expiry_duration', date)} />
                                 <InputError message={errors.expiry_duration} />
                              </div>
                           </AccordionContent>
                        </AccordionItem>
                     </Accordion>
                  </div>

                  <div>
                     <Label htmlFor="thumbnail">Thumbnail</Label>
                     <Input
                        type="file"
                        name="thumbnail"
                        onChange={(e) => {
                           const file = e.target.files?.[0];
                           if (file) {
                              setData('thumbnail', file);
                           }
                        }}
                     />
                     <InputError message={errors.thumbnail} />
                  </div>
               </div>
            </div>

            <div className="col-span-2 mt-6 text-right">
               <LoadingButton loading={processing}>Create Exam</LoadingButton>
            </div>
         </form>
      </Card>
   );
};

CreateExam.layout = (page: ReactNode) => <DashboardLayout children={page} />;

export default CreateExam;
