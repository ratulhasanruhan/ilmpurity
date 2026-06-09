import { Button } from '@/components/ui/button';
import { useLang } from '@/hooks/use-lang';
import DashboardLayout from '@/layouts/dashboard/layout';
import { SharedData } from '@/types/global';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import { ReactNode } from 'react';
import BlogForm from './partials/blog-form';

export interface BlogCreateEditProps extends SharedData {
   blog?: Blog;
   categories: BlogCategory[];
   statuses: Record<string, string>;
}

const CreateBlog = ({ blog }: BlogCreateEditProps) => {
   const { dashboard, button } = useLang();

   return (
      <>
         <Head title={blog ? button.update : button.create + ' ' + dashboard.blog} />

         <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
               <div className="flex items-center gap-4">
                  <Button variant="outline" size="icon" asChild>
                     <Link href={route('blogs.index')}>
                        <ArrowLeft className="h-4 w-4" />
                     </Link>
                  </Button>

                  <h1 className="text-xl font-semibold">
                     {blog ? button.update : button.create} {dashboard.blog}
                  </h1>
               </div>
            </div>

            <BlogForm />
         </div>
      </>
   );
};

CreateBlog.layout = (page: ReactNode) => <DashboardLayout children={page} />;

export default CreateBlog;
