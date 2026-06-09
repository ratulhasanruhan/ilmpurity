import { Head, router, useForm, usePage } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler } from 'react';

import { Button } from '@/components/ui/button';
import AuthLayout from '@/layouts/auth-layout';
import { SharedData } from '@/types/global';

export default function Recaptcha({ status }: { status?: string }) {
   const { props } = usePage<SharedData>();
   const { auth, button } = props.translate;
   const { post, processing } = useForm({});

   const submit: FormEventHandler = (e) => {
      e.preventDefault();

      post(route('verification.send'));
   };

   return (
      <AuthLayout title={auth.verify_title} description={auth.verify_description}>
         <Head title={auth.verify_title} />

         {status === 'verification-link-sent' && <div className="mb-4 text-center text-sm font-medium text-green-600">{auth.verification_sent}</div>}

         <form onSubmit={submit} className="space-y-6 text-center">
            <Button disabled={processing} variant="secondary">
               {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
               {button.submit}
            </Button>

            <Button onClick={() => router.post(route('logout'))} className="mx-auto block text-sm">
               {button.logout}
            </Button>
         </form>
      </AuthLayout>
   );
}
