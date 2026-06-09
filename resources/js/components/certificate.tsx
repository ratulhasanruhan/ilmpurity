import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { SharedData } from '@/types/global';
import { usePage } from '@inertiajs/react';
import { format, parseISO } from 'date-fns';
import jsPDF from 'jspdf';
import { Award, Calendar, Download, FileImage, FileText } from 'lucide-react';
import { useRef, useState } from 'react';
import { toast } from 'sonner';

const Certificate = ({ course, watchHistory }: { course: Course; watchHistory: WatchHistory }) => {
   const { props } = usePage<SharedData>();
   const { translate, auth } = props;
   const { frontend } = translate;

   const courseName = course.title;
   const studentName = auth.user.name;
   const completionDate = format(parseISO(watchHistory.completion_date ?? new Date().toISOString()), 'MMM d, yyyy');
   const [downloadFormat, setDownloadFormat] = useState('png');
   const certificateRef = useRef<HTMLDivElement>(null);
   const dimensions = { width: 900, height: 600 }; // Standard

   const handleDownloadCertificate = () => {
      if (!certificateRef.current) return;

      if (downloadFormat === 'pdf') {
         downloadAsPDF();
      } else {
         downloadAsPNG();
      }
   };

   const downloadAsPNG = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      if (!ctx) return;

      canvas.width = dimensions.width;
      canvas.height = dimensions.height;

      drawCertificate(ctx, dimensions);

      canvas.toBlob((blob) => {
         if (!blob) return;

         const url = URL.createObjectURL(blob);
         const a = document.createElement('a');
         a.href = url;
         a.download = `${studentName}_${courseName}_Certificate.png`;
         document.body.appendChild(a);
         a.click();
         document.body.removeChild(a);
         URL.revokeObjectURL(url);

         toast.success(frontend.png_certificate_saved);
      }, 'image/png');
   };

   const downloadAsPDF = () => {
      const isLandscape = dimensions.width > dimensions.height;

      // Create PDF with proper dimensions
      const pdf = new jsPDF({
         orientation: isLandscape ? 'landscape' : 'portrait',
         unit: 'px',
         format: [dimensions.width, dimensions.height],
      });

      // Create canvas for drawing
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      if (!ctx) return;

      canvas.width = dimensions.width;
      canvas.height = dimensions.height;

      // Draw certificate on canvas
      drawCertificate(ctx, dimensions);

      // Convert canvas to image and add to PDF
      const imgData = canvas.toDataURL('image/png');
      pdf.addImage(imgData, 'PNG', 0, 0, dimensions.width, dimensions.height);

      // Save the PDF
      pdf.save(`${studentName}_${courseName}_Certificate.pdf`);

      toast.success(frontend.pdf_certificate_saved);
   };

   // Helper function to wrap text
   const wrapText = (ctx: CanvasRenderingContext2D, text: string, x: number, y: number, maxWidth: number, lineHeight: number) => {
      const words = text.split(' ');
      let line = '';
      let testLine = '';
      const lines = [];

      // Split text into lines
      for (let n = 0; n < words.length; n++) {
         testLine += `${words[n]} `;
         const metrics = ctx.measureText(testLine);
         const testWidth = metrics.width;

         if (testWidth > maxWidth && n > 0) {
            lines.push({ text: line.trim(), width: ctx.measureText(line).width });
            testLine = `${words[n]} `;
            line = `${words[n]} `;
         } else {
            line = testLine;
         }
      }
      lines.push({ text: line.trim(), width: ctx.measureText(line).width });

      // Draw text
      let currentY = y;
      lines.forEach((lineObj) => {
         ctx.fillText(lineObj.text, x, currentY);
         currentY += lineHeight;
      });

      return currentY;
   };

   const drawCertificate = (ctx: CanvasRenderingContext2D, dimensions: { width: number; height: number }) => {
      // Create gradient background
      const gradient = ctx.createLinearGradient(0, 0, dimensions.width, dimensions.height);
      gradient.addColorStop(0, '#dbeafe');
      gradient.addColorStop(1, '#e0e7ff');

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, dimensions.width, dimensions.height);

      // Add decorative border
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 8;
      ctx.strokeRect(20, 20, dimensions.width - 40, dimensions.height - 40);

      // Inner border
      ctx.strokeStyle = '#3730a3';
      ctx.lineWidth = 2;
      ctx.strokeRect(40, 40, dimensions.width - 80, dimensions.height - 80);

      // Set text styles
      ctx.fillStyle = '#1f2937';
      ctx.textAlign = 'center';

      // Title
      ctx.font = 'bold 42px serif';
      ctx.fillText(frontend.certificate_of_completion, dimensions.width / 2, 120);

      // Decorative line under title
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(dimensions.width / 2 - 150, 140);
      ctx.lineTo(dimensions.width / 2 + 150, 140);
      ctx.stroke();

      // Certificate description text with wrapping
      ctx.font = '22px serif';
      ctx.fillStyle = '#4b5563';
      ctx.textAlign = 'center';
      const descriptionText = frontend.certificate_description;
      const lineHeight = 30; // Adjust this value based on your font size
      const maxWidth = dimensions.width - 100; // 50px padding on each side

      // Draw wrapped text and get the Y position after the last line
      const lastY = wrapText(ctx, descriptionText, dimensions.width / 2, 190, maxWidth, lineHeight);

      // Student name with underline
      ctx.font = 'bold 36px serif';
      ctx.fillStyle = '#3730a3';
      ctx.fillText(studentName, dimensions.width / 2, 310);

      // Underline for student name
      const nameWidth = ctx.measureText(studentName).width;
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo((dimensions.width - nameWidth) / 2 - 20, 330);
      ctx.lineTo((dimensions.width + nameWidth) / 2 + 20, 330);
      ctx.stroke();

      // "has successfully completed the course"
      ctx.font = '22px serif';
      ctx.fillStyle = '#4b5563';
      ctx.fillText(frontend.has_successfully_completed, dimensions.width / 2, 380);

      // Course name
      ctx.font = 'bold 28px serif';
      ctx.fillStyle = '#3730a3';
      ctx.fillText(courseName, dimensions.width / 2, 430);

      // Completion date
      ctx.font = '18px serif';
      ctx.fillStyle = '#6b7280';
      ctx.fillText(frontend.completed_on.replace(':date', completionDate), dimensions.width / 2, 490);

      // Footer
      ctx.font = '16px serif';
      ctx.fillStyle = '#9ca3af';
      ctx.fillText(frontend.authorized_certificate, dimensions.width / 2, dimensions.height - 60);
   };

   return (
      <div className="mx-auto max-w-[800px] space-y-8">
         <div className="text-center">
            <h1 className="mb-4 text-4xl font-bold text-gray-800">{frontend.course_certificate_download}</h1>
            <p className="text-muted-foreground text-lg">{frontend.download_official_certificate}</p>
         </div>

         <Card className="space-y-7 p-6">
            <div
               ref={certificateRef}
               className={`relative flex flex-col justify-center rounded-lg border-4 border-amber-400 bg-gradient-to-br from-blue-50 to-indigo-100 p-6 text-center`}
            >
               {/* Inner decorative border */}
               <div className="absolute inset-4 rounded border-2 border-indigo-700"></div>

               <div className="relative z-10">
                  <div className="mb-6">
                     <Award className="mx-auto mb-3 h-12 w-12 text-amber-600" />
                     <h2 className="mb-2 font-serif text-2xl font-bold text-gray-800">{frontend.certificate_of_completion}</h2>
                     <div className="mx-auto h-0.5 w-32 bg-amber-400"></div>
                  </div>

                  <div className="space-y-4 text-gray-700">
                     <p className="font-serif text-lg">{frontend.certificate_description}</p>
                     <div className="relative">
                        <p className="mx-8 pb-2 font-serif text-2xl font-bold text-indigo-800">{studentName || 'Student Name'}</p>
                        <div className="absolute bottom-0 left-1/2 h-0.5 w-48 -translate-x-1/2 transform bg-amber-400"></div>
                     </div>
                     <p className="font-serif text-lg">{frontend.has_successfully_completed}</p>
                     <p className="font-serif text-xl font-semibold text-indigo-700">{courseName || 'Course Name'}</p>
                     <div className="mt-6 flex items-center justify-center gap-2">
                        <Calendar className="text-muted-foreground h-4 w-4" />
                        <p className="text-muted-foreground font-serif text-sm">{frontend.completed_on.replace(':date', completionDate || 'Date')}</p>
                     </div>
                  </div>

                  <div className="mt-6 border-t border-amber-400 pt-4">
                     <p className="font-serif text-sm text-gray-500">{frontend.authorized_certificate}</p>
                  </div>
               </div>
            </div>

            <div className="space-y-4">
               <RadioGroup value={downloadFormat} onValueChange={setDownloadFormat} className="flex justify-center space-x-6">
                  <div className="flex items-center space-x-2">
                     <RadioGroupItem className="cursor-pointer" value="png" id="png" />
                     <Label htmlFor="png" className="flex cursor-pointer items-center gap-2">
                        <FileImage className="h-4 w-4" />
                        PNG Image
                     </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                     <RadioGroupItem className="cursor-pointer" value="pdf" id="pdf" />
                     <Label htmlFor="pdf" className="flex cursor-pointer items-center gap-2">
                        <FileText className="h-4 w-4" />
                        PDF Document
                     </Label>
                  </div>
               </RadioGroup>

               <Button variant="outline" className="w-full" onClick={handleDownloadCertificate}>
                  <Download className="mr-2 h-4 w-4" />
                  Download as {downloadFormat.toUpperCase()}
               </Button>
            </div>
         </Card>
      </div>
   );
};

export default Certificate;
