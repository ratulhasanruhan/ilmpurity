import Combobox from '@/components/combobox';
import InputError from '@/components/input-error';
import LoadingButton from '@/components/loading-button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ScrollArea } from '@/components/ui/scroll-area';
import { SharedData } from '@/types/global';
import { useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';

interface Props {
   type: 'course' | 'exam';
   title: string;
   handler: React.ReactNode;
}

export interface EnrollmentProps extends SharedData {
   users: User[];
   exams: Exam[];
   courses: Course[];
   prices: string[];
   enrollments: Pagination<ExamEnrollment | CourseEnrollment>;
}

const EnrollmentModal = ({ type, title, handler }: Props) => {
   const [open, setOpen] = useState(false);
   const { users, exams, courses, prices, translate } = usePage<EnrollmentProps>().props;

   const { input, button } = translate;

   const { data, setData, post, errors, processing } = useForm({
      user_id: '',
      exam_id: '',
      course_id: '',
      enrollment_type: 'free',
   });

   // Handle form submission
   const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();

      if (type === 'exam') {
         post(route('exam-enrollments.store'));
      } else {
         post(route('course-enrollments.store'));
      }
   };

   const transformedUsers = users.map((user) => ({
      label: user.name,
      value: user.id as string,
   }));

   const transformedExams =
      type === 'exam'
         ? exams.map((exam) => ({
              label: exam.title,
              value: exam.id as string,
           }))
         : [];

   const transformedCourses =
      type === 'course'
         ? courses.map((course) => ({
              label: course.title,
              value: course.id as string,
           }))
         : [];

   return (
      <Dialog open={open} onOpenChange={setOpen}>
         <DialogTrigger asChild>{handler}</DialogTrigger>

         <DialogContent className="p-0">
            <ScrollArea className="max-h-[90vh] p-6">
               <DialogHeader className="mb-6">
                  <DialogTitle>{title}</DialogTitle>
               </DialogHeader>

               <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                     <Label>Select User</Label>
                     <Combobox
                        data={transformedUsers}
                        defaultValue={data.user_id}
                        placeholder={input.select}
                        onSelect={(selected) => setData('user_id', selected.value)}
                     />
                     <InputError message={errors.user_id} />
                  </div>

                  <div>
                     <Label>{type === 'exam' ? 'Select Exam' : 'Select Course'}</Label>
                     <Combobox
                        data={type === 'exam' ? transformedExams : transformedCourses}
                        defaultValue={data.course_id}
                        placeholder={type === 'exam' ? 'Select Exam' : 'Select Course'}
                        onSelect={(selected) => setData(type === 'exam' ? 'exam_id' : 'course_id', selected.value)}
                     />
                     <InputError message={errors[type === 'exam' ? 'exam_id' : 'course_id']} />
                  </div>

                  <div>
                     <Label>{input.enrollment_type}</Label>
                     <RadioGroup
                        defaultValue={data.enrollment_type}
                        className="flex items-center space-x-4 pt-2 pb-1"
                        onValueChange={(value) => setData('enrollment_type', value)}
                     >
                        {prices.map((price) => (
                           <div key={price} className="flex items-center space-x-2">
                              <RadioGroupItem className="cursor-pointer" id={price} value={price} />
                              <Label htmlFor={price} className="capitalize">
                                 {price}
                              </Label>
                           </div>
                        ))}
                     </RadioGroup>
                     <InputError message={errors.enrollment_type} />
                  </div>

                  <div className="col-span-2 mt-6 text-right">
                     <LoadingButton loading={processing}>{button.submit}</LoadingButton>
                  </div>
               </form>
            </ScrollArea>
         </DialogContent>
      </Dialog>
   );
};

export default EnrollmentModal;
