import ChangeEmail from '@/components/account/change-email';
import ChangePassword from '@/components/account/change-password';
import ForgetPassword from '@/components/account/forget-password';

const Settings = () => {
   return (
      <div className="space-y-7">
         <ChangeEmail />
         <ForgetPassword />
         <ChangePassword />
      </div>
   );
};

export default Settings;
