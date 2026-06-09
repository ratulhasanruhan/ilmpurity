import TableFilter from '@/components/table/table-filter';
import TableFooter from '@/components/table/table-footer';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Link } from '@inertiajs/react';
import { Briefcase, BriefcaseBusiness, Building2, Calendar, Eye, MapPin, TrendingUp } from 'lucide-react';

const Career = ({ jobCirculars }: { jobCirculars: Pagination<JobCircular> }) => {
   const getStatusBadge = (status: string) => {
      const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
         draft: 'outline',
         active: 'default',
         paused: 'secondary',
         closed: 'destructive',
         expired: 'destructive',
      };

      return <Badge variant={variants[status] || 'outline'}>{status}</Badge>;
   };

   return (
      <div className="container my-20">
         <Card className="!shadow-none">
            <TableFilter
               data={jobCirculars}
               title="Job Circulars"
               globalSearch={true}
               tablePageSizes={[10, 15, 20, 25]}
               routeName="inner.page"
               routeParams={{ slug: 'careers' }}
            />

            <CardContent>
               {jobCirculars.data.length > 0 ? (
                  <div className="space-y-4">
                     {jobCirculars.data.map((job) => (
                        <div key={job.id} className="hover:bg-muted/50 rounded-lg border p-4 transition-colors">
                           <div className="flex flex-col items-start justify-between gap-7 md:flex-row md:gap-4">
                              <div className="flex-1 space-y-4">
                                 <div className="flex items-center gap-2 hover:underline">
                                    <Link href={route('job-circulars.show', job.id)}>
                                       <h3 className="text-lg font-semibold">{job.title}</h3>
                                    </Link>
                                    {getStatusBadge(job.status)}
                                 </div>

                                 <div className="text-muted-foreground flex flex-wrap items-center gap-4 text-sm">
                                    <div className="flex items-center gap-1">
                                       <MapPin className="h-4 w-4" />
                                       {job.location}
                                    </div>
                                    <div className="flex items-center gap-1 capitalize">
                                       <Briefcase className="h-4 w-4" />
                                       {job.job_type}
                                    </div>
                                    <div className="flex items-center gap-1 capitalize">
                                       <Building2 className="h-4 w-4" />
                                       {job.work_type}
                                    </div>
                                    <div className="flex items-center gap-1 capitalize">
                                       <TrendingUp className="h-4 w-4" />
                                       {job.experience_level}
                                    </div>
                                    <div className="flex items-center gap-1 capitalize">
                                       <BriefcaseBusiness className="h-4 w-4" />
                                       {job.positions_available} Position{job.positions_available !== 1 ? 's' : ''}
                                    </div>
                                    <div className="flex items-center gap-1">
                                       <Calendar className="h-4 w-4" />
                                       {new Date(job.application_deadline).toLocaleDateString('en-US', {
                                          year: 'numeric',
                                          month: 'long',
                                          day: 'numeric',
                                       })}
                                    </div>
                                 </div>
                              </div>

                              <Button variant="secondary" size="icon" asChild>
                                 <Link href={route('job-circulars.show', job.id)}>
                                    <Eye className="h-4 w-4" />
                                 </Link>
                              </Button>
                           </div>
                        </div>
                     ))}
                  </div>
               ) : (
                  <div className="py-12 text-center">
                     <Briefcase className="text-muted-foreground mx-auto h-12 w-12" />
                     <h3 className="mt-4 text-lg font-semibold">No job circulars found</h3>
                     <p className="text-muted-foreground mt-2">Get started by creating your first job circular</p>
                  </div>
               )}
            </CardContent>

            <TableFooter className="p-5 sm:p-7" routeName="inner.page" routeParams={{ slug: 'careers' }} paginationInfo={jobCirculars} />
         </Card>
      </div>
   );
};

export default Career;
