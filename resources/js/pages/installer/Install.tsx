import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { SharedData } from '@/types/global';
import { Link, useForm } from '@inertiajs/react';
import React, { ReactNode, useState } from 'react';
import Layout from './Partials/Layout';
import Message from './Partials/Message';
import StepNavigator from './Partials/StepNavigator';

const Install = ({ flash }: SharedData) => {
   const [isLoading, setIsLoading] = useState(false);
   const [showModal, setShowModal] = useState(false);

   const { data, errors, post, processing, setData } = useForm({
      course_creation: 'collaborative',
   });

   const handleConfirm = (e: React.FormEvent) => {
      e.preventDefault();
      setIsLoading(true);
      setShowModal(true);

      post(route('install.store-processing'), {
         onFinish() {
            setIsLoading(false);
            setShowModal(false);
         },
      });
   };

   return (
      <div>
         {/* Step Navigator */}
         <StepNavigator step1="fill" step2="fill" step3="fill" step4="fill" step5="active" />

         {/* Loading Message */}
         {isLoading && (
            <div id="loader" className="mb-4 rounded-md bg-green-100 px-5 py-3 text-center text-sm font-medium text-green-500">
               Loading...
            </div>
         )}

         <Message success={flash.success} error={flash.error} />

         <form onSubmit={handleConfirm}>
            <div>
               <Label>Select Course Creation Mode</Label>
               <RadioGroup
                  required
                  defaultValue={data.course_creation}
                  className="flex items-center space-x-4 pt-2 pb-1"
                  onValueChange={(value) => setData('course_creation', value)}
               >
                  <div className="flex items-center space-x-2">
                     <RadioGroupItem className="cursor-pointer" id="collaborative" value="collaborative" />
                     <Label htmlFor="collaborative">Collaborative</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                     <RadioGroupItem className="cursor-pointer" id="administrative" value="administrative" />
                     <Label htmlFor="administrative">Administrative</Label>
                  </div>
               </RadioGroup>
               <InputError message={errors.course_creation} />

               {data.course_creation === 'collaborative' ? (
                  <div className="mt-3 rounded-md border border-orange-200 bg-orange-50 p-4">
                     <p className="text-sm leading-relaxed text-gray-700">
                        <span className="mb-1 block font-medium text-orange-600">Collaborative Mode:</span>
                        Enable a collaborative platform where qualified users can become instructors and create their own courses. The platform
                        administrator will receive a percentage of revenue from each instructor's course sales.
                     </p>
                  </div>
               ) : (
                  <div className="mt-3 rounded-md border border-orange-200 bg-orange-50 p-4">
                     <p className="text-sm leading-relaxed text-gray-700">
                        <span className="mb-1 block font-medium text-orange-600">Administrative Mode:</span>
                        Centralize course management where only administrators can create and publish educational content. Students can enroll in
                        these official courses, with all revenue flowing directly to the platform administration.
                     </p>
                  </div>
               )}
            </div>

            <div className="mt-12 flex w-full items-center justify-end gap-4">
               <Link href={route('install.show-step4')}>
                  <Button type="button" variant="outline" className="border border-orange-500 !bg-transparent !text-orange-500 uppercase">
                     Previous Step
                  </Button>
               </Link>

               <Button type="submit" className="bg-orange-500 px-6 py-3 text-white uppercase hover:bg-orange-600/90">
                  Confirm
               </Button>
            </div>
         </form>

         <Dialog open={showModal} onOpenChange={setShowModal}>
            <DialogContent>
               <div className="modal-box ! !rounded-md !bg-orange-50 !p-4 md:max-w-md">
                  <p className="!mb-6 !text-justify !font-medium">
                     Your app is currently undergoing an automatic installation. This process will take a few minutes. Please don't refresh your page
                     or turn off your device. Just stay with this process.
                  </p>
                  <div className="relative mt-6 w-full rounded-full bg-gray-200">
                     <div id="shim-blue" className="absolute h-2 animate-pulse rounded-full bg-blue-500" style={{ width: '100%' }}></div>
                  </div>
               </div>
            </DialogContent>
         </Dialog>
      </div>
   );
};

Install.layout = (page: ReactNode) => <Layout children={page} />;

export default Install;
