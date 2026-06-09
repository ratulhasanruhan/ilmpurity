import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { SharedData } from '@/types/global';
import { Link, router, useForm } from '@inertiajs/react';
import React, { ChangeEvent, ReactNode } from 'react';
import Layout from './Partials/Layout';
import Message from './Partials/Message';
import StepNavigator from './Partials/StepNavigator';

interface Props extends SharedData {
   DB_HOST: string;
   DB_PORT: string;
   DB_DATABASE: string;
   DB_USERNAME: string;
   DB_PASSWORD: string;
   DB_CONNECTION: string;
   DB_CONNECTION_STATUS: string;
}

const Step3 = (props: Props) => {
   const { DB_HOST, DB_PORT, DB_DATABASE, DB_USERNAME, DB_PASSWORD, DB_CONNECTION, DB_CONNECTION_STATUS, flash } = props;

   const { data, errors, post, setData } = useForm({
      db_connection: DB_CONNECTION || 'mysql',
      db_host: DB_HOST || '',
      db_port: DB_PORT || '',
      db_database: DB_DATABASE || '',
      db_username: DB_USERNAME || '',
      db_password: DB_PASSWORD || '',
   });

   const dbConnectionStatus = Boolean(parseInt(DB_CONNECTION_STATUS));

   const onHandleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const target = event.target as HTMLInputElement;
      setData({
         ...data,
         [target.name]: target.value,
      });
   };

   const testDBConnection = async (e: React.FormEvent) => {
      e.preventDefault();

      router.post(route('check-database'), data);
   };

   const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();

      post(route('install.store-step3'));
   };

   return (
      <div>
         <StepNavigator step1="fill" step2="fill" step3="active" />

         <form id="dataForm" onSubmit={handleSubmit}>
            <Message error={flash.error} success={flash.success} />

            <div className="mb-6">
               <Label>Select Database Type</Label>

               <Select name="db_connection" value={data.db_connection} onValueChange={(value) => setData('db_connection', value)}>
                  <SelectTrigger>
                     <SelectValue placeholder="Select Database Type" />
                  </SelectTrigger>
                  <SelectContent>
                     <SelectItem value="mysql">MySQL</SelectItem>
                  </SelectContent>
               </Select>
            </div>

            <div className="mb-6">
               <Label>DB Host</Label>

               <Input id="db_host" type="text" name="db_host" value={data.db_host} onChange={onHandleChange} placeholder="127.0.0.1" />

               <InputError message={errors.db_host} />
            </div>

            <div className="mb-6">
               <Label>DB Port</Label>

               <Input id="db_port" type="text" name="db_port" value={data.db_port} onChange={onHandleChange} placeholder="3306" />

               <InputError message={errors.db_port} />
            </div>

            <div className="mb-6">
               <Label>DB Database</Label>

               <Input
                  id="db_database"
                  type="text"
                  name="db_database"
                  value={data.db_database}
                  onChange={onHandleChange}
                  placeholder="Database Name"
               />

               <InputError message={errors.db_database} />
            </div>

            <div className="mb-6">
               <Label>DB Username</Label>

               <Input id="db_username" type="text" name="db_username" value={data.db_username} onChange={onHandleChange} placeholder="Username" />

               <InputError message={errors.db_username} />
            </div>

            <div className="mb-6">
               <Label>DB Password</Label>

               <Input id="db_password" type="password" name="db_password" value={data.db_password} onChange={onHandleChange} placeholder="Password" />

               <InputError message={errors.db_password} />
            </div>

            <Button
               type="button"
               className={cn('w-full', dbConnectionStatus && 'bg-green-500', flash.error && 'bg-red-500')}
               onClick={testDBConnection}
               disabled={dbConnectionStatus}
            >
               Test Connection
            </Button>

            <div className="mt-12 flex items-center justify-end gap-4">
               <Link href={route('install.show-step2')}>
                  <Button type="button" variant="outline" className="border border-orange-500 !bg-transparent !text-orange-500 uppercase">
                     Previous Step
                  </Button>
               </Link>

               {dbConnectionStatus && (
                  <Button type="submit" className="bg-orange-500 px-6 py-3 text-white uppercase hover:bg-orange-600/90">
                     Next Step
                  </Button>
               )}
            </div>
         </form>
      </div>
   );
};

Step3.layout = (page: ReactNode) => <Layout children={page} />;

export default Step3;
