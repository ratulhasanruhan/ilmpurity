import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { LucideIcon, TrendingDown, TrendingUp } from 'lucide-react';

interface Props {
   icon: LucideIcon;
   label: string;
   value: string | number;
   trend?: {
      value: number;
      isPositive: boolean;
   };
   className?: string;
}

const ExamStatsCard = ({ icon: Icon, label, value, trend, className }: Props) => {
   return (
      <Card className={cn(className)}>
         <CardContent className="p-6">
            <div className="flex items-center justify-between">
               <div className="flex items-center gap-3">
                  <div className="bg-primary/10 flex h-12 w-12 items-center justify-center rounded-lg">
                     <Icon className="text-primary h-6 w-6" />
                  </div>
                  <div>
                     <p className="text-sm font-medium text-gray-600">{label}</p>
                     <p className="text-2xl font-bold text-gray-900">{value}</p>
                  </div>
               </div>
               {trend && (
                  <div
                     className={cn(
                        'flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium',
                        trend.isPositive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700',
                     )}
                  >
                     {trend.isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                     {Math.abs(trend.value)}%
                  </div>
               )}
            </div>
         </CardContent>
      </Card>
   );
};

export default ExamStatsCard;
