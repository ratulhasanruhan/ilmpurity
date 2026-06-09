import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Link } from '@inertiajs/react';
import { DynamicIcon } from 'lucide-react/dynamic';

interface Props extends React.HTMLAttributes<HTMLDivElement> {
   category: CourseCategory;
   className?: string;
}

const CategoryCard3 = ({ category, className, ...props }: Props) => {
   return (
      <Link href={route('category.courses', { category: category.slug })}>
         <Card className={cn('border-muted hover:!shadow-card rounded-2xl p-6 !shadow-none', className)} {...props}>
            <DynamicIcon size={24} name={category.icon as any} />
            <p className="text-primary pt-5 pb-8 text-xl font-semibold">{category.title}</p>
            <p className="text-sm">{category.courses_count} Courses</p>
         </Card>
      </Link>
   );
};

export default CategoryCard3;
