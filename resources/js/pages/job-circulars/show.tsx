import TiptapRenderer from '@/components/text-editor/tiptap-renderer/client-renderer';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import LandingLayout from '@/layouts/landing-layout';
import { SharedData } from '@/types/global';
import { Head, usePage } from '@inertiajs/react';
import { Building2, Clock, Eye, Mail, MapPin, Zap } from 'lucide-react';
import { useState } from 'react';

interface JobCircularShowPageProps extends SharedData {
   jobCircular: JobCircular;
}

const JobCircularShow = () => {
   const { jobCircular, translate } = usePage<JobCircularShowPageProps>().props;
   const { frontend, button, common } = translate;
   const [showFullDescription, setShowFullDescription] = useState(false);

   // Calculate days until deadline
   const getDaysUntilDeadline = () => {
      const deadline = new Date(jobCircular.application_deadline);
      const today = new Date();
      const diffTime = deadline.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays < 0) return common.expired;
      if (diffDays === 0) return common.today;
      if (diffDays === 1) return frontend.day_left;
      return `${diffDays} ${frontend.days_left}`;
   };

   // Format salary display
   const getFormattedSalary = () => {
      const min = jobCircular.salary_min?.toLocaleString();
      const max = jobCircular.salary_max?.toLocaleString();
      const currency = jobCircular.salary_currency;

      if (jobCircular.salary_negotiable) {
         return `${currency} ${min} - ${max} (${frontend.negotiable})`;
      }
      return `${currency} ${min} - ${max}`;
   };

   // Get status badge color
   const getStatusBadge = (status: string) => {
      const statusConfig: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
         active: { label: common.active, variant: 'default' },
         draft: { label: common.draft, variant: 'secondary' },
         closed: { label: frontend.closed, variant: 'destructive' },
         expired: { label: common.expired, variant: 'outline' },
      };

      const config = statusConfig[status] || { label: status, variant: 'outline' };
      return <Badge variant={config.variant}>{config.label}</Badge>;
   };

   return (
      <LandingLayout customizable={false}>
         <Head title={jobCircular.title} />

         <div className="min-h-screen">
            {/* Header */}
            <div className="border-border border-b">
               <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                  <div className="flex items-center justify-between">
                     <div>
                        <div className="flex items-center space-x-2">
                           <h1 className="text-2xl font-semibold">{jobCircular.title}</h1>
                           {getStatusBadge(jobCircular.status)}
                        </div>
                        <div className="text-muted-foreground mt-2 flex items-center space-x-4 text-sm">
                           <div className="flex items-center">
                              <Building2 className="mr-1 h-4 w-4" />
                              <span>{frontend.company_fallback}</span>
                           </div>
                           <div className="flex items-center">
                              <MapPin className="mr-1 h-4 w-4" />
                              <span>{jobCircular.location}</span>
                           </div>
                           <div className="flex items-center">
                              <Clock className="mr-1 h-4 w-4" />
                              <span>{getDaysUntilDeadline()}</span>
                           </div>
                        </div>
                     </div>

                     <div className="flex items-center space-x-3">
                        <Button size="sm" asChild>
                           <a href={`mailto:${jobCircular.contact_email}`}>
                              <Mail className="mr-2 h-4 w-4" />
                              {button.apply}
                           </a>
                        </Button>
                     </div>
                  </div>
               </div>
            </div>

            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
               <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                  {/* Main Content */}
                  <div className="space-y-6 lg:col-span-2">
                     {/* Job Overview Card */}
                     <Card className="!shadow-none">
                        <CardHeader className="pb-4">
                           <div className="flex items-start justify-between">
                              <CardTitle className="mb-2 text-xl font-semibold">{jobCircular.title}</CardTitle>

                              <div className="text-right">
                                 <h6 className="text-secondary-foreground text-lg font-semibold">{getFormattedSalary()}</h6>
                                 <div className="text-muted-foreground mt-1 text-sm">
                                    {jobCircular.positions_available} {jobCircular.positions_available !== 1 ? frontend.positions : frontend.position}{' '}
                                    {frontend.available}
                                 </div>
                              </div>
                           </div>
                        </CardHeader>
                        <CardContent>
                           <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                              <div className="bg-muted rounded-lg p-4 text-center">
                                 <div className="mb-2 text-2xl">🎯</div>
                                 <div className="font-semibold capitalize">{jobCircular.experience_level}</div>
                                 <div className="text-muted-foreground text-sm">{frontend.experience_level}</div>
                              </div>
                              <div className="bg-muted rounded-lg p-4 text-center">
                                 <div className="mb-2 text-2xl">💼</div>
                                 <div className="font-semibold capitalize">{jobCircular.job_type}</div>
                                 <div className="text-muted-foreground text-sm">{frontend.job_type}</div>
                              </div>
                              <div className="bg-muted rounded-lg p-4 text-center">
                                 <div className="mb-2 text-2xl">🏢</div>
                                 <div className="font-semibold capitalize">{jobCircular.work_type}</div>
                                 <div className="text-muted-foreground text-sm">{frontend.work_type}</div>
                              </div>
                              <div className="bg-muted rounded-lg p-4 text-center">
                                 <div className="mb-2 text-2xl">📅</div>
                                 <div className="font-semibold capitalize">{getDaysUntilDeadline()}</div>
                                 <div className="text-muted-foreground text-sm">{frontend.application_deadline}</div>
                              </div>
                           </div>
                        </CardContent>
                     </Card>

                     {/* Job Description */}
                     <Card className="!shadow-none">
                        <CardHeader>
                           <CardTitle className="text-xl font-semibold">{frontend.job_description}</CardTitle>
                        </CardHeader>
                        <CardContent>
                           <div className={`${showFullDescription ? '' : 'max-h-96 overflow-hidden'}`}>
                              <TiptapRenderer>{jobCircular.description}</TiptapRenderer>
                           </div>

                           {!showFullDescription && (
                              <div className="mt-4 text-center">
                                 <Button variant="outline" onClick={() => setShowFullDescription(true)} className="w-full">
                                    <Eye className="mr-2 h-4 w-4" />
                                    {button.show_full}
                                 </Button>
                              </div>
                           )}
                           {showFullDescription && (
                              <div className="mt-4 text-center">
                                 <Button variant="outline" onClick={() => setShowFullDescription(false)} className="w-full">
                                    <Eye className="mr-2 h-4 w-4" />
                                    {button.show_less}
                                 </Button>
                              </div>
                           )}
                        </CardContent>
                     </Card>

                     {/* Required Skills */}
                     <Card className="!shadow-none">
                        <CardHeader>
                           <CardTitle className="flex items-center text-xl font-semibold">
                              <Zap className="mr-2 h-5 w-5 text-yellow-500" />
                              {frontend.skills_required}
                           </CardTitle>
                        </CardHeader>
                        <CardContent>
                           <div className="flex flex-wrap gap-2">
                              {jobCircular.skills_required.map((skill, index) => (
                                 <Badge key={index} variant="secondary" className="px-3 py-1 text-sm">
                                    {skill}
                                 </Badge>
                              ))}
                           </div>
                        </CardContent>
                     </Card>
                  </div>

                  {/* Sidebar */}
                  <div className="space-y-6">
                     {/* Quick Apply Card */}
                     <Card className="!shadow-none">
                        <CardHeader className="text-center">
                           <CardTitle className="text-xl font-semibold">{frontend.quick_apply}</CardTitle>
                           <CardDescription>{frontend.send_application}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                           <Button className="w-full" asChild>
                              <a href={`mailto:${jobCircular.contact_email}`}>
                                 <Mail className="mr-2 h-4 w-4" />
                                 {frontend.apply_via_email}
                              </a>
                           </Button>

                           <div className="text-muted-foreground text-center text-sm">
                              <p>{frontend.application_deadline}:</p>
                              <p className="font-semibold">{new Date(jobCircular.application_deadline).toLocaleDateString()}</p>
                           </div>
                        </CardContent>
                     </Card>

                     {/* Job Stats */}
                     <Card className="!shadow-none">
                        <CardHeader>
                           <CardTitle className="text-lg font-semibold">{frontend.job_statistics}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                           <div className="grid grid-cols-2 gap-4">
                              <div className="bg-secondary text-secondary-foreground rounded-lg p-3 text-center">
                                 <div className="text-2xl font-semibold">{jobCircular.positions_available}</div>
                                 <div className="text-sm">{frontend.positions_available}</div>
                              </div>
                              <div className="bg-secondary text-secondary-foreground rounded-lg p-3 text-center">
                                 <div className="text-2xl font-semibold">{getDaysUntilDeadline().includes('Expired') ? '0' : 'Active'}</div>
                                 <div className="text-sm">{common.status}</div>
                              </div>
                           </div>
                           <div className="text-muted-foreground text-center text-sm">
                              <p>
                                 {frontend.posted} {new Date(jobCircular.created_at).toLocaleDateString()}
                              </p>
                              <p>
                                 {frontend.last_updated} {new Date(jobCircular.updated_at).toLocaleDateString()}
                              </p>
                           </div>
                        </CardContent>
                     </Card>
                  </div>
               </div>
            </div>
         </div>
      </LandingLayout>
   );
};

export default JobCircularShow;
