import { Button } from '@/components/ui/button';
import { Link } from '@inertiajs/react';
import { Check, CircleX } from 'lucide-react';
import { ReactNode } from 'react';
import Layout from './Partials/Layout';
import StepNavigator from './Partials/StepNavigator';

interface Props {
   allValuesAreTrue: boolean;
   requirements: Record<string, boolean>;
}

const Step1 = (props: Props) => {
   const { allValuesAreTrue, requirements } = props;

   const statusList = [
      {
         title: `PHP >= ${requirements.required_php_version}`,
         key: 'php_version',
      },
      { title: 'OpenSSL PHP Extension', key: 'openssl_enabled' },
      { title: 'PDO PHP Extension', key: 'pdo_enabled' },
      { title: 'Mbstring PHP Extension', key: 'mbstring_enabled' },
      { title: 'Curl PHP Extension', key: 'curl_enabled' },
      { title: 'Tokenizer PHP Extension', key: 'tokenizer_enabled' },
      { title: 'XML PHP Extension', key: 'xml_enabled' },
      { title: 'CTYPE PHP Extension', key: 'ctype_enabled' },
      { title: 'Fileinfo PHP Extension', key: 'fileinfo_enabled' },
      { title: 'GD PHP Extension', key: 'gd_enabled' },
      { title: 'JSON PHP Extension', key: 'json_enabled' },
      { title: 'BCmath PHP Extension', key: 'bcmath_enabled' },
      { title: 'Symlink Function', key: 'symlink_enabled' },
   ];

   return (
      <>
         <StepNavigator step1="active" />

         {!allValuesAreTrue && <p className="bg-red-100 text-red-500">Your server doesn't meet the following requirements</p>}

         <div className="border border-gray-300">
            {statusList.map(({ key, title }) => (
               <div key={key} className="flex items-center justify-between px-6 py-4 text-gray-500 odd:bg-gray-100">
                  {title}

                  {key === 'php_version' ? (
                     <div className="flex items-center">
                        <span className="mr-2">{requirements.current_php_version}</span>
                        {requirements[key] ? <Check className="text-green-500" /> : <CircleX className="text-red-500" />}
                     </div>
                  ) : requirements[key] ? (
                     <Check className="text-green-500" />
                  ) : (
                     <CircleX className="text-red-500" />
                  )}
               </div>
            ))}
         </div>

         {!allValuesAreTrue && (
            <div className="mt-4 rounded-md bg-yellow-50 p-4">
               <div className="flex">
                  <div className="ml-3">
                     <h3 className="text-sm font-medium text-yellow-800">Important Notes</h3>
                     <div className="mt-2 text-sm text-yellow-700">
                        <ul className="list-disc space-y-1 pl-5">
                           <li>
                              <strong>Symlink Function:</strong> Required for Laravel's storage:link command to make uploaded files publicly
                              accessible
                           </li>
                           <li>
                              <strong>PHP Extensions:</strong> These extensions are essential for Laravel to function properly
                           </li>
                           <li>Contact your hosting provider if any requirements are not met</li>
                        </ul>
                     </div>
                  </div>
               </div>
            </div>
         )}

         {allValuesAreTrue && (
            <div className="mt-8 flex items-center justify-end">
               <Link href={route('install.show-step2')}>
                  <Button className="bg-orange-500 px-6 py-3 text-white uppercase hover:bg-orange-600/90">Next Step</Button>
               </Link>
            </div>
         )}
      </>
   );
};

Step1.layout = (page: ReactNode) => <Layout children={page} />;

export default Step1;
