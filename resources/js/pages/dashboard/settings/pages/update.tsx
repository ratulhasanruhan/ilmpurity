import InputError from '@/components/input-error';
import TiptapEditor from '@/components/text-editor/tiptap-editor';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import DashboardLayout from '@/layouts/dashboard/layout';
import { onHandleChange } from '@/lib/inertia';
import { SharedData } from '@/types/global';
import { Head, useForm, usePage } from '@inertiajs/react';

interface Props extends SharedData {
   page: Page;
}

const Update = ({ page }: Props) => {
   const { props } = usePage<SharedData>();
   const { translate } = props;
   const { settings, input, common, button } = translate;
   const { data, setData, put, errors, processing } = useForm({
      name: page.name,
      slug: page.slug,
      title: page.title,
      description: page.description,
      meta_description: page.meta_description,
      meta_keywords: page.meta_keywords,
      active: page.active,
   });

   // Handle form submission
   const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();

      put(route('settings.custom-page.update', page.id));
   };

   return (
      <>
         <Head title={settings.edit_custom_page} />

         <div className="container mx-auto space-y-10 px-4 py-6">
            <div className="mb-6 flex items-center justify-between">
               <h1 className="text-2xl font-bold text-gray-800">{settings.edit_custom_page}</h1>
            </div>

            <Card className="p-4 sm:p-6">
               <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                     <Label>{common.title}</Label>
                     <Input name="title" value={data.title} onChange={(e) => onHandleChange(e, setData)} placeholder={input.page_title_placeholder} />
                     <InputError message={errors.title} />
                  </div>

                  <div>
                     <Label>{common.description}</Label>
                     <TiptapEditor
                        ssr={true}
                        output="html"
                        placeholder={{
                           paragraph: input.description,
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

                  <div>
                     <Label>{input.meta_description}</Label>
                     <Textarea
                        rows={3}
                        name="meta_description"
                        value={data.meta_description}
                        onChange={(e) => onHandleChange(e, setData)}
                        placeholder={input.meta_description_placeholder}
                     />
                     <InputError message={errors.meta_description} />
                  </div>

                  <div>
                     <Label>{input.meta_keywords}</Label>
                     <Input
                        name="meta_keywords"
                        value={data.meta_keywords}
                        onChange={(e) => onHandleChange(e, setData)}
                        placeholder={input.meta_keywords_placeholder}
                     />
                     <InputError message={errors.meta_keywords} />
                  </div>

                  <div>
                     <Label>{common.active}</Label>
                     <RadioGroup
                        defaultValue={data.active ? 'on' : 'off'}
                        className="flex items-center space-x-4 pt-2 pb-1"
                        onValueChange={(value) => setData('active', value == 'on' ? true : false)}
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
                     <InputError message={errors.active} />
                  </div>

                  <div>
                     <Button type="submit" disabled={processing}>
                        {processing ? button.saving : button.save_changes}
                     </Button>
                  </div>
               </form>
            </Card>
         </div>
      </>
   );
};

Update.layout = (page: React.ReactNode) => <DashboardLayout children={page} />;

export default Update;
