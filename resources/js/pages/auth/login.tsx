import InputError from '@/components/input-error';
import LoadingButton from '@/components/loading-button';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';
import { SharedData } from '@/types/global';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { FormEventHandler, useRef } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';

interface LoginProps {
   status?: string;
   canResetPassword: boolean;
   googleLogIn: boolean;
   recaptcha: {
      status: boolean;
      siteKey: string;
      secretKey: string;
   };
}

export default function Login({ status, recaptcha, canResetPassword, googleLogIn }: LoginProps) {
   const { props } = usePage<SharedData>();
   const { auth, input, button } = props.translate;
   const recaptchaRef = useRef<ReCAPTCHA | null>(null);

   const { data, setData, post, processing, errors, reset } = useForm({
      email: '',
      password: '',
      remember: false as boolean,
      recaptcha: '',
      recaptcha_status: recaptcha.status,
   });

   const submit: FormEventHandler = (e) => {
      e.preventDefault();
      post(route('login'), {
         onFinish: () => reset('password', 'recaptcha'),
         onError: () => {
            // Reset reCAPTCHA when there's an error
            if (recaptchaRef.current) {
               recaptchaRef.current.reset();
            }
         },
      });
   };

   return (
      <AuthLayout title={auth.login_title} description={auth.login_description}>
         <Head title={auth.login_title} />
         <form className="flex flex-col gap-6" onSubmit={submit}>
            <div className="grid gap-6">
               <div className="grid gap-2">
                  <Label htmlFor="email">{input.email}</Label>
                  <Input
                     id="email"
                     type="email"
                     required
                     autoFocus
                     tabIndex={1}
                     autoComplete="email"
                     value={data.email}
                     onChange={(e) => setData('email', e.target.value)}
                     placeholder={input.email_placeholder}
                  />
                  <InputError message={errors.email} />
               </div>

               <div className="grid gap-2">
                  <div className="flex items-center">
                     <Label htmlFor="password">{input.password}</Label>
                     {canResetPassword && (
                        <TextLink href={route('password.request')} className="ml-auto text-sm" tabIndex={5}>
                           {auth.forgot_password}
                        </TextLink>
                     )}
                  </div>
                  <Input
                     id="password"
                     type="password"
                     required
                     tabIndex={2}
                     autoComplete="current-password"
                     value={data.password}
                     onChange={(e) => setData('password', e.target.value)}
                     placeholder={input.password_placeholder}
                  />
                  <InputError message={errors.password} />
               </div>

               {recaptcha.status && (
                  <div>
                     <ReCAPTCHA ref={recaptchaRef} sitekey={recaptcha.siteKey} onChange={(token) => setData('recaptcha', token as string)} />
                     <InputError message={errors.recaptcha} />
                  </div>
               )}

               <div className="flex items-center space-x-3">
                  <Checkbox id="remember" name="remember" checked={data.remember} onClick={() => setData('remember', !data.remember)} tabIndex={3} />
                  <Label htmlFor="remember">{input.remember_me}</Label>
               </div>

               <LoadingButton loading={processing} type="submit" className="w-full">
                  {button.login}
               </LoadingButton>

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
            </div>
            <div className="text-center text-sm">
               {auth.no_account}{' '}
               <Link href={route('register')} className="underline underline-offset-4">
                  {button.sign_up}
               </Link>
            </div>
         </form>

         {status && <div className="mb-4 text-center text-sm font-medium text-green-600">{status}</div>}
      </AuthLayout>
   );
}
