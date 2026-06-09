import InputError from '@/components/input-error';
import LoadingButton from '@/components/loading-button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import DashboardLayout from '@/layouts/dashboard/layout';
import { SharedData } from '@/types/global';
import { useForm, usePage } from '@inertiajs/react';
import { ReactNode } from 'react';

type StorageFormData = StorageFields & Record<string, string>;

interface Props extends SharedData {
   storage: Settings<StorageFormData>;
}

const Storage = ({ storage }: Props) => {
   const { props } = usePage<SharedData>();
   const { translate } = props;
   const { settings, input, button } = translate;
   const { data, setData, post, errors, processing } = useForm<StorageFormData>({
      ...storage.fields,
   });

   const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();

      post(route('settings.storage.update', { id: storage.id }));
   };

   return (
      <div className="md:px-3">
         <div className="mb-6">
            <h1 className="text-2xl font-bold">{settings.storage_settings}</h1>
            <p className="text-gray-500">{settings.storage_settings_description}</p>
         </div>
         <Card className="p-4 sm:p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
               <h2 className="mb-4 text-xl font-semibold">{settings.storage_settings}</h2>

               <div>
                  <Label>{input.storage_driver} *</Label>
                  <Select value={data.storage_driver} onValueChange={(value) => setData('storage_driver', value as 'local' | 's3')}>
                     <SelectTrigger>
                        <SelectValue placeholder={input.select_option} />
                     </SelectTrigger>
                     <SelectContent>
                        <SelectItem value="local">Local</SelectItem>
                        <SelectItem value="s3">AWS S3</SelectItem>
                     </SelectContent>
                  </Select>
                  <InputError message={errors.storage_driver} />
               </div>

               {data.storage_driver === 's3' && (
                  <>
                     <div>
                        <Label>{input.aws_access_key_id} *</Label>
                        <Input
                           name="aws_access_key_id"
                           value={data.aws_access_key_id || ''}
                           onChange={(e) => setData(e.target.name, e.target.value)}
                           placeholder={input.aws_access_key_id_placeholder}
                        />
                        <InputError message={errors.aws_access_key_id} />
                     </div>

                     <div>
                        <Label>{input.secret_access_key}</Label>
                        <Input
                           type="password"
                           name="aws_secret_access_key"
                           value={data.aws_secret_access_key || ''}
                           onChange={(e) => setData(e.target.name, e.target.value)}
                           placeholder={input.secret_access_key_placeholder}
                        />
                        <InputError message={errors.aws_secret_access_key} />
                     </div>
                     <div>
                        <Label>{input.aws_default_region} *</Label>
                        <Input
                           name="aws_default_region"
                           value={data.aws_default_region || ''}
                           onChange={(e) => setData(e.target.name, e.target.value)}
                           placeholder={input.aws_default_region_placeholder}
                        />
                        <InputError message={errors.aws_default_region} />
                     </div>
                     <div>
                        <Label>{input.bucket_name}</Label>
                        <Input
                           name="aws_bucket"
                           value={data.aws_bucket || ''}
                           onChange={(e) => setData(e.target.name, e.target.value)}
                           placeholder={input.bucket_name_placeholder}
                        />
                        <InputError message={errors.aws_bucket} />
                     </div>
                  </>
               )}

               <div className="flex items-center justify-between">
                  <LoadingButton loading={processing}>{button.save_changes}</LoadingButton>
               </div>
            </form>
         </Card>
      </div>
   );
};

Storage.layout = (page: ReactNode) => <DashboardLayout children={page} />;

export default Storage;
