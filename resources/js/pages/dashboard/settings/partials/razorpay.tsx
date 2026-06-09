import InputError from '@/components/input-error';
import LoadingButton from '@/components/loading-button';
import Switch from '@/components/switch';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import razorpayCurrency from '@/data/currency/razorpay';
import { onHandleChange } from '@/lib/inertia';
import { SharedData } from '@/types/global';
import { useForm, usePage } from '@inertiajs/react';

interface RazorpayProps {
   payment: Settings<RazorpayFields>;
}

const Razorpay = ({ payment }: RazorpayProps) => {
   const { props } = usePage<SharedData>();
   const { translate } = props;
   const { settings, input, button, common } = translate;
   const { data, setData, post, errors, processing } = useForm({
      ...(payment.fields as RazorpayFields),
      type: 'razorpay',
   });

   const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      post(route('settings.payment.update', { id: payment.id }));
   };

   return (
      <Card className="p-4 sm:p-6">
         <div className="mb-6 flex items-center justify-between">
            <div>
               <h2 className="text-xl font-semibold">{settings.razorpay_settings}</h2>
               <p className="text-gray-500">{settings.configure_payment_gateway.replace(':gateway', 'Razorpay')}</p>
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
                        {razorpayCurrency.map((currency) => (
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
                     <Label>{input.api_key}</Label>
                     <Input
                        name="api_key"
                        value={data.api_key || ''}
                        onChange={(e) => onHandleChange(e, setData)}
                        placeholder={input.api_key_placeholder}
                     />
                     <InputError message={errors.api_key} />
                     <p className="mt-1 text-sm text-gray-500">
                        {data.test_mode
                           ? settings.use_test_mode_key.replace(':key', 'public key')
                           : settings.use_live_mode_key.replace(':key', 'public key')}
                     </p>
                  </div>

                  <div>
                     <Label>{input.api_secret}</Label>
                     <Input
                        name="api_secret"
                        value={data.api_secret || ''}
                        onChange={(e) => onHandleChange(e, setData)}
                        placeholder={input.api_secret_placeholder}
                        type="password"
                     />
                     <InputError message={errors.api_secret} />
                     <p className="mt-1 text-sm text-gray-500">
                        {data.test_mode
                           ? settings.use_test_mode_key.replace(':key', 'secret key')
                           : settings.use_live_mode_key.replace(':key', 'secret key')}
                     </p>
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

export default Razorpay;
