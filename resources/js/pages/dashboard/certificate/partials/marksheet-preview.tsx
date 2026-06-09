import { Calendar, ClipboardList } from 'lucide-react';

interface MarksheetPreviewProps {
   template: {
      name: string;
      logo_path?: string | null;
      template_data: {
         primaryColor: string;
         secondaryColor: string;
         backgroundColor: string;
         borderColor: string;
         headerText: string;
         institutionName: string;
         footerText: string;
         fontFamily: string;
      };
   };
   studentName: string;
   courseName: string;
   completionDate: string;
   logoUrl?: string | null;
}

const MarksheetPreview = ({ template, studentName, courseName, completionDate, logoUrl }: MarksheetPreviewProps) => {
   const { template_data } = template;

   const overallGrade = 'A';
   const overallPercentage = 91;

   return (
      <div
         className="relative min-h-[500px] rounded-lg border-4 p-8 shadow-lg"
         style={{
            backgroundColor: template_data.backgroundColor,
            borderColor: template_data.borderColor,
            fontFamily: template_data.fontFamily,
         }}
      >
         {/* Header Section */}
         <div className="mb-6 border-b-2 pb-4" style={{ borderColor: template_data.borderColor }}>
            <div className="flex items-center justify-between">
               <div className="flex items-center gap-4">
                  {logoUrl || template.logo_path ? (
                     <div className="h-16 w-16">
                        <img src={logoUrl || template.logo_path || ''} alt="Logo" className="h-full w-full object-contain" />
                     </div>
                  ) : (
                     <ClipboardList className="h-12 w-12" style={{ color: template_data.primaryColor }} />
                  )}
                  <div>
                     <h2 className="text-2xl font-bold" style={{ color: template_data.primaryColor, fontFamily: template_data.fontFamily }}>
                        {template_data.headerText}
                     </h2>
                     <p className="text-lg" style={{ color: template_data.secondaryColor, fontFamily: template_data.fontFamily }}>
                        {template_data.institutionName}
                     </p>
                  </div>
               </div>
            </div>
         </div>

         {/* Student Info */}
         <div className="mb-6 grid grid-cols-2 gap-4">
            <div>
               <p className="text-sm" style={{ color: template_data.secondaryColor }}>
                  Student Name
               </p>
               <p className="text-lg font-semibold" style={{ color: template_data.primaryColor }}>
                  {studentName}
               </p>
            </div>
            <div>
               <p className="text-sm" style={{ color: template_data.secondaryColor }}>
                  Course
               </p>
               <p className="text-lg font-semibold" style={{ color: template_data.primaryColor }}>
                  {courseName}
               </p>
            </div>
            <div>
               <p className="text-sm" style={{ color: template_data.secondaryColor }}>
                  Completion Date
               </p>
               <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" style={{ color: template_data.secondaryColor }} />
                  <p className="font-medium" style={{ color: template_data.primaryColor }}>
                     {completionDate}
                  </p>
               </div>
            </div>
            <div>
               <p className="text-sm" style={{ color: template_data.secondaryColor }}>
                  Overall Grade
               </p>
               <p className="text-2xl font-bold" style={{ color: template_data.primaryColor }}>
                  {overallGrade} ({overallPercentage}%)
               </p>
            </div>
         </div>

         {/* Exam Type Section */}
         <div className="mb-6">
            <h3 className="mb-3 text-lg font-semibold" style={{ color: template_data.primaryColor }}>
               Exam Type
            </h3>
            <div className="overflow-hidden rounded-lg border" style={{ borderColor: template_data.borderColor }}>
               <table className="w-full">
                  <thead>
                     <tr style={{ backgroundColor: `${template_data.primaryColor}20` }}>
                        <th
                           className="border-b p-3 text-left font-semibold"
                           style={{ color: template_data.primaryColor, borderColor: template_data.borderColor }}
                        >
                           Exam Type
                        </th>
                        <th
                           className="border-b p-3 text-right font-semibold"
                           style={{ color: template_data.primaryColor, borderColor: template_data.borderColor }}
                        >
                           Total Marks
                        </th>
                     </tr>
                  </thead>
                  <tbody>
                     <tr className="border-b" style={{ borderColor: template_data.borderColor }}>
                        <td className="p-3" style={{ color: template_data.secondaryColor }}>
                           Assignment
                        </td>
                        <td className="p-3 text-right font-medium" style={{ color: template_data.primaryColor }}>
                           10/50
                        </td>
                     </tr>
                     <tr>
                        <td className="p-3" style={{ color: template_data.secondaryColor }}>
                           Quiz
                        </td>
                        <td className="p-3 text-right font-medium" style={{ color: template_data.primaryColor }}>
                           0/0
                        </td>
                     </tr>
                  </tbody>
               </table>
            </div>
         </div>

         {/* Footer */}
         <div className="mt-8 border-t-2 pt-4 text-center" style={{ borderColor: template_data.borderColor }}>
            <p className="text-sm" style={{ color: template_data.secondaryColor, fontFamily: template_data.fontFamily }}>
               {template_data.footerText}
            </p>
         </div>
      </div>
   );
};

export default MarksheetPreview;
