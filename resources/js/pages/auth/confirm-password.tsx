// Components
import { Head, useForm, usePage } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler } from 'react';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';
import { SharedData } from '@/types/global';

export default function ConfirmPassword() {
   const { props } = usePage<SharedData>();
   const { auth, input, button } = props.translate;
   const { data, setData, post, processing, errors, reset } = useForm<Required<{ password: string }>>({
      password: '',
   });

   const submit: FormEventHandler = (e) => {
      e.preventDefault();

      post(route('password.confirm'), {
         onFinish: () => reset('password'),
      });
   };

   return (
      <AuthLayout title={auth.confirm_title} description={auth.confirm_description}>
         <Head title={auth.confirm_title} />

         <form onSubmit={submit}>
            <div className="space-y-6">
               <div className="grid gap-2">
                  <Label htmlFor="password">{input.password}</Label>
                  <Input
                     id="password"
                     type="password"
                     name="password"
                     placeholder={input.password_placeholder}
                     autoComplete="current-password"
                     value={data.password}
                     autoFocus
                     onChange={(e) => setData('password', e.target.value)}
                  />

                  <InputError message={errors.password} />
               </div>

               <div className="flex items-center">
                  <Button className="w-full" disabled={processing}>
                     {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                     {button.confirm_password}
                  </Button>
               </div>
            </div>
         </form>
      </AuthLayout>
   );
}
