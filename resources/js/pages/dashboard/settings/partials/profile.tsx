import InputError from '@/components/input-error';
import LoadingButton from '@/components/loading-button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { SharedData } from '@/types/global';
import { useForm, usePage } from '@inertiajs/react';
import { Camera } from 'lucide-react';
import { FormEventHandler, useState } from 'react';

const Profile = () => {
   const { props } = usePage<SharedData>();
   const { translate } = props;
   const { input, button, common, dashboard } = translate;
   const { name, photo } = props.auth.user;
   const [imageUrl, setImageUrl] = useState(photo);

   const { data, setData, post, errors, clearErrors, processing } = useForm({
      name: name,
      photo: null,
   });

   const submit: FormEventHandler = (e) => {
      e.preventDefault();
      clearErrors();
      post(route('settings.profile'));
   };

   const handleImageChange = (e: any) => {
      const files = e.target.files;
      if (files && files[0]) {
         setData('photo', files[0]);
         setImageUrl(URL.createObjectURL(files[0]));
      }
   };

   return (
      <Card className="p-4 sm:p-6">
         <form onSubmit={submit} className="flex flex-col items-center gap-6 md:flex-row">
            <div className="flex w-full flex-col items-center text-center md:max-w-[250px]">
               <div className="relative mb-4 h-[100px] w-[100px] md:h-[120px] md:w-[120px]">
                  {imageUrl ? (
                     <img alt="item-1" src={imageUrl} className="h-[100px] w-[100px] rounded-full md:h-[120px] md:w-[120px]" />
                  ) : (
                     <div className="h-[100px] w-[100px] rounded-full bg-gray-300 md:h-[120px] md:w-[120px]"></div>
                  )}

                  <label htmlFor="formFileSm" className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                     <div className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-gray-100">
                        <Camera className="h-6 w-6 text-gray-500" />
                     </div>
                  </label>
                  <input hidden id="formFileSm" type="file" onChange={handleImageChange} />
               </div>

               <small className="text-gray-500">{dashboard.image_upload_requirements}</small>

               {errors.photo && <p className="mt-1 text-sm text-red-500">{errors.photo}</p>}
            </div>

            <div className="w-full">
               <div className="mt-6 mb-10">
                  <Input
                     required
                     type="name"
                     name="name"
                     value={data.name}
                     placeholder={input.name_placeholder}
                     onChange={(e) => setData('name', e.target.value)}
                  />

                  <InputError message={errors.name} className="mt-2" />
               </div>

               <LoadingButton loading={processing} className="h-9 w-full">
                  {button.save_changes}
               </LoadingButton>
            </div>
         </form>
      </Card>
   );
};

export default Profile;
