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
   auth: Settings<RecaptchaAuthFields>;
}

const Recaptcha = (props: Props) => {
   const { button, common } = useLang();
   const { data, setData, post, errors, processing } = useForm({
      ...(props.auth.fields as RecaptchaAuthFields),
      type: 'google_recaptcha',
   });

   const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      post(route('settings.auth0.update', { id: props.auth.id }));
   };

   return (
      <Card className="p-4 sm:p-6">
         <div className="mb-7 flex items-center justify-between">
            <div>
               <h2 className="text-xl font-semibold">ReCaptcha Settings</h2>
               <p className="text-gray-500">Provide the ReCaptcha site key and secret key.</p>
            </div>

            <div className="flex items-center space-x-2">
               <Label htmlFor="status">{data.active ? common.enabled : common.disabled}</Label>
               <Switch id="status" checked={data.active} onCheckedChange={(checked) => setData('active', checked)} />
            </div>
         </div>

         <form onSubmit={handleSubmit} className="space-y-6">
            <div className="border-b pb-6">
               <h2 className="mb-4 text-xl font-semibold">ReCaptcha Settings</h2>

               <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div>
                     <Label>Site Key</Label>
                     <Input name="site_key" value={data.site_key || ''} onChange={(e) => onHandleChange(e, setData)} placeholder="Site Key" />
                     <InputError message={errors.site_key} />
                  </div>

                  <div>
                     <Label>Secret Key</Label>
                     <Input name="secret_key" value={data.secret_key || ''} onChange={(e) => onHandleChange(e, setData)} placeholder="Secret Key" />
                     <InputError message={errors.secret_key} />
                  </div>
               </div>
            </div>

            <LoadingButton loading={processing}>{button.save_changes}</LoadingButton>
         </form>
      </Card>
   );
};

export default Recaptcha;
