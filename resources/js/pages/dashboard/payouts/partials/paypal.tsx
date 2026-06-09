import InputError from '@/components/input-error';
import LoadingButton from '@/components/loading-button';
import Switch from '@/components/switch';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { onHandleChange } from '@/lib/inertia';
import { useForm } from '@inertiajs/react';

interface PaypalProps {
   payment: Settings<PaypalFields>;
}

const Paypal = ({ payment }: PaypalProps) => {
   const { data, setData, post, errors, processing } = useForm({
      ...(payment.fields as PaypalFields),
      type: 'paypal',
   });

   const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();

      post(route('payouts.settings.update'));
   };

   return (
      <Card className="p-4 sm:p-6">
         <div className="mb-6 flex items-center justify-between">
            <div>
               <h2 className="text-xl font-semibold">PayPal Settings</h2>
               <p className="text-gray-500">Configure PayPal payment gateway</p>
            </div>

            <div className="flex items-center space-x-2">
               <Label htmlFor="status">{data.active ? 'Enabled' : 'Disabled'}</Label>
               <Switch id="status" checked={data.active} onCheckedChange={(checked) => setData('active', checked)} />
            </div>
         </div>

         <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
               <div>
                  <Label>Currency</Label>
                  <Select value={data.currency} onValueChange={(value) => setData('currency', value)}>
                     <SelectTrigger>
                        <SelectValue placeholder="Select Currency" />
                     </SelectTrigger>
                     <SelectContent>
                        <SelectItem value="USD">US Dollar (USD)</SelectItem>
                        <SelectItem value="EUR">Euro (EUR)</SelectItem>
                        <SelectItem value="GBP">British Pound (GBP)</SelectItem>
                        <SelectItem value="CAD">Canadian Dollar (CAD)</SelectItem>
                        <SelectItem value="AUD">Australian Dollar (AUD)</SelectItem>
                        <SelectItem value="JPY">Japanese Yen (JPY)</SelectItem>
                     </SelectContent>
                  </Select>
                  <InputError message={errors.currency} />
               </div>

               <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium">Test Mode:</span>
                  <Switch id="status" checked={data.test_mode} onCheckedChange={(checked) => setData('test_mode', checked)} />
                  <Label htmlFor="status" className="text-gray-500">
                     {data.test_mode ? 'Using Sandbox Environment' : 'Using Production Environment'}
                  </Label>
               </div>
            </div>

            {/* Sandbox Credentials Section */}
            <div className={`border-b pb-6 ${!data.test_mode ? 'opacity-60' : ''}`}>
               <h3 className="mb-4 text-lg font-medium">Sandbox Credentials</h3>
               <div className="grid grid-cols-1 gap-6 md:grid-cols-1">
                  <div>
                     <Label>Client ID *</Label>
                     <Input
                        name="sandbox_client_id"
                        value={data.sandbox_client_id || ''}
                        onChange={(e) => onHandleChange(e, setData)}
                        placeholder="Enter sandbox client ID"
                        disabled={!data.test_mode}
                     />
                     <InputError message={errors.sandbox_client_id} />
                  </div>

                  <div>
                     <Label>Secret Key *</Label>
                     <Input
                        name="sandbox_secret_key"
                        value={data.sandbox_secret_key || ''}
                        onChange={(e) => onHandleChange(e, setData)}
                        placeholder="Enter sandbox secret key"
                        disabled={!data.test_mode}
                        type="password"
                     />
                     <InputError message={errors.sandbox_secret_key} />
                  </div>
               </div>
            </div>

            {/* Production Credentials Section */}
            <div className={`border-b pb-6 ${data.test_mode ? 'opacity-60' : ''}`}>
               <h3 className="mb-4 text-lg font-medium">Production Credentials</h3>
               <div className="grid grid-cols-1 gap-6 md:grid-cols-1">
                  <div>
                     <Label>Client ID *</Label>
                     <Input
                        name="production_client_id"
                        value={data.production_client_id || ''}
                        onChange={(e) => onHandleChange(e, setData)}
                        placeholder="Enter production client ID"
                        disabled={data.test_mode}
                     />
                     <InputError message={errors.production_client_id} />
                  </div>

                  <div>
                     <Label>Secret Key *</Label>
                     <Input
                        name="production_secret_key"
                        value={data.production_secret_key || ''}
                        onChange={(e) => onHandleChange(e, setData)}
                        placeholder="Enter production secret key"
                        disabled={data.test_mode}
                        type="password"
                     />
                     <InputError message={errors.production_secret_key} />
                  </div>
               </div>
            </div>

            <div className="flex items-center justify-between">
               <div className="text-sm text-gray-500">{data.active ? 'PayPal is currently enabled' : 'PayPal is currently disabled'}</div>
               <LoadingButton loading={processing}>Save Changes</LoadingButton>
            </div>
         </form>
      </Card>
   );
};

export default Paypal;
