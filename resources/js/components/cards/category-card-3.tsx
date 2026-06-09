import { Card } from '@/components/ui/card';
import { Link } from '@inertiajs/react';

const CategoryCard2 = ({ category }: { category: CourseCategory }) => {
   return (
      <Link href={route('category.courses', { category: category.slug })}>
         <Card className="border-muted hover:!shadow-card h-[110px] gap-4 rounded-2xl px-12 py-6 !shadow-none">
            <p className="text-lg font-medium">{category.title}</p>
            <p className="text-muted-foreground">{category.courses_count} Courses</p>
         </Card>
      </Link>
   );
};

export default CategoryCard2;
