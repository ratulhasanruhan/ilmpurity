import { Award, Calendar } from 'lucide-react';

interface CertificatePreviewProps {
   template: {
      name: string;
      logo_path?: string | null;
      template_data: {
         primaryColor: string;
         secondaryColor: string;
         backgroundColor: string;
         borderColor: string;
         titleText: string;
         descriptionText: string;
         completionText: string;
         footerText: string;
         fontFamily: string;
      };
   };
   studentName: string;
   courseName: string;
   completionDate: string;
   logoUrl?: string | null;
}

const CertificatePreview = ({ template, studentName, courseName, completionDate, logoUrl }: CertificatePreviewProps) => {
   const { template_data } = template;

   return (
      <div
         className="relative flex min-h-[400px] flex-col justify-center rounded-lg border-4 p-8 text-center shadow-lg"
         style={{
            backgroundColor: template_data.backgroundColor,
            borderColor: template_data.borderColor,
            fontFamily: template_data.fontFamily,
         }}
      >
         {/* Inner decorative border */}
         <div
            className="absolute inset-4 rounded border-2"
            style={{
               borderColor: template_data.primaryColor,
            }}
         ></div>

         <div className="relative z-10 space-y-6">
            {/* Logo */}
            {(logoUrl || template.logo_path) && (
               <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center">
                  <img src={logoUrl || template.logo_path || ''} alt="Logo" className="h-full w-full object-contain" />
               </div>
            )}

            {/* Award Icon if no logo */}
            {!logoUrl && !template.logo_path && (
               <Award
                  className="mx-auto mb-3 h-12 w-12"
                  style={{
                     color: template_data.borderColor,
                  }}
               />
            )}

            {/* Title */}
            <div>
               <h2
                  className="mb-2 text-3xl font-bold"
                  style={{
                     color: template_data.primaryColor,
                     fontFamily: template_data.fontFamily,
                  }}
               >
                  {template_data.titleText}
               </h2>
               <div
                  className="mx-auto h-1 w-32"
                  style={{
                     backgroundColor: template_data.borderColor,
                  }}
               ></div>
            </div>

            {/* Description */}
            <p
               className="text-lg"
               style={{
                  color: template_data.secondaryColor,
                  fontFamily: template_data.fontFamily,
               }}
            >
               {template_data.descriptionText}
            </p>

            {/* Student Name */}
            <div className="relative py-4">
               <p
                  className="text-3xl font-bold"
                  style={{
                     color: template_data.primaryColor,
                     fontFamily: template_data.fontFamily,
                  }}
               >
                  {studentName}
               </p>
               <div
                  className="mx-auto mt-2 h-0.5 w-48"
                  style={{
                     backgroundColor: template_data.borderColor,
                  }}
               ></div>
            </div>

            {/* Completion Text */}
            <p
               className="text-lg"
               style={{
                  color: template_data.secondaryColor,
                  fontFamily: template_data.fontFamily,
               }}
            >
               {template_data.completionText}
            </p>

            {/* Course Name */}
            <p
               className="text-2xl font-semibold"
               style={{
                  color: template_data.primaryColor,
                  fontFamily: template_data.fontFamily,
               }}
            >
               {courseName}
            </p>

            {/* Completion Date */}
            <div className="flex items-center justify-center gap-2 pt-4">
               <Calendar
                  className="h-4 w-4"
                  style={{
                     color: template_data.secondaryColor,
                  }}
               />
               <p
                  className="text-sm"
                  style={{
                     color: template_data.secondaryColor,
                     fontFamily: template_data.fontFamily,
                  }}
               >
                  Completed on: {completionDate}
               </p>
            </div>

            {/* Footer */}
            <div
               className="mt-6 border-t pt-4"
               style={{
                  borderColor: template_data.borderColor,
               }}
            >
               <p
                  className="text-sm"
                  style={{
                     color: template_data.secondaryColor,
                     fontFamily: template_data.fontFamily,
                  }}
               >
                  {template_data.footerText}
               </p>
            </div>
         </div>
      </div>
   );
};

export default CertificatePreview;
