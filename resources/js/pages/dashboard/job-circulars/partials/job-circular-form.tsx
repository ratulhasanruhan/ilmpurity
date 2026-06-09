import Combobox from '@/components/combobox';
import { DateTimePicker } from '@/components/datetime-picker';
import InputError from '@/components/input-error';
import Switch from '@/components/switch';
import TagInput from '@/components/tag-input';
import TiptapEditor from '@/components/text-editor/tiptap-editor';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import currencies from '@/data/currencies';
import { generateSlug } from '@/lib/utils';
import { SharedData } from '@/types/global';
import { Link, useForm, usePage } from '@inertiajs/react';
import { Briefcase, DollarSign, FileText, Save } from 'lucide-react';
import { FormEvent, useEffect } from 'react';

interface FormProps extends SharedData {
   jobTypes: Record<string, string>;
   workTypes: Record<string, string>;
   experienceLevels: Record<string, string>;
   statuses: Record<string, string>;
}

const JobCircularForm = ({ jobCircular }: { jobCircular?: JobCircular }) => {
   const { props } = usePage<FormProps>();
   const { jobTypes, workTypes, experienceLevels, statuses, translate } = props;
   const { dashboard, input, button } = translate;

   const { data, setData, post, put, processing, errors } = useForm({
      title: jobCircular ? jobCircular.title : '',
      slug: jobCircular ? jobCircular.slug : '',
      description: jobCircular ? jobCircular.description : '',
      experience_level: jobCircular ? jobCircular.experience_level : 'mid',
      location: jobCircular ? jobCircular.location : '',
      salary_min: jobCircular ? jobCircular.salary_min?.toString() : '',
      salary_max: jobCircular ? jobCircular.salary_max?.toString() : '',
      salary_currency: jobCircular ? jobCircular.salary_currency : '',
      salary_negotiable: jobCircular ? jobCircular.salary_negotiable : false,
      application_deadline: jobCircular ? new Date(jobCircular.application_deadline) : new Date(),
      contact_email: jobCircular ? jobCircular.contact_email : '',
      skills_required: jobCircular ? jobCircular.skills_required : [''],
      positions_available: jobCircular ? jobCircular.positions_available : 1,
      job_type: jobCircular ? jobCircular.job_type : 'full-time',
      work_type: jobCircular ? jobCircular.work_type : 'on-site',
      status: jobCircular ? jobCircular.status : 'draft',
   });

   const handleSubmit = (e: FormEvent) => {
      e.preventDefault();

      if (jobCircular) {
         put(route('job-circulars.update', jobCircular.id));
      } else {
         post(route('job-circulars.store'));
      }
   };

   useEffect(() => {
      setData('slug', generateSlug(data.title));
   }, [data.title]);

   return (
      <form onSubmit={handleSubmit} className="space-y-6">
         {/* Basic Information */}
         <Card>
            <CardHeader className="p-4 sm:p-6">
               <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  {dashboard.basic_information}
               </CardTitle>
               <CardDescription>{dashboard.provide_essential_job_details}</CardDescription>
            </CardHeader>

            <CardContent className="space-y-4 p-4 pt-0 sm:p-6 sm:pt-0">
               <div className="grid gap-4 md:grid-cols-2">
                  <div>
                     <Label htmlFor="title">{input.job_title}</Label>
                     <Input
                        id="title"
                        value={data.title}
                        onChange={(e) => setData('title', e.target.value)}
                        placeholder={input.job_title_placeholder}
                     />
                     <InputError message={errors.title} />
                  </div>

                  <div>
                     <Label htmlFor="slug">{input.url_slug}</Label>
                     <Input id="slug" value={data.slug} onChange={(e) => setData('slug', e.target.value)} placeholder={input.url_slug_placeholder} />
                     <InputError message={errors.slug} />
                  </div>
               </div>

               <div>
                  <Label htmlFor="description">{input.job_description}</Label>
                  <TiptapEditor
                     ssr={true}
                     output="html"
                     placeholder={{
                        paragraph: input.job_description_placeholder,
                        imageCaption: input.image_url_placeholder,
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

               <div className="grid gap-4 md:grid-cols-2">
                  <div>
                     <Label htmlFor="status">{input.status}</Label>
                     <Select value={data.status} onValueChange={(value) => setData('status', value as 'draft' | 'active' | 'closed')}>
                        <SelectTrigger>
                           <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                           {Object.entries(statuses).map(([key, label]) => (
                              <SelectItem key={key} value={key}>
                                 {label}
                              </SelectItem>
                           ))}
                        </SelectContent>
                     </Select>
                     <InputError message={errors.status} />
                  </div>

                  <div>
                     <Label htmlFor="contact_email">{input.contact_email}</Label>
                     <Input
                        id="contact_email"
                        type="email"
                        value={data.contact_email}
                        onChange={(e) => setData('contact_email', e.target.value)}
                        placeholder={input.contact_email_placeholder}
                     />
                     <InputError message={errors.contact_email} />
                  </div>
               </div>
            </CardContent>
         </Card>

         {/* Job Details */}
         <Card>
            <CardHeader className="p-4 sm:p-6">
               <CardTitle className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5" />
                  {dashboard.job_details}
               </CardTitle>
               <CardDescription>{dashboard.job_details_title}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 p-4 pt-0 sm:p-6 sm:pt-0">
               <div className="grid gap-4 md:grid-cols-4">
                  <div>
                     <Label htmlFor="job_type">{input.job_type}</Label>
                     <Select
                        value={data.job_type}
                        onValueChange={(value) => setData('job_type', value as 'full-time' | 'part-time' | 'contract' | 'internship' | 'freelance')}
                     >
                        <SelectTrigger>
                           <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                           {Object.entries(jobTypes).map(([key, label]) => (
                              <SelectItem key={key} value={key}>
                                 {label}
                              </SelectItem>
                           ))}
                        </SelectContent>
                     </Select>
                     <InputError message={errors.job_type} />
                  </div>

                  <div>
                     <Label htmlFor="work_type">{input.work_type}</Label>
                     <Select value={data.work_type} onValueChange={(value) => setData('work_type', value as 'on-site' | 'remote' | 'hybrid')}>
                        <SelectTrigger>
                           <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                           {Object.entries(workTypes).map(([key, label]) => (
                              <SelectItem key={key} value={key}>
                                 {label}
                              </SelectItem>
                           ))}
                        </SelectContent>
                     </Select>
                     <InputError message={errors.work_type} />
                  </div>

                  <div>
                     <Label htmlFor="experience_level">{input.experience_level}</Label>
                     <Select
                        value={data.experience_level}
                        onValueChange={(value) => setData('experience_level', value as 'entry' | 'mid' | 'senior' | 'executive')}
                     >
                        <SelectTrigger>
                           <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                           {Object.entries(experienceLevels).map(([key, label]) => (
                              <SelectItem key={key} value={key}>
                                 {label}
                              </SelectItem>
                           ))}
                        </SelectContent>
                     </Select>
                     <InputError message={errors.experience_level} />
                  </div>

                  <div>
                     <Label htmlFor="positions_available">{input.positions_available}</Label>
                     <Input
                        min="1"
                        max="100"
                        type="number"
                        value={data.positions_available}
                        onChange={(e) => setData('positions_available', parseInt(e.target.value) || 1)}
                     />
                     <InputError message={errors.positions_available} />
                  </div>
               </div>

               <div className="grid gap-4 md:grid-cols-2">
                  <div>
                     <Label htmlFor="location">{input.location}</Label>
                     <Input
                        type="text"
                        value={data.location}
                        onChange={(e) => setData('location', e.target.value)}
                        placeholder={input.location_placeholder}
                     />
                     <InputError message={errors.location} />
                  </div>

                  <div>
                     <Label htmlFor="application_deadline">{input.application_deadline}</Label>
                     <DateTimePicker date={data.application_deadline} setDate={(date) => setData('application_deadline', date)} />
                     <InputError message={errors.application_deadline} />
                  </div>
               </div>

               <div>
                  <Label htmlFor="skills_required">{input.skills_required}</Label>
                  <TagInput
                     defaultTags={data.skills_required}
                     placeholder={input.skills_tag_placeholder}
                     onChange={(values: any) => setData('skills_required', values)}
                  />
                  <InputError message={errors.skills_required} />
               </div>
            </CardContent>
         </Card>

         {/* Salary Information */}
         <Card>
            <CardHeader className="p-4 sm:p-6">
               <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  {dashboard.salary_information}
               </CardTitle>
               <CardDescription>{dashboard.salary_information_title}</CardDescription>
            </CardHeader>

            <CardContent className="space-y-4 p-4 pt-0 sm:p-6 sm:pt-0">
               <div className="flex items-center space-x-2">
                  <Switch
                     id="salary_negotiable"
                     checked={data.salary_negotiable}
                     onCheckedChange={(checked) => setData('salary_negotiable', checked as any)}
                  />
                  <Label htmlFor="salary_negotiable">{input.salary_is_negotiable}</Label>
               </div>

               {!data.salary_negotiable && (
                  <div className="grid gap-4 md:grid-cols-3">
                     <div>
                        <Label htmlFor="salary_currency">{input.currency}</Label>
                        <Combobox
                           data={currencies}
                           placeholder={input.currency_placeholder}
                           onSelect={(selected) => setData('salary_currency', selected.value)}
                        />
                        <InputError message={errors.salary_currency} />
                     </div>

                     <div>
                        <Label htmlFor="salary_min">{input.minimum_salary}</Label>
                        <Input
                           min="0"
                           type="number"
                           value={data.salary_min}
                           onChange={(e) => setData('salary_min', e.target.value)}
                           placeholder={input.minimum_salary_placeholder}
                        />
                        <InputError message={errors.salary_min} />
                     </div>

                     <div>
                        <Label htmlFor="salary_max">{input.maximum_salary}</Label>
                        <Input
                           min="0"
                           type="number"
                           value={data.salary_max}
                           onChange={(e) => setData('salary_max', e.target.value)}
                           placeholder={input.maximum_salary_placeholder}
                        />
                        <InputError message={errors.salary_max} />
                     </div>
                  </div>
               )}
            </CardContent>
         </Card>

         {/* Submit Buttons */}
         <div className="flex items-center justify-end gap-4">
            <Button type="button" variant="outline" asChild>
               <Link href={route('job-circulars.index')}>{button.cancel}</Link>
            </Button>
            <Button type="submit" disabled={processing}>
               <Save className="mr-2 h-4 w-4" />
               {jobCircular ? button.update : button.create}
            </Button>
         </div>
      </form>
   );
};

export default JobCircularForm;
