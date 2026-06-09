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

type SmtpFormData = SmtpFields & Record<string, string>;

interface Props extends SharedData {
   smtp: Settings<SmtpFormData>;
}

const SMTP = ({ smtp }: Props) => {
   const { props } = usePage<SharedData>();
   const { translate } = props;
   const { settings, input, button } = translate;
   const { data, setData, post, errors, processing } = useForm<SmtpFormData>({
      ...smtp.fields,
   });

   const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();

      post(route('settings.smtp.update', { id: smtp.id }));
   };

   return (
      <div className="md:px-3">
         <div className="mb-6">
            <h1 className="text-2xl font-bold">{settings.smtp_settings}</h1>
            <p className="text-gray-500">{settings.email_settings_description}</p>
         </div>

         <Card className="p-4 sm:p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
               {/* Mail Server Settings */}
               <div className="border-b pb-6">
                  <h2 className="mb-4 text-xl font-semibold">{input.mail_driver}</h2>

                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                     <div>
                        <Label>{input.mail_driver} *</Label>
                        <Select value={data.mail_mailer} onValueChange={(value) => setData('mail_mailer' as keyof SmtpFormData, value)}>
                           <SelectTrigger>
                              <SelectValue placeholder={input.select_option} />
                           </SelectTrigger>
                           <SelectContent>
                              <SelectItem value="smtp">SMTP</SelectItem>
                           </SelectContent>
                        </Select>
                        <InputError message={errors.mail_mailer} />
                     </div>

                     <div>
                        <Label>{input.mail_host} *</Label>
                        <Input
                           name="mail_host"
                           value={data.mail_host || ''}
                           onChange={(e) => setData(e.target.name, e.target.value)}
                           placeholder={input.mail_host_placeholder}
                        />
                        <InputError message={errors.mail_host} />
                     </div>

                     <div>
                        <Label>{input.mail_port} *</Label>
                        <Input
                           name="mail_port"
                           value={data.mail_port || ''}
                           onChange={(e) => setData(e.target.name, e.target.value)}
                           placeholder={input.mail_port_placeholder}
                        />
                        <InputError message={errors.mail_port} />
                     </div>

                     <div>
                        <Label>{input.mail_encryption}</Label>
                        <Select value={data.mail_encryption} onValueChange={(value) => setData('mail_encryption' as keyof SmtpFormData, value)}>
                           <SelectTrigger>
                              <SelectValue placeholder={input.select_option} />
                           </SelectTrigger>
                           <SelectContent>
                              <SelectItem value="tls">TLS</SelectItem>
                              <SelectItem value="ssl">SSL</SelectItem>
                           </SelectContent>
                        </Select>
                        <InputError message={errors.mail_encryption} />
                     </div>

                     <div>
                        <Label>{input.mail_username} *</Label>
                        <Input
                           name="mail_username"
                           value={data.mail_username || ''}
                           onChange={(e) => setData(e.target.name, e.target.value)}
                           placeholder={input.mail_username_placeholder}
                        />
                        <InputError message={errors.mail_username} />
                     </div>

                     <div>
                        <Label>{input.mail_password} *</Label>
                        <Input
                           name="mail_password"
                           value={data.mail_password || ''}
                           onChange={(e) => setData(e.target.name, e.target.value)}
                           placeholder={input.mail_password_placeholder}
                           type="password"
                        />
                        <InputError message={errors.mail_password} />
                     </div>

                     <div>
                        <Label>{input.mail_from_address} *</Label>
                        <Input
                           name="mail_from_address"
                           value={data.mail_from_address || ''}
                           onChange={(e) => setData(e.target.name, e.target.value)}
                           placeholder={input.mail_from_address_placeholder}
                        />
                        <InputError message={errors.mail_from_address} />
                     </div>

                     <div>
                        <Label>{input.mail_from_name} *</Label>
                        <Input
                           name="mail_from_name"
                           value={data.mail_from_name || ''}
                           onChange={(e) => setData(e.target.name, e.target.value)}
                           placeholder={input.mail_from_name_placeholder}
                        />
                        <InputError message={errors.mail_from_name} />
                     </div>
                  </div>
               </div>
               <div className="flex items-center justify-end">
                  <LoadingButton loading={processing}>{button.save_changes}</LoadingButton>
               </div>
            </form>
         </Card>
      </div>
   );
};

SMTP.layout = (page: ReactNode) => <DashboardLayout children={page} />;

export default SMTP;
