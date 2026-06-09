import InputError from '@/components/input-error';
import LoadingButton from '@/components/loading-button';
import TiptapEditor from '@/components/text-editor/tiptap-editor';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { onHandleChange } from '@/lib/inertia';
import { SharedData } from '@/types/global';
import { useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';

interface Props {
   title: string;
   actionComponent: React.ReactNode;
}

const CustomPageCreateForm = ({ title, actionComponent }: Props) => {
   const { props } = usePage<SharedData>();
   const { translate } = props;
   const { input, button, common } = translate;
   const [open, setOpen] = useState(false);
   const { data, setData, post, reset, errors, processing } = useForm({
      name: '',
      slug: '',
      title: '',
      description: '',
      meta_description: '',
      meta_keywords: '',
      active: true as boolean,
   });

   // Handle form submission
   const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();

      post(route('settings.custom-page.store'), {
         onSuccess: () => {
            reset();
            setOpen(false);
         },
      });
   };

   return (
      <Dialog open={open} onOpenChange={setOpen}>
         <DialogTrigger>{actionComponent}</DialogTrigger>

         <DialogContent className="p-0">
            <ScrollArea className="max-h-[90vh] p-6">
               <DialogHeader className="mb-6">
                  <DialogTitle>{title}</DialogTitle>
               </DialogHeader>

               <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                     <Label>{common.name}</Label>
                     <Input name="name" value={data.name} onChange={(e) => onHandleChange(e, setData)} placeholder={input.page_name_placeholder} />
                     <InputError message={errors.name} />
                  </div>

                  <div>
                     <Label>{input.slug}</Label>
                     <Input name="slug" value={data.slug} onChange={(e) => onHandleChange(e, setData)} placeholder={input.page_slug_placeholder} />
                     <InputError message={errors.slug} />
                  </div>

                  <div>
                     <Label>{common.title}</Label>
                     <Input name="title" value={data.title} onChange={(e) => onHandleChange(e, setData)} placeholder={input.page_title_placeholder} />
                     <InputError message={errors.title} />
                  </div>

                  <div>
                     <Label>{input.page_contents}</Label>
                     <TiptapEditor
                        ssr={false}
                        output="html"
                        placeholder={{
                           paragraph: input.description_placeholder,
                           imageCaption: input.image_url_placeholder,
                        }}
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
                     <Textarea
                        rows={2}
                        name="meta_keywords"
                        value={data.meta_keywords}
                        onChange={(e) => onHandleChange(e, setData)}
                        placeholder={input.meta_keywords_placeholder}
                     />
                     <InputError message={errors.meta_keywords} />
                  </div>

                  <div>
                     <Label>{common.status}</Label>
                     <RadioGroup value={data.active ? 'on' : 'off'} onValueChange={(value) => setData('active', value === 'on')}>
                        <div className="flex items-center space-x-2">
                           <RadioGroupItem value="off" id="off" />
                           <Label htmlFor="off">{common.off}</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                           <RadioGroupItem value="on" id="on" />
                           <Label htmlFor="on">{common.on}</Label>
                        </div>
                     </RadioGroup>
                     <InputError message={errors.active} />
                  </div>

                  <div className="flex justify-end gap-4">
                     <Button variant="outline" type="button" onClick={() => setOpen(false)}>
                        {button.cancel}
                     </Button>
                     <LoadingButton loading={processing} type="submit">
                        {button.submit}
                     </LoadingButton>
                  </div>
               </form>
            </ScrollArea>
         </DialogContent>
      </Dialog>
   );
};

export default CustomPageCreateForm;
