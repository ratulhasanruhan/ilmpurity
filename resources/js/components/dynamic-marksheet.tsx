import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import jsPDF from 'jspdf';
import { Calendar, ClipboardList, Download, FileImage, FileText } from 'lucide-react';
import { useRef, useState } from 'react';
import { toast } from 'sonner';

interface DynamicMarksheetProps {
   template: MarksheetTemplate;
   courseName: string;
   studentName: string;
   completionDate: string;
   studentMarks: StudentMarks;
}

const DynamicMarksheet = ({ template, courseName, studentName, completionDate, studentMarks }: DynamicMarksheetProps) => {
   const [downloadFormat, setDownloadFormat] = useState('png');
   const marksheetRef = useRef<HTMLDivElement>(null);
   const dimensions = { width: 700, height: 900 };

   const { template_data } = template;

   const handleDownloadMarksheet = async () => {
      if (!marksheetRef.current) return;

      if (downloadFormat === 'pdf') {
         await downloadAsPDF();
      } else {
         await downloadAsPNG();
      }
   };

   const loadImage = (src: string): Promise<HTMLImageElement> => {
      return new Promise((resolve, reject) => {
         const img = new Image();
         img.crossOrigin = 'anonymous';
         img.onload = () => resolve(img);
         img.onerror = reject;
         img.src = src;
      });
   };

   const downloadAsPNG = async () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      if (!ctx) return;

      canvas.width = dimensions.width;
      canvas.height = dimensions.height;

      // Load logo first if it exists
      let logoImage: HTMLImageElement | null = null;
      if (template.logo_path) {
         try {
            logoImage = await loadImage(template.logo_path);
         } catch (error) {
            console.error('Failed to load logo:', error);
         }
      }

      await drawMarksheet(ctx, dimensions, logoImage);

      canvas.toBlob((blob) => {
         if (!blob) return;

         const url = URL.createObjectURL(blob);
         const a = document.createElement('a');
         a.href = url;
         a.download = `${studentName}_${courseName}_Marksheet.png`;
         document.body.appendChild(a);
         a.click();
         document.body.removeChild(a);
         URL.revokeObjectURL(url);

         toast.success('Marksheet saved as PNG!');
      }, 'image/png');
   };

   const downloadAsPDF = async () => {
      const isLandscape = dimensions.width > dimensions.height;

      const pdf = new jsPDF({
         orientation: isLandscape ? 'landscape' : 'portrait',
         unit: 'px',
         format: [dimensions.width, dimensions.height],
      });

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      if (!ctx) return;

      canvas.width = dimensions.width;
      canvas.height = dimensions.height;

      // Load logo first if it exists
      let logoImage: HTMLImageElement | null = null;
      if (template.logo_path) {
         try {
            logoImage = await loadImage(template.logo_path);
         } catch (error) {
            console.error('Failed to load logo:', error);
         }
      }

      await drawMarksheet(ctx, dimensions, logoImage);

      const imgData = canvas.toDataURL('image/png');
      pdf.addImage(imgData, 'PNG', 0, 0, dimensions.width, dimensions.height);
      pdf.save(`${studentName}_${courseName}_Marksheet.pdf`);

      toast.success('Marksheet saved as PDF!');
   };

   const drawMarksheet = async (
      ctx: CanvasRenderingContext2D,
      dimensions: { width: number; height: number },
      logoImage: HTMLImageElement | null = null,
   ) => {
      // Background
      ctx.fillStyle = template_data.backgroundColor;
      ctx.fillRect(0, 0, dimensions.width, dimensions.height);

      // Outer border
      ctx.strokeStyle = template_data.borderColor;
      ctx.lineWidth = 6;
      ctx.strokeRect(15, 15, dimensions.width - 30, dimensions.height - 30);

      const leftMargin = 80;
      const rightMargin = dimensions.width - 80;
      const middleX = dimensions.width / 2;
      let currentY = 60;

      // Header Section - Horizontal Layout (Logo on left, text on right)
      const logoSize = 60;
      const logoX = leftMargin;
      const textStartX = leftMargin + logoSize + 20;

      if (logoImage) {
         ctx.drawImage(logoImage, logoX, currentY, logoSize, logoSize);
      }

      // Header text next to logo
      ctx.textAlign = 'left';
      ctx.font = `bold 28px ${template_data.fontFamily}`;
      ctx.fillStyle = template_data.primaryColor;
      ctx.fillText(template_data.headerText, textStartX, currentY + 25);

      // Institution Name
      ctx.font = `18px ${template_data.fontFamily}`;
      ctx.fillStyle = template_data.secondaryColor;
      ctx.fillText(template_data.institutionName, textStartX, currentY + 50);

      currentY += logoSize + 30;

      // Border below header
      ctx.strokeStyle = template_data.borderColor;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(leftMargin, currentY);
      ctx.lineTo(rightMargin, currentY);
      ctx.stroke();
      currentY += 40;

      // Student Info Section - 2 Column Grid Layout
      const col1X = leftMargin;
      const col2X = middleX + 20;
      const labelOffset = 25;
      const valueOffset = 50;

      // Column 1 - Student Name
      ctx.font = `16px ${template_data.fontFamily}`;
      ctx.fillStyle = template_data.secondaryColor;
      ctx.fillText('Student Name', col1X, currentY);

      ctx.font = `bold 20px ${template_data.fontFamily}`;
      ctx.fillStyle = template_data.primaryColor;
      ctx.fillText(studentName, col1X, currentY + labelOffset);

      // Column 2 - Course
      ctx.font = `16px ${template_data.fontFamily}`;
      ctx.fillStyle = template_data.secondaryColor;
      ctx.fillText('Course', col2X, currentY);

      ctx.font = `bold 20px ${template_data.fontFamily}`;
      ctx.fillStyle = template_data.primaryColor;
      // Wrap course name if too long
      const maxCourseWidth = rightMargin - col2X - 10;
      const courseMetrics = ctx.measureText(courseName);
      if (courseMetrics.width > maxCourseWidth) {
         const words = courseName.split(' ');
         let line = '';
         let lineY = currentY + labelOffset;
         for (let n = 0; n < words.length; n++) {
            const testLine = line + words[n] + ' ';
            const metrics = ctx.measureText(testLine);
            if (metrics.width > maxCourseWidth && n > 0) {
               ctx.fillText(line, col2X, lineY);
               line = words[n] + ' ';
               lineY += 25;
            } else {
               line = testLine;
            }
         }
         ctx.fillText(line, col2X, lineY);
      } else {
         ctx.fillText(courseName, col2X, currentY + labelOffset);
      }

      currentY += 92;

      // Column 1 - Completion Date
      ctx.font = `16px ${template_data.fontFamily}`;
      ctx.fillStyle = template_data.secondaryColor;
      ctx.fillText('Completion Date', col1X, currentY);

      ctx.font = `18px ${template_data.fontFamily}`;
      ctx.fillStyle = template_data.primaryColor;
      ctx.fillText(completionDate, col1X, currentY + labelOffset);

      // Column 2 - Overall Grade
      ctx.font = `16px ${template_data.fontFamily}`;
      ctx.fillStyle = template_data.secondaryColor;
      ctx.fillText('Overall Grade', col2X, currentY);

      ctx.font = `bold 20px ${template_data.fontFamily}`;
      ctx.fillStyle = template_data.primaryColor;
      ctx.fillText(`${studentMarks.overall.grade} (${studentMarks.overall.percentage}%)`, col2X, currentY + labelOffset);

      currentY += 80;

      // Exam Type Section
      ctx.textAlign = 'left';
      ctx.font = `bold 22px ${template_data.fontFamily}`;
      ctx.fillStyle = template_data.primaryColor;
      ctx.fillText('Exam Type', leftMargin, currentY);
      currentY += 35;

      // Table Header Background
      const tableWidth = rightMargin - leftMargin;
      ctx.fillStyle = `${template_data.primaryColor}30`;
      ctx.fillRect(leftMargin, currentY, tableWidth, 45);

      // Table Headers
      ctx.font = `bold 18px ${template_data.fontFamily}`;
      ctx.fillStyle = template_data.primaryColor;
      ctx.fillText('Exam Type', leftMargin + 15, currentY + 28);
      ctx.textAlign = 'right';
      ctx.fillText('Total Marks', rightMargin - 15, currentY + 28);

      // Table Border
      ctx.strokeStyle = template_data.borderColor;
      ctx.lineWidth = 2;
      ctx.strokeRect(leftMargin, currentY, tableWidth, 45);
      currentY += 45;

      // Assignment Row
      ctx.fillStyle = template_data.backgroundColor;
      ctx.fillRect(leftMargin, currentY, tableWidth, 45);

      ctx.textAlign = 'left';
      ctx.font = `18px ${template_data.fontFamily}`;
      ctx.fillStyle = template_data.secondaryColor;
      ctx.fillText('Assignment', leftMargin + 15, currentY + 28);

      ctx.textAlign = 'right';
      ctx.font = `bold 18px ${template_data.fontFamily}`;
      ctx.fillStyle = template_data.primaryColor;
      ctx.fillText(`${studentMarks.assignment.obtained}/${studentMarks.assignment.total}`, rightMargin - 15, currentY + 28);

      // Border
      ctx.strokeStyle = template_data.borderColor;
      ctx.lineWidth = 1;
      ctx.strokeRect(leftMargin, currentY, tableWidth, 45);
      currentY += 45;

      // Quiz Row
      ctx.fillStyle = template_data.backgroundColor;
      ctx.fillRect(leftMargin, currentY, tableWidth, 45);

      ctx.textAlign = 'left';
      ctx.font = `18px ${template_data.fontFamily}`;
      ctx.fillStyle = template_data.secondaryColor;
      ctx.fillText('Quiz', leftMargin + 15, currentY + 28);

      ctx.textAlign = 'right';
      ctx.font = `bold 18px ${template_data.fontFamily}`;
      ctx.fillStyle = template_data.primaryColor;
      ctx.fillText(`${studentMarks.quiz.obtained}/${studentMarks.quiz.total}`, rightMargin - 15, currentY + 28);

      // Border
      ctx.strokeStyle = template_data.borderColor;
      ctx.lineWidth = 1;
      ctx.strokeRect(leftMargin, currentY, tableWidth, 45);
      currentY += 70;

      // Footer
      ctx.strokeStyle = template_data.borderColor;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(leftMargin, currentY);
      ctx.lineTo(rightMargin, currentY);
      ctx.stroke();
      currentY += 30;

      ctx.textAlign = 'center';
      ctx.font = `16px ${template_data.fontFamily}`;
      ctx.fillStyle = template_data.secondaryColor;
      ctx.fillText(template_data.footerText, dimensions.width / 2, currentY);
   };

   return (
      <Card className="mx-auto max-w-[800px] space-y-7 p-6">
         <div
            ref={marksheetRef}
            className="relative rounded-lg border-4 p-8"
            style={{
               backgroundColor: template_data.backgroundColor,
               borderColor: template_data.borderColor,
               fontFamily: template_data.fontFamily,
            }}
         >
            <div className="space-y-6">
               {/* Header Section */}
               <div
                  className="mb-6 border-b-2 pb-4"
                  style={{
                     borderColor: template_data.borderColor,
                  }}
               >
                  <div className="flex items-center justify-between">
                     <div className="flex items-center gap-4">
                        {template.logo_path ? (
                           <div className="h-16 w-16">
                              <img src={template.logo_path} alt="Logo" className="h-full w-full object-contain" />
                           </div>
                        ) : (
                           <ClipboardList
                              className="h-12 w-12"
                              style={{
                                 color: template_data.primaryColor,
                              }}
                           />
                        )}
                        <div>
                           <h2
                              className="text-2xl font-bold"
                              style={{
                                 color: template_data.primaryColor,
                                 fontFamily: template_data.fontFamily,
                              }}
                           >
                              {template_data.headerText}
                           </h2>
                           <p
                              className="text-lg"
                              style={{
                                 color: template_data.secondaryColor,
                                 fontFamily: template_data.fontFamily,
                              }}
                           >
                              {template_data.institutionName}
                           </p>
                        </div>
                     </div>
                  </div>
               </div>

               {/* Student Info */}
               <div className="mb-6 grid grid-cols-2 gap-4">
                  <div>
                     <p
                        className="text-sm"
                        style={{
                           color: template_data.secondaryColor,
                        }}
                     >
                        Student Name
                     </p>
                     <p
                        className="text-lg font-semibold"
                        style={{
                           color: template_data.primaryColor,
                        }}
                     >
                        {studentName}
                     </p>
                  </div>
                  <div>
                     <p
                        className="text-sm"
                        style={{
                           color: template_data.secondaryColor,
                        }}
                     >
                        Course
                     </p>
                     <p
                        className="text-lg font-semibold"
                        style={{
                           color: template_data.primaryColor,
                        }}
                     >
                        {courseName}
                     </p>
                  </div>
                  <div>
                     <p
                        className="text-sm"
                        style={{
                           color: template_data.secondaryColor,
                        }}
                     >
                        Completion Date
                     </p>
                     <div className="flex items-center gap-2">
                        <Calendar
                           className="h-4 w-4"
                           style={{
                              color: template_data.secondaryColor,
                           }}
                        />
                        <p
                           className="font-medium"
                           style={{
                              color: template_data.primaryColor,
                           }}
                        >
                           {completionDate}
                        </p>
                     </div>
                  </div>
                  <div>
                     <p
                        className="text-sm"
                        style={{
                           color: template_data.secondaryColor,
                        }}
                     >
                        Overall Grade
                     </p>
                     <p
                        className="text-2xl font-bold"
                        style={{
                           color: template_data.primaryColor,
                        }}
                     >
                        {studentMarks.overall.grade} ({studentMarks.overall.percentage}%)
                     </p>
                  </div>
               </div>

               {/* Exam Type Section */}
               <div>
                  <h3
                     className="mb-3 text-lg font-semibold"
                     style={{
                        color: template_data.primaryColor,
                     }}
                  >
                     Exam Type
                  </h3>
                  <div
                     className="overflow-hidden rounded-lg border"
                     style={{
                        borderColor: template_data.borderColor,
                     }}
                  >
                     <table className="w-full">
                        <thead>
                           <tr
                              style={{
                                 backgroundColor: `${template_data.primaryColor}20`,
                              }}
                           >
                              <th
                                 className="border-b p-3 text-left font-semibold"
                                 style={{
                                    color: template_data.primaryColor,
                                    borderColor: template_data.borderColor,
                                 }}
                              >
                                 Exam Type
                              </th>
                              <th
                                 className="border-b p-3 text-right font-semibold"
                                 style={{
                                    color: template_data.primaryColor,
                                    borderColor: template_data.borderColor,
                                 }}
                              >
                                 Total Marks
                              </th>
                           </tr>
                        </thead>
                        <tbody>
                           <tr
                              className="border-b"
                              style={{
                                 borderColor: template_data.borderColor,
                              }}
                           >
                              <td
                                 className="p-3"
                                 style={{
                                    color: template_data.secondaryColor,
                                 }}
                              >
                                 Assignment
                              </td>
                              <td
                                 className="p-3 text-right font-medium"
                                 style={{
                                    color: template_data.primaryColor,
                                 }}
                              >
                                 {studentMarks.assignment.obtained}/{studentMarks.assignment.total}
                              </td>
                           </tr>
                           <tr>
                              <td
                                 className="p-3"
                                 style={{
                                    color: template_data.secondaryColor,
                                 }}
                              >
                                 Quiz
                              </td>
                              <td
                                 className="p-3 text-right font-medium"
                                 style={{
                                    color: template_data.primaryColor,
                                 }}
                              >
                                 {studentMarks.quiz.obtained}/{studentMarks.quiz.total}
                              </td>
                           </tr>
                        </tbody>
                     </table>
                  </div>
               </div>

               {/* Footer */}
               <div
                  className="mt-8 border-t-2 pt-4 text-center"
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

         <div className="space-y-4">
            <RadioGroup value={downloadFormat} onValueChange={setDownloadFormat} className="flex justify-center space-x-6">
               <div className="flex items-center space-x-2">
                  <RadioGroupItem className="cursor-pointer" value="png" id="marksheet-png" />
                  <Label htmlFor="marksheet-png" className="flex cursor-pointer items-center gap-2">
                     <FileImage className="h-4 w-4" />
                     PNG Image
                  </Label>
               </div>
               <div className="flex items-center space-x-2">
                  <RadioGroupItem className="cursor-pointer" value="pdf" id="marksheet-pdf" />
                  <Label htmlFor="marksheet-pdf" className="flex cursor-pointer items-center gap-2">
                     <FileText className="h-4 w-4" />
                     PDF Document
                  </Label>
               </div>
            </RadioGroup>

            <Button variant="outline" className="w-full" onClick={handleDownloadMarksheet}>
               <Download className="mr-2 h-4 w-4" />
               Download as {downloadFormat.toUpperCase()}
            </Button>
         </div>
      </Card>
   );
};

export default DynamicMarksheet;
