import InputError from '@/components/input-error';
import LoadingButton from '@/components/loading-button';
import Switch from '@/components/switch';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import paypalCurrencies from '@/data/currency/paypal';
import { onHandleChange } from '@/lib/inertia';
import { SharedData } from '@/types/global';
import { useForm, usePage } from '@inertiajs/react';

interface PaypalProps {
   payment: Settings<PaypalFields>;
}

const Paypal = ({ payment }: PaypalProps) => {
   const { props } = usePage<SharedData>();
   const { translate } = props;
   const { settings, input, button, common } = translate;
   const { data, setData, post, errors, processing } = useForm({
      ...(payment.fields as PaypalFields),
      type: 'paypal',
   });

   const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();

      post(route('settings.payment.update', { id: payment.id }));
   };

   return (
      <Card className="p-4 sm:p-6">
         <div className="mb-6 flex items-center justify-between">
            <div>
               <h2 className="text-xl font-semibold">{settings.paypal_settings}</h2>
               <p className="text-gray-500">{settings.configure_payment_gateway.replace(':gateway', 'PayPal')}</p>
            </div>

            <div className="flex items-center space-x-2">
               <Label htmlFor="status">{data.active ? common.enabled : common.disabled}</Label>
               <Switch id="status" checked={data.active} onCheckedChange={(checked) => setData('active', checked)} />
            </div>
         </div>

         <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
               <div>
                  <Label>{input.currency}</Label>
                  <Select value={data.currency} onValueChange={(value) => setData('currency', value)}>
                     <SelectTrigger>
                        <SelectValue placeholder={input.currency} />
                     </SelectTrigger>
                     <SelectContent>
                        {paypalCurrencies.map((currency) => (
                           <SelectItem key={currency.value} value={currency.value}>
                              {currency.label} ({currency.value})
                           </SelectItem>
                        ))}
                     </SelectContent>
                  </Select>
                  <InputError message={errors.currency} />
               </div>

               <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium">{settings.test_mode}:</span>
                  <Switch id="status" checked={data.test_mode} onCheckedChange={(checked) => setData('test_mode', checked)} />
                  <Label htmlFor="status" className="text-gray-500">
                     {data.test_mode ? settings.using_sandbox_environment : settings.using_production_environment}
                  </Label>
               </div>
            </div>

            {/* Sandbox Credentials Section */}
            <div className={`border-b pb-6 ${!data.test_mode ? 'opacity-60' : ''}`}>
               <h3 className="mb-4 text-lg font-medium">{settings.sandbox_credentials}</h3>
               <div className="grid grid-cols-1 gap-6 md:grid-cols-1">
                  <div>
                     <Label>{input.sandbox_client_id}</Label>
                     <Input
                        name="sandbox_client_id"
                        value={data.sandbox_client_id || ''}
                        onChange={(e) => onHandleChange(e, setData)}
                        placeholder={input.sandbox_client_id_placeholder}
                        disabled={!data.test_mode}
                     />
                     <InputError message={errors.sandbox_client_id} />
                  </div>

                  <div>
                     <Label>{input.sandbox_secret_key}</Label>
                     <Input
                        name="sandbox_secret_key"
                        value={data.sandbox_secret_key || ''}
                        onChange={(e) => onHandleChange(e, setData)}
                        placeholder={input.sandbox_secret_key_placeholder}
                        disabled={!data.test_mode}
                        type="password"
                     />
                     <InputError message={errors.sandbox_secret_key} />
                  </div>
               </div>
            </div>

            {/* Production Credentials Section */}
            <div className={`border-b pb-6 ${data.test_mode ? 'opacity-60' : ''}`}>
               <h3 className="mb-4 text-lg font-medium">{settings.production_credentials}</h3>
               <div className="grid grid-cols-1 gap-6 md:grid-cols-1">
                  <div>
                     <Label>{input.production_client_id}</Label>
                     <Input
                        name="production_client_id"
                        value={data.production_client_id || ''}
                        onChange={(e) => onHandleChange(e, setData)}
                        placeholder={input.production_client_id_placeholder}
                        disabled={data.test_mode}
                     />
                     <InputError message={errors.production_client_id} />
                  </div>

                  <div>
                     <Label>{input.production_secret_key}</Label>
                     <Input
                        name="production_secret_key"
                        value={data.production_secret_key || ''}
                        onChange={(e) => onHandleChange(e, setData)}
                        placeholder={input.production_secret_key_placeholder}
                        disabled={data.test_mode}
                        type="password"
                     />
                     <InputError message={errors.production_secret_key} />
                  </div>
               </div>
            </div>

            <LoadingButton loading={processing} type="submit" className="w-full">
               {button.save_changes}
            </LoadingButton>
         </form>
      </Card>
   );
};

export default Paypal;
