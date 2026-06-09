import { Card } from '@/components/ui/card';
import { useLang } from '@/hooks/use-lang';
import { cn } from '@/lib/utils';
import { Link } from '@inertiajs/react';
import { ExternalLink } from 'lucide-react';
import { DynamicIcon } from 'lucide-react/dynamic';

interface Props extends React.HTMLAttributes<HTMLDivElement> {
   category: CourseCategory;
   className?: string;
}

const CategoryCard1 = ({ category, className, ...props }: Props) => {
   const { common } = useLang();

   return (
      <Link href={route('category.courses', { category: category.slug })}>
         <Card
            className={cn(
               'hover:!shadow-card min:h-[110px] bg-secondary-lighter border-secondary-light text-secondary-foreground gap-4 rounded-2xl p-5 !shadow-none',
               className,
            )}
            {...props}
         >
            <DynamicIcon size={28} name={category.icon as any} />

            <p className="text-primary mt-4 mb-8 text-xl font-semibold">{category.title}</p>

            <div className="flex items-center justify-between gap-2">
               <p className="text-sm">
                  {category.courses_count} {common.courses}
               </p>
               <ExternalLink className="h-4 w-4" />
            </div>
         </Card>
      </Link>
   );
};

export default CategoryCard1;
