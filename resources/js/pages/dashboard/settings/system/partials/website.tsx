import Combobox from '@/components/combobox';
import InputError from '@/components/input-error';
import LoadingButton from '@/components/loading-button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import currencies from '@/data/currencies';
import { onHandleChange } from '@/lib/inertia';
import { SharedData } from '@/types/global';
import { useForm, usePage } from '@inertiajs/react';
import { SystemProps } from '..';

interface MediaFields {
   new_logo_dark: null | File;
   new_logo_light: null | File;
   new_favicon: null | File;
   new_banner: null | File;
}

const Website = () => {
   const { props } = usePage<SharedData & SystemProps>();
   const { translate } = props;
   const { input, settings } = translate;

   const mediaFields: MediaFields = {
      new_logo_dark: null,
      new_logo_light: null,
      new_favicon: null,
      new_banner: null,
   };

   const { data, setData, post, errors, processing } = useForm({
      ...(props.system.fields as SystemFields),
      ...(mediaFields as MediaFields),
   });

   const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();

      post(route('settings.system.update', { id: props.system.id }));
   };

   return (
      <Card className="p-4 sm:p-6">
         <form onSubmit={handleSubmit} className="space-y-6">
            {/* Website Information */}
            <div className="border-b pb-6">
               <h2 className="mb-4 text-xl font-semibold">{settings.website_information}</h2>

               <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div>
                     <Label>{input.website_name}</Label>
                     <Input
                        name="name"
                        value={data.name || ''}
                        onChange={(e) => onHandleChange(e, setData)}
                        placeholder={input.website_name_placeholder}
                     />
                     <InputError message={errors.name} />
                  </div>

                  <div>
                     <Label>{input.website_title}</Label>
                     <Input
                        name="title"
                        value={data.title || ''}
                        onChange={(e) => onHandleChange(e, setData)}
                        placeholder={input.website_title_placeholder}
                     />
                     <InputError message={errors.title} />
                  </div>

                  <div className="md:col-span-2">
                     <Label>{input.keywords}</Label>
                     <Input
                        name="keywords"
                        value={data.keywords || ''}
                        onChange={(e) => onHandleChange(e, setData)}
                        placeholder={input.keywords_placeholder}
                     />
                     <InputError message={errors.keywords} />
                  </div>

                  <div className="md:col-span-2">
                     <Label>{input.description}</Label>
                     <Textarea
                        rows={4}
                        name="description"
                        value={data.description || ''}
                        onChange={(e) => onHandleChange(e, setData)}
                        placeholder={input.description_placeholder}
                     />
                     <InputError message={errors.description} />
                  </div>

                  <div>
                     <Label>{input.author}</Label>
                     <Input
                        name="author"
                        value={data.author || ''}
                        onChange={(e) => onHandleChange(e, setData)}
                        placeholder={input.author_name_placeholder}
                     />
                     <InputError message={errors.author} />
                  </div>

                  <div>
                     <Label>{input.slogan}</Label>
                     <Input name="slogan" value={data.slogan || ''} onChange={(e) => onHandleChange(e, setData)} placeholder={input.slogan} />
                     <InputError message={errors.slogan} />
                  </div>
               </div>
            </div>

            {/* Contact Information */}
            <div className="border-b pb-6">
               <h2 className="mb-4 text-xl font-semibold">Contact Information</h2>

               <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div>
                     <Label>System Email *</Label>
                     <Input
                        type="email"
                        name="email"
                        value={data.email || ''}
                        onChange={(e) => onHandleChange(e, setData)}
                        placeholder="Enter System Email"
                     />
                     <InputError message={errors.email} />
                  </div>

                  <div>
                     <Label>Phone</Label>
                     <Input name="phone" value={data.phone || ''} onChange={(e) => onHandleChange(e, setData)} placeholder="Enter Phone Number" />
                     <InputError message={errors.phone} />
                  </div>
               </div>
            </div>

            {/* Media Settings */}
            <div className="border-b pb-6">
               <h2 className="mb-4 text-xl font-semibold">Media</h2>

               <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div>
                     <Label>Logo Dark</Label>
                     <Input
                        type="file"
                        name="new_logo_dark"
                        accept="image/*"
                        onChange={(e) => onHandleChange(e, setData)}
                        placeholder="Select Logo"
                     />
                     <InputError message={errors.new_logo_dark} />
                  </div>

                  <div>
                     <Label>Logo Light</Label>
                     <Input
                        type="file"
                        name="new_logo_light"
                        accept="image/*"
                        onChange={(e) => onHandleChange(e, setData)}
                        placeholder="Select Logo"
                     />
                     <InputError message={errors.new_logo_light} />
                  </div>

                  <div>
                     <Label>Favicon</Label>
                     <Input
                        type="file"
                        name="new_favicon"
                        accept="image/*"
                        onChange={(e) => onHandleChange(e, setData)}
                        placeholder="Select Favicon"
                     />
                     <InputError message={errors.new_favicon} />
                  </div>

                  <div>
                     <Label>Banner</Label>
                     <Input type="file" name="new_banner" accept="image/*" onChange={(e) => onHandleChange(e, setData)} placeholder="Select Banner" />
                     <InputError message={errors.new_banner} />
                  </div>
               </div>
            </div>

            <div>
               <h2 className="mb-4 text-xl font-semibold">Additional Settings</h2>

               <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                  <div>
                     <Label>{'Website Direction'}</Label>
                     <Select value={data.direction} onValueChange={(value) => setData('direction', value)}>
                        <SelectTrigger>
                           <SelectValue placeholder={input.select_option} />
                        </SelectTrigger>
                        <SelectContent>
                           <SelectItem value="none">None</SelectItem>
                           <SelectItem value="ltr">LTR</SelectItem>
                           <SelectItem value="rtl">RTL</SelectItem>
                        </SelectContent>
                     </Select>
                     <InputError message={errors.direction} />
                  </div>

                  <div>
                     <Label>{'Default Theme'}</Label>
                     <Select value={data.theme} onValueChange={(value) => setData('theme', value as Appearance)}>
                        <SelectTrigger>
                           <SelectValue placeholder={input.select_option} />
                        </SelectTrigger>
                        <SelectContent>
                           <SelectItem value="system">System</SelectItem>
                           <SelectItem value="light">Light</SelectItem>
                           <SelectItem value="dark">Dark</SelectItem>
                        </SelectContent>
                     </Select>
                     <InputError message={errors.theme} />
                  </div>

                  <div>
                     <Label>{'Language Selector'}</Label>
                     <Select value={data.language_selector ? '1' : '0'} onValueChange={(value) => setData('language_selector', value === '1')}>
                        <SelectTrigger>
                           <SelectValue placeholder={input.select_option} />
                        </SelectTrigger>
                        <SelectContent>
                           <SelectItem value="1">Show</SelectItem>
                           <SelectItem value="0">Hide</SelectItem>
                        </SelectContent>
                     </Select>
                     <InputError message={errors.language_selector} />
                  </div>

                  <div>
                     <Label>{`Course Selling Currency (${data.selling_currency})`}</Label>
                     <Combobox
                        data={currencies}
                        defaultValue={data.selling_currency || ''}
                        placeholder="Select a selling currency"
                        onSelect={(selected) => setData('selling_currency', selected.value)}
                     />
                     <InputError message={errors.selling_currency} />
                  </div>

                  <div>
                     <Label>{'Course Selling Tax (%)'}</Label>
                     <Input
                        name="selling_tax"
                        value={data.selling_tax || ''}
                        onChange={(e) => onHandleChange(e, setData)}
                        placeholder="Enter Course Selling Tax Percentage"
                     />
                     <InputError message={errors.selling_tax} />
                  </div>

                  {/* Other Settings */}
                  {props.system.sub_type === 'collaborative' && (
                     <div>
                        <Label>{'Instructor Revenue (%)'}</Label>
                        <Input
                           name="instructor_revenue"
                           value={data.instructor_revenue || ''}
                           onChange={(e) => onHandleChange(e, setData)}
                           placeholder="Enter Instructor Revenue Percentage"
                        />
                        <InputError message={errors.instructor_revenue} />
                     </div>
                  )}
               </div>
            </div>

            <div className="flex justify-end">
               <LoadingButton loading={processing}>Save Changes</LoadingButton>
            </div>
         </form>
      </Card>
   );
};

export default Website;
