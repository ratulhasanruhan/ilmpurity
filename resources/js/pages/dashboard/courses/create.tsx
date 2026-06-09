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
import courseLanguages from '@/data/course-languages';
import DashboardLayout from '@/layouts/dashboard/layout';
import { onHandleChange } from '@/lib/inertia';
import { SharedData } from '@/types/global';
import { useForm, usePage } from '@inertiajs/react';
import { ReactNode, useMemo } from 'react';

interface Props extends SharedData {
   labels: string[];
   prices: string[];
   expiries: string[];
   categories: CourseCategory[];
   instructors: Instructor[];
}

const Index = (props: Props) => {
   const { props: pageProps } = usePage<Props>();
   const { translate } = pageProps;
   const { input, button, common } = translate;

   const user = props.auth.user;
   const { labels, prices, expiries, categories, instructors, system } = props;

   const { data, setData, post, errors, processing } = useForm({
      title: '',
      short_description: '',
      description: '',
      status: 'draft',
      level: '',
      language: '',
      pricing_type: 'paid',
      price: '',
      discount: false as boolean,
      discount_price: '',
      expiry_type: 'lifetime',
      expiry_duration: new Date(),
      drip_content: false as boolean,
      thumbnail: null,
      instructor_id: user.role === 'admin' && system.sub_type === 'collaborative' ? '' : user.instructor_id,
      course_category_id: '',
      course_category_child_id: '',
   });

   // Handle form submission
   const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();

      post(route('courses.store'));
   };

   const transformedCategories = useMemo(() => {
      return categories.flatMap((category) => {
         // Parent categories
         const categoryItem = {
            label: category.title,
            value: category.title,
            id: category.id,
            child_id: '',
         };

         // Child categories
         const childItems =
            category.category_children?.map((child) => ({
               label: `--${child.title}`,
               value: child.title,
               id: child.course_category_id,
               child_id: child.id,
            })) || [];

         return [categoryItem, ...childItems]; // Combine parent + children
      });
   }, [categories]);

   const transformedInstructors = instructors.map((instructor) => ({
      label: instructor.user.name,
      value: instructor.id as string,
   }));

   return (
      <Card className="container p-6">
         <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
               {/* Left Column */}
               <div className="space-y-4">
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
               </div>

               {/* Right Column */}
               <div className="space-y-4">
                  {user.role === 'admin' && system.sub_type === 'collaborative' && (
                     <div>
                        <Label htmlFor="instructor_id">{input.course_instructor} *</Label>
                        <Combobox
                           defaultValue={data.instructor_id as string}
                           data={transformedInstructors || []}
                           placeholder={input.course_instructor}
                           onSelect={(selected) => setData('instructor_id', selected.value)}
                        />
                        <InputError message={errors.instructor_id} />
                     </div>
                  )}

                  <div className="grid gap-6 md:grid-cols-2">
                     <div>
                        <Label htmlFor="course_category_id">{input.category} *</Label>
                        <Combobox
                           data={transformedCategories}
                           placeholder={input.category_placeholder}
                           onSelect={(selected) => {
                              setData('course_category_id', selected.id as any);
                              setData('course_category_child_id', selected.child_id as any);
                           }}
                        />
                        <InputError message={errors.course_category_id} />
                     </div>

                     <div>
                        <Label htmlFor="level">{input.course_level} *</Label>
                        <Select value={data.level} onValueChange={(value) => setData('level', value)}>
                           <SelectTrigger>
                              <SelectValue placeholder={input.course_level_placeholder} />
                           </SelectTrigger>
                           <SelectContent>
                              {labels.map((label) => (
                                 <SelectItem key={label} value={label}>
                                    {label}
                                 </SelectItem>
                              ))}
                           </SelectContent>
                        </Select>
                        <InputError message={errors.level} />
                     </div>
                  </div>

                  <div>
                     <Label>{input.course_language} *</Label>
                     <Combobox
                        data={courseLanguages}
                        placeholder={input.course_language_placeholder}
                        onSelect={(selected) => setData('language', selected.value)}
                     />
                     <InputError message={errors.language} />
                  </div>

                  <div>
                     <Label>{input.pricing_type} *</Label>
                     <RadioGroup
                        defaultValue={data.pricing_type as string}
                        className="flex items-center space-x-4 pt-2 pb-1"
                        onValueChange={(value) => setData('pricing_type', value)}
                     >
                        {prices.map((price) => (
                           <div key={price} className="flex items-center space-x-2">
                              <RadioGroupItem className="cursor-pointer" id={price} value={price} />
                              <Label htmlFor={price} className="capitalize">
                                 {price}
                              </Label>
                           </div>
                        ))}
                     </RadioGroup>
                     <InputError message={errors.pricing_type} />

                     <Accordion collapsible type="single" value={data.pricing_type as string}>
                        <AccordionItem value={prices[1]} className="border-none">
                           <AccordionContent className="space-y-4 p-0.5">
                              <div className="pt-3">
                                 <Label htmlFor="price">{input.price} *</Label>
                                 <Input
                                    type="number"
                                    name="price"
                                    value={data.price}
                                    onChange={(e) => onHandleChange(e, setData)}
                                    placeholder={input.course_price_placeholder}
                                 />
                                 <InputError message={errors.price} />
                              </div>

                              <div className="space-y-2">
                                 <div className="flex items-center space-x-2">
                                    <Checkbox
                                       id="discount"
                                       name="discount"
                                       checked={data.discount as any}
                                       onCheckedChange={(checked: boolean) => {
                                          setData('discount', checked as any);
                                       }}
                                    />
                                    <Label htmlFor="discount">{input.course_discount}</Label>
                                 </div>

                                 {data.discount && (
                                    <div>
                                       <Input
                                          type="number"
                                          name="discount_price"
                                          value={data.discount_price}
                                          onChange={(e) => onHandleChange(e, setData)}
                                          placeholder={input.discount_price_placeholder}
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
                        {expiries.map((expiry) => (
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
                        <AccordionItem value={expiries[1]} className="border-none">
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
                     <Label htmlFor="thumbnail">{input.thumbnail}</Label>
                     <Input type="file" name="thumbnail" onChange={(e) => onHandleChange(e, setData)} />
                     <InputError message={errors.thumbnail} />
                  </div>

                  <div>
                     <Label htmlFor="drip_content">{input.enable_drip_content} *</Label>
                     <RadioGroup
                        defaultValue={data.drip_content ? 'on' : 'off'}
                        className="flex items-center space-x-4 pt-2 pb-1"
                        onValueChange={(value) => setData('drip_content', value === 'on')}
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
            </div>

            <div className="col-span-2 mt-6 text-right">
               <LoadingButton loading={processing}>{button.create_course}</LoadingButton>
            </div>
         </form>
      </Card>
   );
};

Index.layout = (page: ReactNode) => <DashboardLayout children={page} />;

export default Index;
