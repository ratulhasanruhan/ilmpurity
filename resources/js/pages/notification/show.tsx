import TiptapRenderer from '@/components/text-editor/tiptap-renderer/client-renderer';
import { Button } from '@/components/ui/button';
import LandingLayout from '@/layouts/landing-layout';
import { Link } from '@inertiajs/react';
import { ReactNode } from 'react';

const Show = ({ notification, translate }: { notification: Notification; translate: any }) => {
   const { button } = translate;

   return (
      <div className="container mx-auto max-w-2xl py-12">
         <p className="font-medium capitalize">{notification.data.title}</p>

         <TiptapRenderer>{notification.data.body}</TiptapRenderer>

         {notification.data.url && (
            <Link href={notification.data.url}>
               <Button>{button.view}</Button>
            </Link>
         )}
      </div>
   );
};

Show.layout = (page: ReactNode) => <LandingLayout children={page} customizable={false} />;

export default Show;
