import InputError from '@/components/input-error';
import LoadingButton from '@/components/loading-button';
import Switch from '@/components/switch';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import paystackCurrencies from '@/data/currency/paystack';
import { onHandleChange } from '@/lib/inertia';
import { SharedData } from '@/types/global';
import { useForm, usePage } from '@inertiajs/react';

interface PaystackProps {
   payment: Settings<PaystackFields>;
}

const Paystack = ({ payment }: PaystackProps) => {
   const { props } = usePage<SharedData>();
   const { translate } = props;
   const { settings, input, button, common } = translate;
   const { data, setData, post, errors, processing } = useForm({
      ...(payment.fields as PaystackFields),
      type: 'paystack',
   });

   const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      post(route('settings.payment.update', { id: payment.id }));
   };

   return (
      <Card className="p-4 sm:p-6">
         <div className="mb-6 flex items-center justify-between">
            <div>
               <h2 className="text-xl font-semibold">{settings.paystack_settings}</h2>
               <p className="text-gray-500">{settings.configure_payment_gateway.replace(':gateway', 'Paystack')}</p>
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
                        {paystackCurrencies.map((currency) => (
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
                     {data.test_mode ? settings.using_test_keys : settings.using_live_keys}
                  </Label>
               </div>
            </div>

            {/* Test Mode Credentials Section */}
            <div className={`border-b pb-6 ${!data.test_mode ? 'opacity-60' : ''}`}>
               <h3 className="mb-4 text-lg font-medium">{settings.test_credentials}</h3>
               <div className="grid grid-cols-1 gap-6 md:grid-cols-1">
                  <div>
                     <Label>{input.test_public_key}</Label>
                     <Input
                        name="test_public_key"
                        value={data.test_public_key || ''}
                        onChange={(e) => onHandleChange(e, setData)}
                        placeholder={input.test_public_key_placeholder}
                        disabled={!data.test_mode}
                     />
                     <InputError message={errors.test_public_key} />
                  </div>

                  <div>
                     <Label>{input.test_secret_key}</Label>
                     <Input
                        name="test_secret_key"
                        value={data.test_secret_key || ''}
                        onChange={(e) => onHandleChange(e, setData)}
                        placeholder={input.test_secret_key_placeholder}
                        disabled={!data.test_mode}
                        type="password"
                     />
                     <InputError message={errors.test_secret_key} />
                  </div>
               </div>
            </div>

            {/* Live Mode Credentials Section */}
            <div className={`border-b pb-6 ${data.test_mode ? 'opacity-60' : ''}`}>
               <h3 className="mb-4 text-lg font-medium">{settings.live_credentials}</h3>
               <div className="grid grid-cols-1 gap-6 md:grid-cols-1">
                  <div>
                     <Label>{input.live_public_key}</Label>
                     <Input
                        name="live_public_key"
                        value={data.live_public_key || ''}
                        onChange={(e) => onHandleChange(e, setData)}
                        placeholder={input.live_public_key_placeholder}
                        disabled={data.test_mode}
                     />
                     <InputError message={errors.live_public_key} />
                  </div>

                  <div>
                     <Label>{input.live_secret_key}</Label>
                     <Input
                        name="live_secret_key"
                        value={data.live_secret_key || ''}
                        onChange={(e) => onHandleChange(e, setData)}
                        placeholder={input.live_secret_key_placeholder}
                        disabled={data.test_mode}
                        type="password"
                     />
                     <InputError message={errors.live_secret_key} />
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

export default Paystack;
