import InputError from '@/components/input-error';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SharedData } from '@/types/global';
import { useForm, usePage } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import LoadingButton from '../loading-button';

const ChangeEmail = () => {
   const { props } = usePage<SharedData>();
   const { email } = props.auth.user;
   const { errors, translate } = props;
   const { auth, button, input } = translate;

   const { data, setData, post, processing } = useForm({
      current_email: email,
      new_email: '',
   });

   const onHandleChange = (event: any) => {
      setData(event.target.name, event.target.value);
   };

   const submit: FormEventHandler = (e) => {
      e.preventDefault();

      post(route('account.change-email'));
   };

   return (
      <Card className="border-none">
         <div className="border-b-border border-b px-7 pt-7 pb-4">
            <p className="text18 font-bold">{auth.change_email}</p>
         </div>
         <form onSubmit={submit} className="px-7 py-8">
            <div>
               <Label>{input.current_email}</Label>

               <Input required readOnly type="email" name="current_email" value={data.current_email} placeholder={input.current_email_placeholder} />

               <InputError message={errors.current_email} className="mt-2" />
            </div>

            <div className="py-5">
               <Label>{input.new_email}</Label>

               <Input
                  required
                  type="email"
                  name="new_email"
                  value={data.new_email}
                  placeholder={input.new_email_placeholder}
                  onChange={onHandleChange}
               />

               <InputError message={errors.new_email} className="mt-2" />
            </div>

            <LoadingButton loading={processing}>{button.get_email_change_link}</LoadingButton>
         </form>
      </Card>
   );
};

export default ChangeEmail;
