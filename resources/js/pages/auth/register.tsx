import InputError from '@/components/input-error';
import LoadingButton from '@/components/loading-button';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';
import { SharedData } from '@/types/global';
import { Head, useForm, usePage } from '@inertiajs/react';
import { FormEventHandler, useRef } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';

interface RegisterProps {
   googleLogIn: boolean;
   recaptcha: {
      status: boolean;
      siteKey: string;
      secretKey: string;
   };
}

export default function Register({ googleLogIn, recaptcha }: RegisterProps) {
   const { props } = usePage<SharedData>();
   const { auth, input, button } = props.translate;
   const recaptchaRef = useRef<ReCAPTCHA | null>(null);

   const { data, setData, post, processing, errors, reset } = useForm({
      name: '',
      email: '',
      password: '',
      password_confirmation: '',
      recaptcha: '',
      recaptcha_status: recaptcha.status,
   });

   const submit: FormEventHandler = (e) => {
      e.preventDefault();
      post(route('register'), {
         onFinish: () => reset('password', 'password_confirmation'),
         onError: () => {
            // Reset reCAPTCHA when there's an error
            if (recaptchaRef.current) {
               recaptchaRef.current.reset();
            }
         },
      });
   };

   return (
      <AuthLayout title={auth.register_title} description={auth.register_description}>
         <Head title={auth.register_title} />
         <form className="flex flex-col gap-6" onSubmit={submit}>
            <div className="grid gap-6">
               <div className="grid gap-2">
                  <Label htmlFor="name">{input.name}</Label>
                  <Input
                     id="name"
                     type="text"
                     required
                     autoFocus
                     tabIndex={1}
                     autoComplete="name"
                     value={data.name}
                     onChange={(e) => setData('name', e.target.value)}
                     disabled={processing}
                     placeholder={input.full_name_placeholder}
                  />
                  <InputError message={errors.name} className="mt-2" />
               </div>

               <div className="grid gap-2">
                  <Label htmlFor="email">{input.email}</Label>
                  <Input
                     id="email"
                     type="email"
                     required
                     tabIndex={2}
                     autoComplete="email"
                     value={data.email}
                     onChange={(e) => setData('email', e.target.value)}
                     disabled={processing}
                     placeholder={input.email_placeholder}
                  />
                  <InputError message={errors.email} />
               </div>

               <div className="grid gap-2">
                  <Label htmlFor="password">{input.password}</Label>
                  <Input
                     id="password"
                     type="password"
                     required
                     tabIndex={3}
                     autoComplete="new-password"
                     value={data.password}
                     onChange={(e) => setData('password', e.target.value)}
                     disabled={processing}
                     placeholder={input.password_placeholder}
                  />
                  <InputError message={errors.password} />
               </div>

               <div className="grid gap-2">
                  <Label htmlFor="password_confirmation">{input.confirm_password}</Label>
                  <Input
                     id="password_confirmation"
                     type="password"
                     required
                     tabIndex={4}
                     autoComplete="new-password"
                     value={data.password_confirmation}
                     onChange={(e) => setData('password_confirmation', e.target.value)}
                     disabled={processing}
                     placeholder={input.confirm_password}
                  />
                  <InputError message={errors.password_confirmation} />
               </div>

               {recaptcha.status && (
                  <div>
                     <ReCAPTCHA ref={recaptchaRef} sitekey={recaptcha.siteKey} onChange={(token) => setData('recaptcha', token as string)} />
                     <InputError message={errors.recaptcha} />
                  </div>
               )}

               <LoadingButton className="mt-2 w-full" tabIndex={5} loading={processing}>
                  {button.create}
               </LoadingButton>
            </div>

            {googleLogIn && (
               <>
                  <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                     <span className="bg-background text-muted-foreground relative z-10 px-2">{auth.continue_with}</span>
                  </div>

                  <a type="button" className="w-full" href="auth/google">
                     <Button type="button" variant="outline" className="w-full">
                        {button.continue_with_google}
                     </Button>
                  </a>
               </>
            )}

            <div className="text-muted-foreground text-center text-sm">
               {auth.have_account}{' '}
               <TextLink href={route('login')} tabIndex={6}>
                  {button.login}
               </TextLink>
            </div>
         </form>
      </AuthLayout>
   );
}
