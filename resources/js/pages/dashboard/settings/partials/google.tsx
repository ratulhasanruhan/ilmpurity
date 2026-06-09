import InputError from '@/components/input-error';
import LoadingButton from '@/components/loading-button';
import Switch from '@/components/switch';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useLang } from '@/hooks/use-lang';
import { onHandleChange } from '@/lib/inertia';
import { useForm } from '@inertiajs/react';

interface Props {
   auth: Settings<GoogleAuthFields>;
}

const Google = (props: Props) => {
   const { auth, input, button, common } = useLang();
   const { data, setData, post, errors, processing } = useForm({
      ...(props.auth.fields as GoogleAuthFields),
      type: 'google_auth',
   });

   const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      post(route('settings.auth0.update', { id: props.auth.id }));
   };

   return (
      <Card className="p-4 sm:p-6">
         <div className="mb-7 flex items-center justify-between">
            <div>
               <h2 className="text-xl font-semibold">{auth.google_auth_settings}</h2>
               <p className="text-gray-500">{auth.google_auth_description}</p>
            </div>

            <div className="flex items-center space-x-2">
               <Label htmlFor="status">{data.active ? common.enabled : common.disabled}</Label>
               <Switch id="status" checked={data.active} onCheckedChange={(checked) => setData('active', checked)} />
            </div>
         </div>

         <form onSubmit={handleSubmit} className="space-y-6">
            <div className="border-b pb-6">
               <h2 className="mb-4 text-xl font-semibold">{auth.google_auth}</h2>

               <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div>
                     <Label>{input.google_client_id}</Label>
                     <Input
                        name="client_id"
                        value={data.client_id || ''}
                        onChange={(e) => onHandleChange(e, setData)}
                        placeholder={input.google_client_id_placeholder}
                     />
                     <InputError message={errors.client_id} />
                  </div>

                  <div>
                     <Label>{input.google_client_secret}</Label>
                     <Input
                        name="client_secret"
                        value={data.client_secret || ''}
                        onChange={(e) => onHandleChange(e, setData)}
                        placeholder={input.google_client_secret_placeholder}
                     />
                     <InputError message={errors.client_secret} />
                  </div>

                  <div>
                     <Label>{input.google_redirect_uri}</Label>
                     <Input
                        name="redirect"
                        value={data.redirect || ''}
                        onChange={(e) => onHandleChange(e, setData)}
                        placeholder={input.google_redirect_uri}
                     />
                     <InputError message={errors.redirect} />
                  </div>
               </div>
            </div>

            <LoadingButton loading={processing}>{button.save_changes}</LoadingButton>
         </form>
      </Card>
   );
};

export default Google;
