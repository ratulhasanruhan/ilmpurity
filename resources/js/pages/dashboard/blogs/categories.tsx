import DataSortModal from '@/components/data-sort-modal';
import DeleteModal from '@/components/inertia/delete-modal';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import DashboardLayout from '@/layouts/dashboard/layout';
import { SharedData } from '@/types/global';
import { Head, router, usePage } from '@inertiajs/react';
import { Edit, FolderOpen, PauseCircle, PlayCircle, Plus, SortAsc, Trash2 } from 'lucide-react';
import { DynamicIcon } from 'lucide-react/dynamic';
import { ReactNode } from 'react';
import CategoryForm from './partials/category-form';

export interface BlogCategoriesPageProps extends SharedData {
   categories: BlogCategory[];
   statistics: {
      total: number;
      active: number;
      inactive: number;
   };
   statuses: Record<string, string>;
}

const BlogCategoriesIndex = () => {
   const { props } = usePage<BlogCategoriesPageProps>();
   const { categories, statistics, translate } = props;
   const { dashboard, button } = translate;

   const defaultCategory = categories.find((category) => category.slug === 'default');
   const allCategories = categories.filter((category) => category.slug !== 'default');

   return (
      <>
         <Head title={dashboard.blog_categories} />

         <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
               <h1 className="hidden text-xl font-semibold sm:block">{dashboard.blog_category}</h1>

               <div className="flex items-center gap-4">
                  <DataSortModal
                     title={dashboard.sort_categories}
                     data={allCategories}
                     handler={
                        <Button variant="ghost" className="bg-muted hover:bg-muted-foreground/6">
                           <SortAsc /> {button.sort_categories}
                        </Button>
                     }
                     onOrderChange={(newOrder, setOpen) => {
                        router.post(
                           route('blogs.categories.sort'),
                           {
                              sortedData: newOrder,
                           },
                           {
                              preserveScroll: true,
                              onSuccess: () => setOpen && setOpen(false),
                           },
                        );
                     }}
                     renderContent={(item) => (
                        <Card className="w-full px-4 py-3">
                           <p>{item.name}</p>
                        </Card>
                     )}
                  />

                  <CategoryForm
                     title={dashboard.create_category}
                     handler={
                        <Button>
                           <Plus className="h-4 w-4" />
                           {button.create}
                        </Button>
                     }
                  />
               </div>
            </div>

            {/* Statistics Cards */}
            <div className="grid gap-4 md:grid-cols-3">
               <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                     <CardTitle className="text-sm font-medium">{dashboard.total_categories}</CardTitle>
                     <FolderOpen className="text-muted-foreground h-4 w-4" />
                  </CardHeader>
                  <CardContent>
                     <div className="text-2xl font-bold">{statistics.total}</div>
                  </CardContent>
               </Card>

               <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                     <CardTitle className="text-sm font-medium">{dashboard.active}</CardTitle>
                     <PlayCircle className="h-4 w-4 text-green-600" />
                  </CardHeader>
                  <CardContent>
                     <div className="text-2xl font-bold text-green-600">{statistics.active}</div>
                  </CardContent>
               </Card>

               <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                     <CardTitle className="text-sm font-medium">{dashboard.inactive}</CardTitle>
                     <PauseCircle className="h-4 w-4 text-red-600" />
                  </CardHeader>
                  <CardContent>
                     <div className="text-2xl font-bold text-red-600">{statistics.inactive}</div>
                  </CardContent>
               </Card>
            </div>

            {/* Categories Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
               {defaultCategory && (
                  <Card className="relative">
                     <CardHeader className="pb-4">
                        <div className="flex items-center gap-2">
                           <DynamicIcon name={defaultCategory.icon as any} />

                           <CardTitle className="text-lg">{defaultCategory.name}</CardTitle>
                        </div>

                        {defaultCategory.description && <p className="text-muted-foreground text-sm">{defaultCategory.description}</p>}
                     </CardHeader>
                     <CardContent>
                        <div className="flex items-center justify-between text-sm">
                           <span className="text-muted-foreground">{dashboard.total_number_of_blog}</span>
                           <span className="font-medium">{defaultCategory.blogs_count}</span>
                        </div>
                     </CardContent>
                  </Card>
               )}

               {allCategories.map((category) => (
                  <Card key={category.id} className="relative">
                     <CardHeader className="pb-4">
                        <div className="flex items-start justify-between">
                           <div className="flex items-center gap-2">
                              <DynamicIcon name={category.icon as any} />

                              <CardTitle className="text-lg">{category.name}</CardTitle>

                              <Badge variant={category.status === 'active' ? 'default' : 'destructive'}>{category.status}</Badge>
                           </div>

                           <div className="flex gap-1">
                              <CategoryForm
                                 title={button.update}
                                 category={category}
                                 handler={
                                    <Button variant="ghost" size="icon">
                                       <Edit className="h-4 w-4" />
                                    </Button>
                                 }
                              />

                              <DeleteModal
                                 routePath={route('blogs.categories.destroy', category.id)}
                                 actionComponent={
                                    <Button variant="ghost" size="icon">
                                       <Trash2 className="text-destructive h-4 w-4" />
                                    </Button>
                                 }
                              />
                           </div>
                        </div>
                        {category.description && <p className="text-muted-foreground text-sm">{category.description}</p>}
                     </CardHeader>
                     <CardContent>
                        <div className="flex items-center justify-between text-sm">
                           <span className="text-muted-foreground">{dashboard.total_number_of_blog}</span>
                           <span className="font-medium">{category.blogs_count}</span>
                        </div>
                     </CardContent>
                  </Card>
               ))}
            </div>

            {categories.length === 0 && (
               <div className="py-12 text-center">
                  <FolderOpen className="text-muted-foreground mx-auto h-12 w-12" />
                  <h3 className="mt-4 text-lg font-semibold">No categories found</h3>
                  <p className="text-muted-foreground mt-2">Get started by creating your first blog category</p>

                  <CategoryForm
                     title="Create Category"
                     handler={
                        <Button>
                           <Plus className="mr-2 h-4 w-4" />
                           Add New Category
                        </Button>
                     }
                  />
               </div>
            )}
         </div>
      </>
   );
};

BlogCategoriesIndex.layout = (page: ReactNode) => <DashboardLayout children={page} />;

export default BlogCategoriesIndex;
