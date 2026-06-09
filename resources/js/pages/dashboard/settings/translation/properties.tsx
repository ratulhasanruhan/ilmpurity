import InputError from '@/components/input-error';
import LoadingButton from '@/components/loading-button';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import DashboardLayout from '@/layouts/dashboard/layout';
import { SharedData } from '@/types/global';
import { Link, useForm, usePage } from '@inertiajs/react';
import { MoveLeft } from 'lucide-react';
import { ReactNode } from 'react';

interface Props extends SharedData {
   property: LanguagesProperty;
}

const SMTP = ({ property }: Props) => {
   const { props } = usePage<SharedData>();
   const { translate } = props;
   const { button } = translate;
   const { data, setData, put, errors, processing } = useForm(property.properties);

   const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();

      put(route('language.property.update', property.id));
   };

   return (
      <div className="md:px-3">
         <Card className="p-4 sm:p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
               <div className="flex items-center justify-between gap-4">
                  <h2 className="text-xl font-semibold">{property.name}</h2>
                  <Link href={route('language.edit', property.language.code)}>
                     <Button>
                        <MoveLeft />
                        {button.back}
                     </Button>
                  </Link>
               </div>

               <Separator />

               <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  {Object.entries(data).map(([key, value]) => (
                     <div key={key}>
                        <Label>{key}</Label>
                        <Input
                           name={key}
                           value={data[key] as any}
                           placeholder="Enter value"
                           onChange={(e) => setData(e.target.name, e.target.value)}
                        />
                        <InputError message={errors[key]} />
                     </div>
                  ))}
               </div>

               <Separator />

               <div className="flex items-center justify-end">
                  <LoadingButton loading={processing}>{button.save}</LoadingButton>
               </div>
            </form>
         </Card>
      </div>
   );
};

SMTP.layout = (page: ReactNode) => <DashboardLayout children={page} />;

export default SMTP;
