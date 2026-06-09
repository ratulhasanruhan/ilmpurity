import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import VideoPlayer from '@/components/video-player';
import courseLanguages from '@/data/course-languages';
import { getCourseDuration, systemCurrency } from '@/lib/utils';
import { usePage } from '@inertiajs/react';
import { BarChart3, Calendar, Clock, Languages, Mail, Play, Users } from 'lucide-react';
import { CourseDetailsProps } from '../show';
import EnrollOrPlayerButton from './course-player-button';

const CoursePreview = () => {
   const { course, system, translate } = usePage<CourseDetailsProps>().props;
   const { frontend } = translate;
   const currency = systemCurrency(system.fields['selling_currency']);
   const courseLanguage = courseLanguages.find((language) => language.value === course.language);

   return (
      <div className="bg-card sticky top-24 space-y-5 rounded-lg border p-5 shadow">
         <div className="space-y-4">
            <div className="relative">
               <img className="w-full rounded-lg" src={course.thumbnail ?? '/assets/images/blank-image.jpg'} alt="" />

               {course.preview && (
                  <Dialog>
                     <DialogTrigger asChild>
                        <button className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 cursor-pointer rounded-full bg-black/70 p-4 transition-transform hover:scale-110">
                           <Play className="h-6 w-6 text-white" />
                        </button>
                     </DialogTrigger>

                     <DialogContent className="overflow-hidden p-0 md:min-w-3xl">
                        <VideoPlayer
                           source={{
                              type: 'video' as const,
                              sources: [
                                 {
                                    src: course.preview,
                                    type: 'video/mp4' as const,
                                 },
                              ],
                           }}
                        />
                     </DialogContent>
                  </Dialog>
               )}
            </div>

            <h2 className="text-4xl font-bold capitalize">
               {course.pricing_type === 'free' ? (
                  course.pricing_type
               ) : course.discount ? (
                  <>
                     <span className="font-semibold">
                        {currency?.symbol}
                        {course.discount_price}
                     </span>
                     <span className="text-muted-foreground ml-2 text-base font-medium line-through">
                        {currency?.symbol}
                        {course.price}
                     </span>
                  </>
               ) : (
                  <>
                     <span className="font-semibold">
                        {currency?.symbol}
                        {course.price}
                     </span>
                  </>
               )}
            </h2>

            <EnrollOrPlayerButton />
         </div>

         <div className="space-y-4 pt-5">
            <div className="flex items-center justify-between">
               <span className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  {frontend.students}
               </span>
               <span>{course.enrollments_count || 0}</span>
            </div>

            <div className="flex items-center justify-between">
               <span className="flex items-center gap-2">
                  <Languages className="h-5 w-5" />
                  {frontend.language}
               </span>
               <span>{courseLanguage?.label}</span>
            </div>

            <div className="flex items-center justify-between">
               <span className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  {frontend.duration}
               </span>
               <span>{getCourseDuration(course)}</span>
            </div>

            <div className="flex items-center justify-between">
               <span className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  {frontend.level}
               </span>
               <span className="capitalize">{course.level}</span>
            </div>

            <div className="flex items-center justify-between">
               <span className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  {frontend.expiry_period}
               </span>
               <span className="capitalize">{course.expiry_type}</span>
            </div>

            <div className="flex items-center justify-between">
               <span className="flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  {frontend.certificate_included}
               </span>
               <span>Yes</span>
            </div>
         </div>
      </div>
   );
};

export default CoursePreview;
