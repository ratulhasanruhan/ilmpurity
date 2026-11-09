import InputError from '@/components/input-error';
import LoadingButton from '@/components/loading-button';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import DashboardLayout from '@/layouts/dashboard/layout';
import { SharedData } from '@/types/global';
import { useForm } from '@inertiajs/react';
import { ReactNode } from 'react';

interface WhatsappFields {
   active: boolean;
   provider: 'meta' | 'webhook';
   send_mode: 'text' | 'template';
   phone_number_id: string;
   access_token: string;
   api_url: string;
   template_name: string;
   template_language: string;
   message_template: string;
}

interface Props extends SharedData {
   whatsapp: Settings<WhatsappFields>;
}

const WhatsappSettings = ({ whatsapp }: Props) => {
   const { data, setData, post, errors, processing } = useForm<WhatsappFields>({
      active: Boolean(whatsapp.fields?.active),
      provider: whatsapp.fields?.provider || 'meta',
      send_mode: whatsapp.fields?.send_mode || 'text',
      phone_number_id: whatsapp.fields?.phone_number_id || '',
      access_token: whatsapp.fields?.access_token || '',
      api_url: whatsapp.fields?.api_url || '',
      template_name: whatsapp.fields?.template_name || '',
      template_language: whatsapp.fields?.template_language || 'en',
      message_template: whatsapp.fields?.message_template || 'Hello {name}, this is your scheduled reminder from {app}.',
   });

   const testForm = useForm({ test_phone: '' });

   const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      post(route('settings.whatsapp.update', { id: whatsapp.id }));
   };

   const sendTest = (e: React.FormEvent) => {
      e.preventDefault();
      testForm.post(route('settings.whatsapp.test'));
   };

   return (
      <div className="md:px-3">
         <div className="mb-6">
            <h1 className="text-2xl font-bold">WhatsApp reminders</h1>
            <p className="text-gray-500">
               Students choose a time. The site sends one WhatsApp message at that time every day. The scheduler must be running (`php artisan schedule:work`, or a server cron that runs `php artisan schedule:run` every minute).
            </p>
         </div>

         <Card className="p-4 sm:p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
               <div className="flex items-center justify-between rounded-md border p-4">
                  <div>
                     <Label>Automatic messaging</Label>
                     <p className="text-sm text-gray-500">Send messages only when this is turned on.</p>
                  </div>
                  <Switch checked={data.active} onCheckedChange={(checked) => setData('active', checked)} />
               </div>

               <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div>
                     <Label>Provider</Label>
                     <Select value={data.provider} onValueChange={(value: 'meta' | 'webhook') => setData('provider', value)}>
                        <SelectTrigger>
                           <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                           <SelectItem value="meta">WhatsApp Cloud API</SelectItem>
                           <SelectItem value="webhook">Custom gateway webhook</SelectItem>
                        </SelectContent>
                     </Select>
                     <InputError message={errors.provider} />
                  </div>

                  <div>
                     <Label>Message type</Label>
                     <Select value={data.send_mode} onValueChange={(value: 'text' | 'template') => setData('send_mode', value)}>
                        <SelectTrigger>
                           <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                           <SelectItem value="text">Text message</SelectItem>
                           <SelectItem value="template">Approved template</SelectItem>
                        </SelectContent>
                     </Select>
                     <p className="mt-1 text-xs text-gray-500">Cloud API can send free-form text only inside an open chat. Use a template for daily reminders.</p>
                     <InputError message={errors.send_mode} />
                  </div>

                  {data.provider === 'meta' ? (
                     <>
                        <div>
                           <Label>Phone number ID</Label>
                           <Input value={data.phone_number_id} onChange={(e) => setData('phone_number_id', e.target.value)} placeholder="From Meta WhatsApp settings" />
                           <InputError message={errors.phone_number_id} />
                        </div>
                        <div>
                           <Label>Access token</Label>
                           <Input value={data.access_token} onChange={(e) => setData('access_token', e.target.value)} placeholder="Permanent access token" />
                           <InputError message={errors.access_token} />
                        </div>
                     </>
                  ) : (
                     <>
                        <div className="md:col-span-2">
                           <Label>Webhook URL</Label>
                           <Input value={data.api_url} onChange={(e) => setData('api_url', e.target.value)} placeholder="https://example.com/whatsapp/send" />
                           <p className="mt-1 text-xs text-gray-500">The site POSTs JSON with to, phone, message, and name. The access token is sent as a Bearer token when it is filled in.</p>
                           <InputError message={errors.api_url} />
                        </div>
                        <div className="md:col-span-2">
                           <Label>Access token</Label>
                           <Input value={data.access_token} onChange={(e) => setData('access_token', e.target.value)} placeholder="Optional bearer token" />
                           <InputError message={errors.access_token} />
                        </div>
                     </>
                  )}

                  {data.provider === 'meta' && data.send_mode === 'template' && (
                     <>
                        <div>
                           <Label>Template name</Label>
                           <Input value={data.template_name} onChange={(e) => setData('template_name', e.target.value)} placeholder="study_reminder" />
                           <p className="mt-1 text-xs text-gray-500">The template must have one body variable. The student name is sent as that variable.</p>
                           <InputError message={errors.template_name} />
                        </div>
                        <div>
                           <Label>Template language</Label>
                           <Input value={data.template_language} onChange={(e) => setData('template_language', e.target.value)} placeholder="en" />
                           <InputError message={errors.template_language} />
                        </div>
                     </>
                  )}
               </div>

               {data.send_mode === 'text' && (
                  <div>
                     <Label>Message</Label>
                     <Textarea rows={4} value={data.message_template} onChange={(e) => setData('message_template', e.target.value)} />
                     <p className="mt-1 text-xs text-gray-500">Use {'{name}'} for the student name and {'{app}'} for the site name.</p>
                     <InputError message={errors.message_template} />
                  </div>
               )}

               <div className="flex justify-end">
                  <LoadingButton loading={processing}>Save settings</LoadingButton>
               </div>
            </form>
         </Card>

         <Card className="mt-6 p-4 sm:p-6">
            <form onSubmit={sendTest} className="space-y-4">
               <div>
                  <h2 className="text-lg font-semibold">Send a test</h2>
                  <p className="text-sm text-gray-500">Save the settings first, then send one message to a number with the country code.</p>
               </div>
               <div className="flex flex-col gap-3 sm:flex-row">
                  <Input
                     value={testForm.data.test_phone}
                     onChange={(e) => testForm.setData('test_phone', e.target.value)}
                     placeholder="8801XXXXXXXXX"
                  />
                  <Button type="submit" disabled={testForm.processing}>
                     {testForm.processing ? 'Sending...' : 'Send test'}
                  </Button>
               </div>
               <InputError message={testForm.errors.test_phone} />
            </form>
         </Card>
      </div>
   );
};

WhatsappSettings.layout = (page: ReactNode) => <DashboardLayout children={page} />;

export default WhatsappSettings;
