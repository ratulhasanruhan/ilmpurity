import InputError from '@/components/input-error';
import LoadingButton from '@/components/loading-button';
import TagInput from '@/components/tag-input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { onHandleChange } from '@/lib/inertia';
import { StudentDashboardProps } from '@/types/page';
import { useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';

const BecomeInstructor = () => {
   const { auth, instructor, translate } = usePage<StudentDashboardProps>().props;
   const { button, input, frontend } = translate;
   const [isEditing, setIsEditing] = useState(instructor ? false : true);

   // Parse the options and answers if they're strings
   const initialOptions = instructor?.skills ? (typeof instructor.skills === 'string' ? JSON.parse(instructor.skills) : instructor.skills) : [];

   const { data, setData, post, processing, errors } = useForm({
      user_id: auth.user.id,
      skills: initialOptions,
      designation: instructor?.designation || '',
      biography: instructor?.biography || '',
      resume: null,
   });

   const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();

      if (instructor) {
         post(route('become-instructor.update', instructor.id));
      } else {
         post(route('become-instructor.store'));
      }
   };

   return (
      <Card className="p-4 sm:p-6">
         {!isEditing ? (
            <div className="space-y-6 text-center">
               {instructor.status === 'rejected' ? (
                  <>
                     <p className="text-red-600">{frontend.application_rejected}</p>

                     <Button type="button" onClick={() => setIsEditing(true)} variant="destructive" className="text-primary-foreground capitalize">
                        {button.reapply}
                     </Button>
                  </>
               ) : (
                  <>
                     <p>{frontend.application_under_review}</p>

                     <Button type="button" className="capitalize">
                        {frontend.application_status}: {instructor.status}
                     </Button>
                  </>
               )}
            </div>
         ) : (
            <form onSubmit={handleSubmit} className="relative space-y-4">
               <div>
                  <Label>{input.designation}</Label>
                  <Input type="text" name="designation" onChange={(e) => onHandleChange(e, setData)} placeholder={input.designation_placeholder} />
                  <InputError message={errors.designation} />
               </div>

               <div>
                  <Label>{input.resume}</Label>
                  <Input readOnly type="file" name="resume" onChange={(e) => onHandleChange(e, setData)} />
                  <InputError message={errors.resume} />
               </div>

               <div>
                  <Label>{input.skills}</Label>
                  <TagInput
                     defaultTags={data.skills}
                     placeholder={input.skills_tag_placeholder}
                     onChange={(values: any) => setData('skills', values)}
                  />
                  <InputError message={errors.skills} />
               </div>

               <div className="pb-3">
                  <Label>{input.biography}</Label>
                  <Textarea
                     rows={5}
                     required
                     name="biography"
                     value={data.biography}
                     onChange={(e) => onHandleChange(e, setData)}
                     placeholder={input.biography_placeholder}
                  />
                  <InputError message={errors.biography} />
               </div>

               <LoadingButton loading={processing} className="mt-2">
                  {instructor ? button.submit : button.update}
               </LoadingButton>
            </form>
         )}
      </Card>
   );
};

export default BecomeInstructor;
