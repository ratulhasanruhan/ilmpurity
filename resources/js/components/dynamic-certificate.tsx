import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import jsPDF from 'jspdf';
import { Award, Calendar, Download, FileImage, FileText } from 'lucide-react';
import { useRef, useState } from 'react';
import { toast } from 'sonner';

interface DynamicCertificateProps {
   template: CertificateTemplate;
   courseName: string;
   studentName: string;
   completionDate: string;
}

const DynamicCertificate = ({ template, courseName, studentName, completionDate }: DynamicCertificateProps) => {
   const [downloadFormat, setDownloadFormat] = useState('png');
   const certificateRef = useRef<HTMLDivElement>(null);
   const dimensions = { width: 900, height: 600 };

   const { template_data } = template;

   const handleDownloadCertificate = async () => {
      if (!certificateRef.current) return;

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

      await drawCertificate(ctx, dimensions, logoImage);

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

         toast.success('Certificate saved as PNG!');
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

      await drawCertificate(ctx, dimensions, logoImage);

      const imgData = canvas.toDataURL('image/png');
      pdf.addImage(imgData, 'PNG', 0, 0, dimensions.width, dimensions.height);
      pdf.save(`${studentName}_${courseName}_Certificate.pdf`);

      toast.success('Certificate saved as PDF!');
   };

   const wrapText = (ctx: CanvasRenderingContext2D, text: string, x: number, y: number, maxWidth: number, lineHeight: number) => {
      const words = text.split(' ');
      let line = '';
      let testLine = '';
      const lines = [];

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

      let currentY = y;
      lines.forEach((lineObj) => {
         ctx.fillText(lineObj.text, x, currentY);
         currentY += lineHeight;
      });

      return currentY;
   };

   const drawCertificate = async (
      ctx: CanvasRenderingContext2D,
      dimensions: { width: number; height: number },
      logoImage: HTMLImageElement | null = null,
   ) => {
      // Background
      ctx.fillStyle = template_data.backgroundColor;
      ctx.fillRect(0, 0, dimensions.width, dimensions.height);

      // Outer border
      ctx.strokeStyle = template_data.borderColor;
      ctx.lineWidth = 8;
      ctx.strokeRect(20, 20, dimensions.width - 40, dimensions.height - 40);

      // Inner border
      ctx.strokeStyle = template_data.primaryColor;
      ctx.lineWidth = 2;
      ctx.strokeRect(40, 40, dimensions.width - 80, dimensions.height - 80);

      // Set text align
      ctx.textAlign = 'center';

      let currentY = 100;

      // Draw logo if exists
      if (logoImage) {
         const logoSize = 80;
         const logoX = (dimensions.width - logoSize) / 2;
         const logoY = 60;
         ctx.drawImage(logoImage, logoX, logoY, logoSize, logoSize);
         currentY = logoY + logoSize + 30; // Position text below logo
      }

      // Title
      ctx.font = `bold 42px ${template_data.fontFamily}`;
      ctx.fillStyle = template_data.primaryColor;
      ctx.fillText(template_data.titleText, dimensions.width / 2, currentY);
      currentY += 20;

      // Decorative line under title
      ctx.strokeStyle = template_data.borderColor;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(dimensions.width / 2 - 150, currentY);
      ctx.lineTo(dimensions.width / 2 + 150, currentY);
      ctx.stroke();
      currentY += 50;

      // Description text
      ctx.font = `22px ${template_data.fontFamily}`;
      ctx.fillStyle = template_data.secondaryColor;
      currentY = wrapText(ctx, template_data.descriptionText, dimensions.width / 2, currentY, dimensions.width - 100, 30);
      currentY += 50;

      // Student name
      ctx.font = `bold 36px ${template_data.fontFamily}`;
      ctx.fillStyle = template_data.primaryColor;
      ctx.fillText(studentName, dimensions.width / 2, currentY);

      // Underline for student name
      const nameWidth = ctx.measureText(studentName).width;
      ctx.strokeStyle = template_data.borderColor;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo((dimensions.width - nameWidth) / 2 - 20, currentY + 10);
      ctx.lineTo((dimensions.width + nameWidth) / 2 + 20, currentY + 10);
      ctx.stroke();
      currentY += 60;

      // Completion text
      ctx.font = `22px ${template_data.fontFamily}`;
      ctx.fillStyle = template_data.secondaryColor;
      ctx.fillText(template_data.completionText, dimensions.width / 2, currentY);
      currentY += 50;

      // Course name
      ctx.font = `bold 28px ${template_data.fontFamily}`;
      ctx.fillStyle = template_data.primaryColor;
      ctx.fillText(courseName, dimensions.width / 2, currentY);
      currentY += 60;

      // Completion date
      ctx.font = `18px ${template_data.fontFamily}`;
      ctx.fillStyle = template_data.secondaryColor;
      ctx.fillText(`Completed on: ${completionDate}`, dimensions.width / 2, currentY);
      currentY += 60;

      // Footer
      ctx.font = `16px ${template_data.fontFamily}`;
      ctx.fillStyle = template_data.secondaryColor;
      ctx.fillText(template_data.footerText, dimensions.width / 2, dimensions.height - 60);
   };

   return (
      <Card className="mx-auto max-w-[800px] space-y-7 p-6">
         <div
            ref={certificateRef}
            className="relative flex flex-col justify-center rounded-lg border-4 p-8 text-center"
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

            <div className="relative z-10">
               {/* Logo or Award Icon */}
               {template.logo_path ? (
                  <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center">
                     <img src={template.logo_path} alt="Logo" className="h-full w-full object-contain" />
                  </div>
               ) : (
                  <Award
                     className="mx-auto mb-3 h-12 w-12"
                     style={{
                        color: template_data.borderColor,
                     }}
                  />
               )}

               {/* Title */}
               <div className="mb-6">
                  <h2
                     className="mb-2 font-serif text-2xl font-bold"
                     style={{
                        color: template_data.primaryColor,
                     }}
                  >
                     {template_data.titleText}
                  </h2>
                  <div
                     className="mx-auto h-0.5 w-32"
                     style={{
                        backgroundColor: template_data.borderColor,
                     }}
                  ></div>
               </div>

               {/* Description */}
               <div className="space-y-4">
                  <p
                     className="font-serif text-lg"
                     style={{
                        color: template_data.secondaryColor,
                     }}
                  >
                     {template_data.descriptionText}
                  </p>

                  {/* Student Name */}
                  <div className="relative">
                     <p
                        className="mx-8 pb-2 font-serif text-2xl font-bold"
                        style={{
                           color: template_data.primaryColor,
                        }}
                     >
                        {studentName}
                     </p>
                     <div
                        className="absolute bottom-0 left-1/2 h-0.5 w-48 -translate-x-1/2 transform"
                        style={{
                           backgroundColor: template_data.borderColor,
                        }}
                     ></div>
                  </div>

                  {/* Completion Text */}
                  <p
                     className="font-serif text-lg"
                     style={{
                        color: template_data.secondaryColor,
                     }}
                  >
                     {template_data.completionText}
                  </p>

                  {/* Course Name */}
                  <p
                     className="font-serif text-xl font-semibold"
                     style={{
                        color: template_data.primaryColor,
                     }}
                  >
                     {courseName}
                  </p>

                  {/* Completion Date */}
                  <div className="mt-6 flex items-center justify-center gap-2">
                     <Calendar
                        className="h-4 w-4"
                        style={{
                           color: template_data.secondaryColor,
                        }}
                     />
                     <p
                        className="text-muted-foreground font-serif text-sm"
                        style={{
                           color: template_data.secondaryColor,
                        }}
                     >
                        Completed on: {completionDate}
                     </p>
                  </div>
               </div>

               {/* Footer */}
               <div
                  className="mt-6 border-t pt-4"
                  style={{
                     borderColor: template_data.borderColor,
                  }}
               >
                  <p
                     className="font-serif text-sm"
                     style={{
                        color: template_data.secondaryColor,
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
   );
};

export default DynamicCertificate;
