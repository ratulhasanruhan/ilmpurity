import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Link, router, useForm } from '@inertiajs/react';
import React, { ChangeEvent, ReactNode } from 'react';
import timezones from './data/timezones';
import Layout from './Partials/Layout';
import StepNavigator from './Partials/StepNavigator';

interface Props {
   // APP_NAME: string;
   APP_ENV: string;
   APP_DEBUG: string;
   APP_KEY: string;
   APP_TIMEZONE: string;
   APP_URL: string;
}

const Step2 = (props: Props) => {
   const { APP_ENV, APP_DEBUG, APP_KEY, APP_TIMEZONE } = props;

   const { data, errors, post, setData } = useForm({
      // app_name: APP_NAME.replaceAll('"', '') || '',
      app_env: APP_ENV || 'local',
      app_debug: JSON.stringify(APP_DEBUG) || 'true',
      app_key: APP_KEY || '',
      app_timezone: APP_TIMEZONE.replaceAll('"', '') || '',
      app_url: window.location.origin,
   });

   const onHandleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const target = event.target as HTMLInputElement;
      setData({
         ...data,
         [target.name]: target.value,
      });
   };

   const handleGenerateKey = () => {
      router.get(route('generate-app-key'));
   };

   const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();

      post(route('install.store-step2'));
   };

   return (
      <div>
         <StepNavigator step1="fill" step2="active" />

         <form onSubmit={handleSubmit}>
            <div className="mb-6">
               <Label>App Environment</Label>

               <Select name="app_env" value={data.app_env} onValueChange={(value) => setData('app_env', value)}>
                  <SelectTrigger>
                     <SelectValue placeholder="Select the app environment" />
                  </SelectTrigger>
                  <SelectContent>
                     <SelectItem value="local">Local</SelectItem>
                     <SelectItem value="testing">Testing</SelectItem>
                     <SelectItem value="production">Production</SelectItem>
                  </SelectContent>
               </Select>
            </div>

            <div className="mb-6">
               <Label>App Debug Mode</Label>

               <Select name="app_debug" value={data.app_debug} onValueChange={(value) => setData('app_debug', value)}>
                  <SelectTrigger>
                     <SelectValue placeholder="Select the app environment" />
                  </SelectTrigger>
                  <SelectContent>
                     <SelectItem value="true">True</SelectItem>
                     <SelectItem value="false">False</SelectItem>
                  </SelectContent>
               </Select>
            </div>

            <div className="mb-6">
               <Label>App URL/Domain</Label>

               <Input type="text" name="app_url" value={data.app_url} onChange={onHandleChange} placeholder="Enter your url/domain" />

               <InputError message={errors.app_url} />
            </div>

            <div className="mb-6">
               <Label>App Timezone</Label>

               <Select name="app_timezone" value={data.app_timezone} onValueChange={(value) => setData('app_timezone', value)}>
                  <SelectTrigger>
                     <SelectValue placeholder="Select the app timezone" />
                  </SelectTrigger>

                  <SelectContent>
                     {timezones.map((timezone) => (
                        <SelectItem key={timezone} value={timezone}>
                           {timezone}
                        </SelectItem>
                     ))}
                  </SelectContent>
               </Select>
            </div>

            <div className="mb-12">
               <div>
                  <Label>App Key</Label>

                  <Input type="text" name="app_key" value={data.app_key} onChange={onHandleChange} placeholder="Click button to generate key" />

                  <InputError message={errors.app_key} />
               </div>

               <Button
                  type="button"
                  variant="outline"
                  className="mt-4 border border-orange-500 !bg-transparent !text-orange-500"
                  onClick={handleGenerateKey}
               >
                  Generate Key
               </Button>
            </div>

            <div className="flex items-center justify-end gap-4">
               <Link href={route('install.index')}>
                  <Button type="button" variant="outline" className="border border-orange-500 !bg-transparent !text-orange-500 uppercase">
                     Previous Step
                  </Button>
               </Link>

               <Button type="submit" className="bg-orange-500 px-6 py-3 text-white uppercase hover:bg-orange-600/90">
                  Next Step
               </Button>
            </div>
         </form>
      </div>
   );
};

Step2.layout = (page: ReactNode) => <Layout children={page} />;

export default Step2;
