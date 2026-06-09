import InputError from '@/components/input-error';
import LoadingButton from '@/components/loading-button';
import Switch from '@/components/switch';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import mollieCurrencies from '@/data/currency/mollie';
import { onHandleChange } from '@/lib/inertia';
import { SharedData } from '@/types/global';
import { useForm, usePage } from '@inertiajs/react';

interface MollieProps {
   payment: Settings<MollieFields>;
}

const Mollie = ({ payment }: MollieProps) => {
   const { props } = usePage<SharedData>();
   const { translate } = props;
   const { settings, input, button, common } = translate;
   const { data, setData, post, errors, processing } = useForm({
      ...(payment.fields as MollieFields),
      type: 'mollie',
   });

   const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      post(route('settings.payment.update', { id: payment.id }));
   };

   return (
      <Card className="p-4 sm:p-6">
         <div className="mb-6 flex items-center justify-between">
            <div>
               <h2 className="text-xl font-semibold">{settings.mollie_settings}</h2>
               <p className="text-gray-500">{settings.configure_payment_gateway.replace(':gateway', 'Mollie')}</p>
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
                        {mollieCurrencies.map((currency) => (
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
                     {data.test_mode ? settings.using_test_environment : settings.using_live_environment}
                  </Label>
               </div>
            </div>

            {/* API Credentials Section */}
            <div className="border-b pb-6">
               <h3 className="mb-4 text-lg font-medium">{settings.api_credentials}</h3>
               <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div>
                     <Label>{input.test_api_key}</Label>
                     <Input
                        name="test_api_key"
                        value={data.test_api_key || ''}
                        onChange={(e) => onHandleChange(e, setData)}
                        placeholder={input.test_api_key_placeholder}
                     />
                     <InputError message={errors.test_api_key} />
                     <p className="mt-1 text-sm text-gray-500">
                        {data.test_mode
                           ? settings.use_test_mode_key.replace(':key', 'api key')
                           : settings.use_live_mode_key.replace(':key', 'api key')}
                     </p>
                  </div>

                  <div>
                     <Label>{input.live_api_key}</Label>
                     <Input
                        name="live_api_key"
                        value={data.live_api_key || ''}
                        onChange={(e) => onHandleChange(e, setData)}
                        placeholder={input.live_api_key_placeholder}
                     />
                     <InputError message={errors.live_api_key} />
                     <p className="mt-1 text-sm text-gray-500">{data.test_mode ? 'Use your test mode api key' : 'Use your live mode api key'}</p>
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

export default Mollie;
