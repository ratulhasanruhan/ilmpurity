import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import jsPDF from 'jspdf';
import { Award, Calendar, Download, FileImage, FileText } from 'lucide-react';
import { useRef, useState } from 'react';
import { toast } from 'sonner';

const CertificateGenerator = () => {
   const [studentName, setStudentName] = useState('');
   const [courseName, setCourseName] = useState('');
   const [completionDate, setCompletionDate] = useState('');
   const [isGenerating, setIsGenerating] = useState(false);
   const [certificateSize, setCertificateSize] = useState('standard');
   const [downloadFormat, setDownloadFormat] = useState('png');
   const certificateRef = useRef<HTMLDivElement>(null);

   const handleGenerateCertificate = async () => {
      if (!studentName || !courseName || !completionDate) {
         toast.error('Please fill in all required fields.');
         return;
      }

      setIsGenerating(true);

      // Simulate certificate generation
      setTimeout(() => {
         setIsGenerating(false);
         toast.success('Your course completion certificate has been created successfully.');
      }, 2000);
   };

   const getSizeDimensions = () => {
      return certificateSize === 'a4'
         ? { width: 842, height: 595 } // A4 landscape
         : { width: 800, height: 600 }; // Standard
   };

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

      const dimensions = getSizeDimensions();
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

         toast.success('Your PNG certificate has been saved to your downloads folder.');
      }, 'image/png');
   };

   const downloadAsPDF = () => {
      const dimensions = getSizeDimensions();
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

      toast.success('Your PDF certificate has been saved to your downloads folder.');
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
      ctx.fillText('Certificate of Completion', dimensions.width / 2, 120);

      // Decorative line under title
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(dimensions.width / 2 - 150, 140);
      ctx.lineTo(dimensions.width / 2 + 150, 140);
      ctx.stroke();

      // "This is to certify that"
      ctx.font = '22px serif';
      ctx.fillStyle = '#4b5563';
      ctx.fillText('This is to certify that', dimensions.width / 2, 190);

      // Student name with underline
      ctx.font = 'bold 36px serif';
      ctx.fillStyle = '#3730a3';
      ctx.fillText(studentName, dimensions.width / 2, 250);

      // Underline for student name
      const nameWidth = ctx.measureText(studentName).width;
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo((dimensions.width - nameWidth) / 2 - 20, 270);
      ctx.lineTo((dimensions.width + nameWidth) / 2 + 20, 270);
      ctx.stroke();

      // "has successfully completed the course"
      ctx.font = '22px serif';
      ctx.fillStyle = '#4b5563';
      ctx.fillText('has successfully completed the course', dimensions.width / 2, 320);

      // Course name
      ctx.font = 'bold 28px serif';
      ctx.fillStyle = '#3730a3';
      ctx.fillText(courseName, dimensions.width / 2, 370);

      // Completion date
      ctx.font = '18px serif';
      ctx.fillStyle = '#6b7280';
      ctx.fillText(`Completed on: ${completionDate}`, dimensions.width / 2, 430);

      // Footer
      ctx.font = '16px serif';
      ctx.fillStyle = '#9ca3af';
      ctx.fillText('Authorized Certificate of Achievement', dimensions.width / 2, dimensions.height - 60);
   };

   const currentDate = new Date().toISOString().split('T')[0];

   return (
      <div className="space-y-8">
         <div className="text-center">
            <h1 className="mb-4 text-4xl font-bold text-gray-800">Course Certificate Generator</h1>
            <p className="text-muted-foreground text-lg">Generate your official course completion certificate</p>
         </div>

         <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            {/* Form Section */}
            <Card>
               <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                     <Award className="h-5 w-5 text-amber-600" />
                     Certificate Details
                  </CardTitle>
               </CardHeader>
               <CardContent className="space-y-6">
                  <div className="space-y-2">
                     <Label htmlFor="studentName">Student Name *</Label>
                     <Input
                        id="studentName"
                        value={studentName}
                        onChange={(e) => setStudentName(e.target.value)}
                        placeholder="Enter your full name"
                     />
                  </div>

                  <div className="space-y-2">
                     <Label htmlFor="courseName">Course Name *</Label>
                     <Input id="courseName" value={courseName} onChange={(e) => setCourseName(e.target.value)} placeholder="Enter the course name" />
                  </div>

                  <div className="space-y-2">
                     <Label htmlFor="completionDate">Completion Date *</Label>
                     <Input
                        id="completionDate"
                        type="date"
                        value={completionDate}
                        onChange={(e) => setCompletionDate(e.target.value)}
                        max={currentDate}
                     />
                  </div>

                  <div className="space-y-4">
                     <div className="space-y-2">
                        <Label>Certificate Size</Label>
                        <Select value={certificateSize} onValueChange={setCertificateSize}>
                           <SelectTrigger>
                              <SelectValue placeholder="Select certificate size" />
                           </SelectTrigger>
                           <SelectContent>
                              <SelectItem value="standard">Standard (800x600)</SelectItem>
                              <SelectItem value="a4">A4 Landscape (842x595)</SelectItem>
                           </SelectContent>
                        </Select>
                     </div>

                     <div className="space-y-3">
                        <Label>Download Format</Label>
                        <RadioGroup value={downloadFormat} onValueChange={setDownloadFormat} className="flex space-x-6">
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
                     </div>
                  </div>

                  <Button onClick={handleGenerateCertificate} disabled={isGenerating} className="w-full" size="lg">
                     {isGenerating ? (
                        <>
                           <div className="mr-2 h-4 w-4 animate-spin rounded-full border-b-2 border-white" />
                           Generating Certificate...
                        </>
                     ) : (
                        <>
                           <Award className="mr-2 h-4 w-4" />
                           Generate Certificate
                        </>
                     )}
                  </Button>
               </CardContent>
            </Card>

            {/* Preview Section */}
            <Card>
               <CardHeader>
                  <CardTitle>Certificate Preview</CardTitle>
               </CardHeader>
               <CardContent>
                  <div
                     ref={certificateRef}
                     className={`relative flex flex-col justify-center rounded-lg border-4 border-amber-400 bg-gradient-to-br from-blue-50 to-indigo-100 p-6 text-center`}
                  >
                     {/* Inner decorative border */}
                     <div className="absolute inset-4 rounded border-2 border-indigo-700"></div>

                     <div className="relative z-10">
                        <div className="mb-6">
                           <Award className="mx-auto mb-3 h-12 w-12 text-amber-600" />
                           <h2 className="mb-2 font-serif text-2xl font-bold text-gray-800">Certificate of Completion</h2>
                           <div className="mx-auto h-0.5 w-32 bg-amber-400"></div>
                        </div>

                        <div className="space-y-4 text-gray-700">
                           <p className="font-serif text-lg">This is to certify that</p>
                           <div className="relative">
                              <p className="mx-8 pb-2 font-serif text-2xl font-bold text-indigo-800">{studentName || 'Student Name'}</p>
                              <div className="absolute bottom-0 left-1/2 h-0.5 w-48 -translate-x-1/2 transform bg-amber-400"></div>
                           </div>
                           <p className="font-serif text-lg">has successfully completed the course</p>
                           <p className="font-serif text-xl font-semibold text-indigo-700">{courseName || 'Course Name'}</p>
                           <div className="mt-6 flex items-center justify-center gap-2">
                              <Calendar className="text-muted-foreground h-4 w-4" />
                              <p className="text-muted-foreground font-serif text-sm">Completed on: {completionDate || 'Date'}</p>
                           </div>
                        </div>

                        <div className="mt-6 border-t border-amber-400 pt-4">
                           <p className="font-serif text-sm text-gray-500">Authorized Certificate of Achievement</p>
                        </div>
                     </div>
                  </div>

                  {studentName && courseName && completionDate && (
                     <Button variant="outline" className="mt-4 w-full" onClick={handleDownloadCertificate}>
                        <Download className="mr-2 h-4 w-4" />
                        Download as {downloadFormat.toUpperCase()}
                     </Button>
                  )}
               </CardContent>
            </Card>
         </div>
      </div>
   );
};

export default CertificateGenerator;
