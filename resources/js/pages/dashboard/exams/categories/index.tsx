import DeleteModal from '@/components/inertia/delete-modal';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/hooks/use-auth';
import DashboardLayout from '@/layouts/dashboard/layout';
import { Head } from '@inertiajs/react';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { DynamicIcon } from 'lucide-react/dynamic';
import CategoryForm from './category-form';

interface Props {
   categories: ExamCategory[];
}

const CategoriesIndex = ({ categories }: Props) => {
   const { isAdmin } = useAuth();

   const defaultCategory = categories.find((category) => category.slug === 'default');
   const otherCategories = categories.filter((category) => category.slug !== 'default');
   return (
      <>
         <Head title="Exam Categories" />

         <div className="space-y-6">
            <div className="flex items-center justify-between">
               <div>
                  <h1 className="text-3xl font-bold text-gray-900">Exam Categories</h1>
                  <p className="mt-1 text-sm text-gray-600">Manage exam categories and organize your exams</p>
               </div>

               <CategoryForm
                  title="Create Category"
                  handler={
                     <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Category
                     </Button>
                  }
               />
            </div>

            {categories.length > 0 ? (
               <div className="mt-6 grid grid-cols-1 gap-6 border-t border-gray-300 py-6 md:grid-cols-2 lg:grid-cols-3">
                  {defaultCategory && (
                     <Card key={defaultCategory.id} className="p-6">
                        <div className="flex items-center gap-2">
                           <DynamicIcon size={20} name={defaultCategory.icon as any} />
                           <h2>{defaultCategory.title}</h2>
                        </div>

                        <Separator className="my-4" />

                        <p className="text-muted-foreground text-sm">
                           When a category is deleted, its exams are moved to the default category. The default category cannot be edited or removed.
                        </p>
                     </Card>
                  )}

                  {otherCategories.map((category) => (
                     <Card key={category.id} className="p-6">
                        <div className="relative text-center">
                           <div className="flex items-center gap-2">
                              <DynamicIcon size={20} name={category.icon as any} />
                              <h2>{category.title}</h2>
                           </div>

                           <div className="absolute -top-1 right-0 space-x-1">
                              <CategoryForm
                                 title="Edit Category"
                                 category={category}
                                 handler={
                                    <Button size="icon" variant="ghost" className="bg-muted hover:bg-muted-foreground/10 h-8 w-8 rounded-full p-0">
                                       <Pencil className="text-sm" />
                                    </Button>
                                 }
                              />

                              {isAdmin && (
                                 <DeleteModal
                                    message="Are you sure you want to delete this category?"
                                    routePath={route('exam-categories.destroy', category.id)}
                                    actionComponent={
                                       <Button
                                          size="icon"
                                          variant="ghost"
                                          className="bg-destructive/8 hover:bg-destructive/6 h-8 w-8 rounded-full p-0"
                                       >
                                          <Trash2 className="text-destructive text-sm" />
                                       </Button>
                                    }
                                 />
                              )}
                           </div>
                        </div>

                        <Separator className="my-4" />

                        <CardContent className="p-0">
                           <p className="mb-3 text-sm text-gray-600">{category.description || 'No description'}</p>
                           <div className="flex items-center justify-between">
                              <Badge variant={category.status ? 'default' : 'secondary'}>{category.status ? 'Active' : 'Inactive'}</Badge>
                              <span className="text-sm text-gray-500">{category.exams_count || 0} exams</span>
                           </div>
                        </CardContent>
                     </Card>
                  ))}
               </div>
            ) : (
               <div className="col-span-full">
                  <Card>
                     <CardContent className="flex flex-col items-center justify-center py-12">
                        <p className="mb-4 text-gray-600">No categories found. Create your first category!</p>
                        <CategoryForm
                           title="Create Category"
                           handler={
                              <Button>
                                 <Plus className="mr-2 h-4 w-4" />
                                 Add Category
                              </Button>
                           }
                        />
                     </CardContent>
                  </Card>
               </div>
            )}
         </div>
      </>
   );
};

CategoriesIndex.layout = (page: React.ReactNode) => <DashboardLayout>{page}</DashboardLayout>;
export default CategoriesIndex;
