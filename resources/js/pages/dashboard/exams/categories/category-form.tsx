import IconPickerDialog from '@/components/icon-picker-dialog';
import InputError from '@/components/input-error';
import LoadingButton from '@/components/loading-button';
import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useLang } from '@/hooks/use-lang';
import { onHandleChange } from '@/lib/inertia';
import { useForm } from '@inertiajs/react';
import { useState } from 'react';

interface Props {
   title: string;
   handler: React.ReactNode;
   category?: ExamCategory;
}

const CategoryForm = ({ title, category, handler }: Props) => {
   const [open, setOpen] = useState(false);
   const { input, button } = useLang();

   const { data, setData, post, errors, processing, reset } = useForm({
      title: category ? category.title : '',
      icon: category ? category.icon : '',
      status: category ? (category.status ? 1 : 0) : 1,
      description: category ? category.description : '',
      thumbnail: null,
   });

   const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();

      if (category) {
         post(route('exam-categories.update', category.id), {
            onSuccess: () => setOpen(false),
         });
      } else {
         post(route('exam-categories.store'), {
            onSuccess: () => {
               reset();
               setOpen(false);
            },
         });
      }
   };

   return (
      <Dialog open={open} onOpenChange={setOpen}>
         <DialogTrigger>{handler}</DialogTrigger>

         <DialogContent className="p-0">
            <ScrollArea className="max-h-[90vh] p-6">
               <DialogHeader className="mb-6">
                  <DialogTitle>{title}</DialogTitle>
               </DialogHeader>

               <form onSubmit={handleSubmit} className="space-y-4 p-0.5">
                  <div>
                     <Label>{input.title}</Label>
                     <Input
                        required
                        type="text"
                        name="title"
                        value={data.title}
                        placeholder={input.title_placeholder}
                        onChange={(e) => onHandleChange(e, setData)}
                     />
                     <InputError message={errors.title} />
                  </div>
                  <div>
                     <Label>{input.category_icon}</Label>
                     <IconPickerDialog
                        name="icon"
                        value={data.icon || ''}
                        placeholder="Pick your category icon"
                        onSelect={(icon) => setData('icon', icon)}
                     />
                     <InputError message={errors.icon} />
                  </div>
                  <div>
                     <Label>{input.category_status}</Label>
                     <Select value={data.status.toString()} onValueChange={(value) => setData('status', Number(value))}>
                        <SelectTrigger>
                           <SelectValue placeholder={input.status_placeholder} />
                        </SelectTrigger>
                        <SelectContent>
                           <SelectItem value="1">Active</SelectItem>
                           <SelectItem value="0">Inactive</SelectItem>
                        </SelectContent>
                     </Select>
                  </div>
                  <div>
                     <Label>{input.description}</Label>
                     <Textarea
                        name="description"
                        value={data.description}
                        placeholder={input.description_placeholder}
                        onChange={(e) => onHandleChange(e, setData)}
                     />
                     <InputError message={errors.description} />
                  </div>
                  <div>
                     <Label>{input.thumbnail}</Label>
                     <Input type="file" name="thumbnail" accept="image/*" onChange={(e) => setData('thumbnail', e.target.files?.[0] as any)} />
                     <InputError message={errors.thumbnail} />
                  </div>

                  <DialogFooter className="flex justify-end space-x-2 pt-4">
                     <DialogClose asChild>
                        <Button type="button" variant="outline">
                           {button.close}
                        </Button>
                     </DialogClose>

                     <LoadingButton loading={processing}>{button.save_changes}</LoadingButton>
                  </DialogFooter>
               </form>
            </ScrollArea>
         </DialogContent>
      </Dialog>
   );
};

export default CategoryForm;
