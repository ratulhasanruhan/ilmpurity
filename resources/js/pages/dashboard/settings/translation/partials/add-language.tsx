import Combobox from '@/components/combobox';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import languages from '@/data/languages';
import { SharedData } from '@/types/global';
import { useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';

const AddLanguage = () => {
   const { props } = usePage<SharedData>();
   const { translate } = props;
   const { button, common } = translate;
   const [open, setOpen] = useState(false);

   const { data, setData, post, errors, clearErrors } = useForm({
      code: 'en',
      name: 'English',
      nativeName: 'English',
   });

   const submit = (e: React.FormEvent) => {
      e.preventDefault();
      clearErrors();

      post(route('language.store'), {
         onSuccess() {
            setOpen(false);
         },
      });
   };

   const transformedLanguages = languages.map((lang) => ({
      label: lang.name,
      value: lang.name,
   }));

   return (
      <Dialog open={open} onOpenChange={setOpen}>
         <DialogTrigger>
            <Button>{button.add_language}</Button>
         </DialogTrigger>
         <DialogContent>
            <DialogHeader>
               <DialogTitle className="text-xl font-medium">{button.add_language}</DialogTitle>
            </DialogHeader>

            <form onSubmit={submit} className="flex h-full flex-col justify-between">
               <div>
                  <Label>{common.language}</Label>

                  <Combobox
                     data={transformedLanguages}
                     placeholder="Select a language"
                     defaultValue={languages.find((lang) => lang.code === data.code)?.name}
                     onSelect={(selected) => {
                        const lang = languages.find((lang) => lang.name === selected.value);
                        setData('code', lang?.code as string);
                        setData('name', lang?.name as string);
                        setData('nativeName', lang?.nativeName as string);
                     }}
                  />

                  <InputError message={errors.code} />
               </div>

               <div className="mt-10 flex justify-end gap-4">
                  <Button variant="outline" type="button" onClick={() => setOpen(false)}>
                     {button.cancel}
                  </Button>
                  <Button type="submit">{button.create}</Button>
               </div>
            </form>
         </DialogContent>
      </Dialog>
   );
};

export default AddLanguage;
