import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { router, usePage } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import { CourseUpdateProps } from '../update';
import FaqForm from './forms/faq-form';
import OutcomeForm from './forms/outcome-form';
import RequirementForm from './forms/requirement-form';

const Info = () => {
   const { props } = usePage<CourseUpdateProps>();
   const { translate } = props;
   const { dashboard, button } = translate;
   const { faqs, requirements, outcomes } = props.course;

   return (
      <Card className="space-y-7 p-4 sm:p-6">
         <div className="gap-64md:flex-row justify-betwee3 flex flex-col">
            <h6 className="w-[200px] font-medium">{dashboard.course_faqs}</h6>
            <div className="w-full space-y-6">
               <Button
                  variant="outline"
                  className="w-full"
                  onClick={() =>
                     router.post(route('faqs.store'), {
                        course_id: props.course.id,
                     })
                  }
               >
                  <Plus />
                  {button.add}
               </Button>
               {faqs?.map((faq) => (
                  <FaqForm key={faq.id} faq={faq} />
               ))}
            </div>
         </div>

         <Separator />

         <div className="flex flex-col justify-between gap-3 md:flex-row">
            <h6 className="w-[200px] font-medium">{dashboard.requirements}</h6>
            <div className="w-full space-y-6">
               <Button
                  variant="outline"
                  className="w-full"
                  onClick={() =>
                     router.post(route('requirements.store'), {
                        course_id: props.course.id,
                     })
                  }
               >
                  <Plus />
                  {button.add}
               </Button>
               {requirements?.map((requirement) => (
                  <RequirementForm key={requirement.id} requirement={requirement} />
               ))}
            </div>
         </div>

         <Separator />

         <div className="flex flex-col justify-between gap-3 md:flex-row">
            <h6 className="w-[200px] font-medium">{dashboard.outcomes}</h6>
            <div className="w-full space-y-6">
               <Button
                  variant="outline"
                  className="w-full"
                  onClick={() =>
                     router.post(route('outcomes.store'), {
                        course_id: props.course.id,
                     })
                  }
               >
                  <Plus />
                  {button.add}
               </Button>
               {outcomes?.map((outcome) => (
                  <OutcomeForm key={outcome.id} outcome={outcome} />
               ))}
            </div>
         </div>
      </Card>
   );
};

export default Info;
