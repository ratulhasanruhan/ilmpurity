import DeleteModal from '@/components/inertia/delete-modal';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ColumnDef } from '@tanstack/react-table';
import { Trash2 } from 'lucide-react';

const AdminTableColumn = (enrollmentType: 'course' | 'exam', translate: LanguageTranslations): ColumnDef<CourseEnrollment | ExamEnrollment>[] => {
   const { table } = translate;

   return [
      {
         id: 'index',
         header: () => <div className="pl-4">#</div>,
         cell: ({ row }) => <div className="w-4 pl-4 text-center font-medium">{row.index + 1}</div>,
      },
      {
         id: 'name',
         header: table.name,
         cell: ({ row }) => {
            const user = row.original.user;
            return (
               <div className="flex items-center gap-3">
                  <div className="bg-muted h-12 w-12 overflow-hidden rounded-full">
                     {user.photo ? (
                        <img src={user.photo} alt={user.name} className="h-full w-full object-cover" />
                     ) : (
                        <div className="flex h-full w-full items-center justify-center bg-gray-200 text-gray-500">
                           <span className="text-lg">{table.img_placeholder}</span>
                        </div>
                     )}
                  </div>
                  <div>
                     <p className="font-medium">{user.name}</p>
                     <p className="text-muted-foreground text-sm">{user.email}</p>
                  </div>
               </div>
            );
         },
      },
      {
         id: 'enrolled_course',
         header: () => (enrollmentType === 'course' ? table.enrolled_course : 'Enrolled Exam'),
         cell: ({ row }) => {
            const exam = row.original as ExamEnrollment;
            const course = row.original as CourseEnrollment;

            return (
               <div className="max-w-md">
                  <p className="line-clamp-1">{enrollmentType === 'course' ? course.course.title : exam.exam.title}</p>
               </div>
            );
         },
      },
      {
         id: 'enrolled_date',
         header: table.enrolled_date,
         cell: ({ row }) => {
            // Convert to a readable date format
            const date = new Date(row.original.entry_date);
            const formattedDate = date.toLocaleDateString('en-US', {
               month: 'long',
               day: '2-digit',
               year: 'numeric',
            });

            return <div>{formattedDate}</div>;
         },
      },
      {
         id: 'expiry_date',
         header: table.expiry_date,
         cell: ({ row }) => {
            if (!row.original.expiry_date) {
               return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">{table.lifetime_access}</Badge>;
            }

            const date = new Date(row.original.expiry_date);
            const formattedDate = date.toLocaleDateString('en-US', {
               month: 'long',
               day: '2-digit',
               year: 'numeric',
            });

            return <div>{formattedDate}</div>;
         },
      },
      {
         id: 'actions',
         header: () => <div className="pr-4 text-end">{table.action}</div>,
         cell: ({ row }) => {
            return (
               <div className="flex justify-end pr-4">
                  <DeleteModal
                     routePath={route('enrollments.destroy', row.original.id)}
                     actionComponent={
                        <Button size="icon" variant="ghost" className="h-8 w-8 bg-red-50 text-red-500 hover:bg-red-100 hover:text-red-500">
                           <Trash2 className="h-5 w-5" />
                        </Button>
                     }
                  />
               </div>
            );
         },
      },
   ];
};

export default AdminTableColumn;
