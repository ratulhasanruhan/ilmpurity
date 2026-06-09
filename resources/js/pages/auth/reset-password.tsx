import { Head, useForm, usePage } from '@inertiajs/react';
import { FormEventHandler } from 'react';

import InputError from '@/components/input-error';
import LoadingButton from '@/components/loading-button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';
import { SharedData } from '@/types/global';

interface ResetPasswordProps {
   token: string;
   email: string;
}

type ResetPasswordForm = {
   token: string;
   email: string;
   password: string;
   password_confirmation: string;
};

export default function ResetPassword({ token, email }: ResetPasswordProps) {
   const { props } = usePage<SharedData>();
   const { auth, input, button } = props.translate;
   const { data, setData, post, processing, errors, reset } = useForm<Required<ResetPasswordForm>>({
      token: token,
      email: email,
      password: '',
      password_confirmation: '',
   });

   const submit: FormEventHandler = (e) => {
      e.preventDefault();
      post(route('password.store'), {
         onFinish: () => reset('password', 'password_confirmation'),
      });
   };

   return (
      <AuthLayout title={auth.reset_title} description={auth.reset_description}>
         <Head title={auth.reset_title} />

         <form onSubmit={submit}>
            <div className="grid gap-6">
               <div className="grid gap-2">
                  <Label htmlFor="email">{input.email}</Label>
                  <Input
                     id="email"
                     type="email"
                     name="email"
                     autoComplete="email"
                     value={data.email}
                     className="mt-1 block w-full"
                     readOnly
                     onChange={(e) => setData('email', e.target.value)}
                  />
                  <InputError message={errors.email} className="mt-2" />
               </div>

               <div className="grid gap-2">
                  <Label htmlFor="password">{input.password}</Label>
                  <Input
                     id="password"
                     type="password"
                     name="password"
                     autoComplete="new-password"
                     value={data.password}
                     className="mt-1 block w-full"
                     autoFocus
                     onChange={(e) => setData('password', e.target.value)}
                     placeholder={input.password_placeholder}
                  />
                  <InputError message={errors.password} />
               </div>

               <div className="grid gap-2">
                  <Label htmlFor="password_confirmation">{input.confirm_password}</Label>
                  <Input
                     id="password_confirmation"
                     type="password"
                     name="password_confirmation"
                     autoComplete="new-password"
                     value={data.password_confirmation}
                     className="mt-1 block w-full"
                     onChange={(e) => setData('password_confirmation', e.target.value)}
                     placeholder={input.confirm_password}
                  />
                  <InputError message={errors.password_confirmation} className="mt-2" />
               </div>

               <LoadingButton className="mt-4 w-full" loading={processing}>
                  {button.submit}
               </LoadingButton>
            </div>
         </form>
      </AuthLayout>
   );
}
