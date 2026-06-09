import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';
import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

type SystemRebootForm = {
   email: string;
   password: string;
};

const Index = () => {
   const { data, setData, post, processing, errors, reset } = useForm<Required<SystemRebootForm>>({
      email: '',
      password: '',
   });

   const submit: FormEventHandler = (e) => {
      e.preventDefault();
      post(route('system.verify'), {
         onFinish: () => reset('password'),
      });
   };

   return (
      <AuthLayout title="System Access" description="Enter admin credentials to access system">
         <Head title="System Access" />
         <form className="flex flex-col gap-6" onSubmit={submit}>
            <div className="grid gap-6">
               <div className="grid gap-2">
                  <Label htmlFor="email">Admin Email</Label>
                  <Input
                     id="email"
                     type="email"
                     required
                     autoFocus
                     tabIndex={1}
                     autoComplete="email"
                     value={data.email}
                     onChange={(e) => setData('email', e.target.value)}
                     placeholder="admin@example.com"
                  />
                  <InputError message={errors.email} />
               </div>

               <div className="grid gap-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                     id="password"
                     type="password"
                     required
                     tabIndex={2}
                     autoComplete="current-password"
                     value={data.password}
                     onChange={(e) => setData('password', e.target.value)}
                     placeholder="Password"
                  />
                  <InputError message={errors.password} />
               </div>

               <Button type="submit" className="w-full" disabled={processing}>
                  {processing ? 'Verifying...' : 'Verify Admin Access'}
               </Button>
            </div>
         </form>
      </AuthLayout>
   );
};

export default Index;
