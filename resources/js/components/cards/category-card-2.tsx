import { Card } from '@/components/ui/card';
import { Link } from '@inertiajs/react';
import { DynamicIcon } from 'lucide-react/dynamic';

const CategoryCard1 = ({ category }: { category: CourseCategory }) => {
   return (
      <Link href={route('category.courses', { category: category.slug })}>
         <Card className="hover:!shadow-card min:h-[110px] flex items-center gap-4 rounded-2xl p-6 !shadow-none">
            <div className="bg-muted flex h-12 w-12 items-center justify-center rounded-full">
               <DynamicIcon size={24} name={category.icon as any} />
            </div>

            <div>
               <p className="text-lg font-medium">{category.title}</p>
               <p className="text-muted-foreground">{category.courses_count} Courses</p>
            </div>
         </Card>
      </Link>
   );
};

export default CategoryCard1;
