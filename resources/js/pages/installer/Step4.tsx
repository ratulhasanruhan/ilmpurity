import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SharedData } from '@/types/global';
import { Link, useForm } from '@inertiajs/react';
import React, { ChangeEvent, ReactNode } from 'react';
import Layout from './Partials/Layout';
import Message from './Partials/Message';
import StepNavigator from './Partials/StepNavigator';

interface Props extends SharedData {
   NAME: string;
   EMAIL: string;
   PASSWORD: string;
}

const Step4 = (props: Props) => {
   const { NAME, EMAIL, PASSWORD, flash } = props;

   const { data, errors, post, setData } = useForm({
      name: NAME || '',
      email: EMAIL || '',
      password: PASSWORD || '',
      password_confirmation: PASSWORD || '',
   });

   const onHandleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const target = event.target as HTMLInputElement;
      setData({
         ...data,
         [target.name]: target.value,
      });
   };

   const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();

      post(route('install.store-step4'));
   };

   return (
      <div>
         <StepNavigator step1="fill" step2="fill" step3="fill" step4="active" />

         <form id="dataForm" onSubmit={handleSubmit}>
            <Message error={flash.error} success={flash.success} />

            <div className="mb-6">
               <Label>Name</Label>

               <Input id="name" type="text" name="name" value={data.name} onChange={onHandleChange} placeholder="Username" />

               <InputError message={errors.name} />
            </div>

            <div className="mb-6">
               <Label>Email</Label>

               <Input id="email" type="email" name="email" value={data.email} onChange={onHandleChange} placeholder="Email" />

               <InputError message={errors.email} />
            </div>

            <div className="mb-6">
               <Label>Password</Label>

               <Input id="password" type="password" name="password" value={data.password} onChange={onHandleChange} placeholder="Password" />

               <InputError message={errors.password} />
            </div>

            <div className="mb-6">
               <Label>Confirm Password</Label>

               <Input
                  id="password_confirmation"
                  type="password"
                  name="password_confirmation"
                  value={data.password_confirmation}
                  onChange={onHandleChange}
                  placeholder="Confirm Password"
               />

               <InputError message={errors.password_confirmation} />
            </div>
            {/* 
                <Button
                    type="submit"
                    className={cn(
                        'w-full',
                        isAdminCredentials ? 'bg-green-500' : 'bg-red-500',
                    )}
                >
                    Save Credentials
                </Button> */}

            <div className="mt-12 flex items-center justify-end gap-4">
               <Link href={route('install.show-step3')}>
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

Step4.layout = (page: ReactNode) => <Layout children={page} />;

export default Step4;
