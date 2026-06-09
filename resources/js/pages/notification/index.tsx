import TableFilter from '@/components/table/table-filter';
import TableFooter from '@/components/table/table-footer';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import LandingLayout from '@/layouts/landing-layout';
import { cn } from '@/lib/utils';
import { Link, router } from '@inertiajs/react';
import { format, formatDistanceToNow } from 'date-fns';
import { ReactNode } from 'react';

const Index = ({ notifications, translate }: { notifications: Pagination<Notification>; translate: any }) => {
   const { button, frontend } = translate;

   return (
      <div className="container mx-auto max-w-2xl py-12">
         <div className="flex items-start justify-between gap-4 pb-5 md:pb-6">
            <TableFilter
               data={notifications}
               title={frontend.notification_list}
               globalSearch={false}
               tablePageSizes={[10, 15, 20, 25]}
               routeName="notifications.index"
               className="w-full p-0 md:p-0"
            />
            {notifications.total > 0 && (
               <Button variant="outline" onClick={() => router.put(route('notifications.mark-all-as-read'))}>
                  {button.mark_all_as_read}
               </Button>
            )}
         </div>

         <Card className="flex flex-col divide-y">
            {notifications.data.length > 0 ? (
               notifications.data.map(({ id, data, created_at }) => {
                  const time = formatDistanceToNow(new Date(created_at), { addSuffix: true });
                  const timeText = time.slice(0, 1).toUpperCase() + time.slice(1);

                  return (
                     <Link
                        key={id}
                        href={route('notifications.show', id)}
                        className={cn('hover:bg-accent/50 flex flex-col gap-1 px-4 py-2 transition-colors')}
                     >
                        <p className="text-sm font-medium capitalize">{data.title}</p>
                        <span className="text-muted-foreground text-xs" title={format(new Date(created_at), 'PPpp')}>
                           {timeText}
                        </span>
                     </Link>
                  );
               })
            ) : (
               <p className="text-muted-foreground p-6 text-center text-sm">{frontend.no_unread_notifications}</p>
            )}
         </Card>

         <TableFooter className="mt-1 p-5 sm:p-7" routeName="notifications.index" paginationInfo={notifications} />
      </div>
   );
};

Index.layout = (page: ReactNode) => <LandingLayout children={page} customizable={false} />;

export default Index;
