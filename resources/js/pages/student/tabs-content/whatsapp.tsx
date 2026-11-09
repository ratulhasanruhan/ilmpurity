import InputError from '@/components/input-error';
import LoadingButton from '@/components/loading-button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useForm, usePage } from '@inertiajs/react';

interface WhatsappPreference {
   phone: string;
   preferred_time: string;
   enabled: boolean;
   last_sent_on?: string | null;
}

interface WhatsappLog {
   status: string;
   sent_at?: string | null;
   message?: string | null;
}

const WhatsappReminder = () => {
   const { whatsappPreference, whatsappLastLog } = usePage().props as {
      whatsappPreference?: WhatsappPreference | null;
      whatsappLastLog?: WhatsappLog | null;
   };

   const { data, setData, post, processing, errors } = useForm({
      phone: whatsappPreference?.phone || '',
      preferred_time: whatsappPreference?.preferred_time || '',
      enabled: whatsappPreference?.enabled ?? true,
   });

   const submit = (e: React.FormEvent) => {
      e.preventDefault();
      post(route('student.whatsapp.update'));
   };

   return (
      <Card className="p-5 sm:p-6">
         <div className="mb-6">
            <h2 className="text-xl font-semibold">WhatsApp reminder</h2>
            <p className="mt-1 text-sm text-gray-500">
               আপনার পছন্দের সময় দিন। সেই সময়ে ওয়েবসাইট থেকে প্রতিদিন একটি WhatsApp মেসেজ যাবে। নম্বরে দেশের কোডসহ লিখুন, যেমন 8801XXXXXXXXX।
            </p>
         </div>

         <form onSubmit={submit} className="space-y-5">
            <div className="flex items-center justify-between rounded-md border p-4">
               <div>
                  <Label>Send daily reminder</Label>
                  <p className="text-sm text-gray-500">Turn this off to stop messages.</p>
               </div>
               <Switch checked={data.enabled} onCheckedChange={(checked) => setData('enabled', checked)} />
            </div>

            <div>
               <Label>WhatsApp number</Label>
               <Input value={data.phone} onChange={(e) => setData('phone', e.target.value)} placeholder="8801XXXXXXXXX" />
               <InputError message={errors.phone} />
            </div>

            <div>
               <Label>Preferred time</Label>
               <Input type="time" value={data.preferred_time} onChange={(e) => setData('preferred_time', e.target.value)} />
               <InputError message={errors.preferred_time} />
            </div>

            {whatsappPreference?.last_sent_on && (
               <p className="text-sm text-gray-600">
                  Last successful reminder: {whatsappPreference.last_sent_on}
                  {whatsappLastLog?.status ? ` (${whatsappLastLog.status})` : ''}
               </p>
            )}

            <LoadingButton loading={processing}>Save reminder time</LoadingButton>
         </form>
      </Card>
   );
};

export default WhatsappReminder;
