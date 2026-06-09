import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from '@inertiajs/react';
import { Save } from 'lucide-react';
import { useState } from 'react';
import CertificatePreview from './certificate-preview';

const CertificateBuilderForm = ({ template }: { template?: CertificateTemplate | null }) => {
   const [logoPreview, setLogoPreview] = useState(template?.logo_path);

   const { data, setData, post, processing, errors } = useForm({
      type: template?.type || 'course',
      name: template?.name || 'My Certificate Template',
      logo: null as File | null,
      template_data: template?.template_data || {
         primaryColor: '#3730a3',
         secondaryColor: '#4b5563',
         backgroundColor: '#dbeafe',
         borderColor: '#f59e0b',
         titleText: 'Certificate of Completion',
         descriptionText: 'This certificate is proudly presented to',
         completionText: 'for successfully completing the course',
         footerText: 'Authorized Certificate',
         fontFamily: 'serif',
      },
   });

   const onLogoChange = (name: string, value: unknown) => {
      setData(name as any, value as any);
      setLogoPreview(URL.createObjectURL(value as File));
   };

   const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();

      if (template) {
         // Update existing template
         post(route('certificate.templates.update', template.id));
      } else {
         // Create new template
         post(route('certificate.templates.store'));
      }
   };

   return (
      <div className="grid gap-6 lg:grid-cols-2">
         {/* Form Section */}
         <div className="space-y-6">
            <Card>
               <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                  <CardDescription>Set the template name and activation status</CardDescription>
               </CardHeader>
               <CardContent className="space-y-4">
                  <div className="space-y-2">
                     <Label htmlFor="type">Template Type</Label>
                     <Select value={data.type} onValueChange={(value) => setData('type', value as any)}>
                        <SelectTrigger>
                           <SelectValue placeholder="Select template type" />
                        </SelectTrigger>
                        <SelectContent>
                           <SelectItem value="course">Course</SelectItem>
                           <SelectItem value="exam">Exam</SelectItem>
                        </SelectContent>
                     </Select>
                     {errors.type && <p className="text-sm text-red-500">{errors.type}</p>}
                  </div>

                  <div className="space-y-2">
                     <Label htmlFor="name">Template Name</Label>
                     <Input
                        id="name"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        placeholder="e.g., Modern Blue Certificate"
                     />
                     {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                  </div>
               </CardContent>
            </Card>

            <Card>
               <CardHeader>
                  <CardTitle>Logo & Branding</CardTitle>
                  <CardDescription>Upload your institution or course logo</CardDescription>
               </CardHeader>
               <CardContent className="space-y-4">
                  <div className="space-y-2">
                     <Label htmlFor="logo">Logo Image</Label>
                     <div className="space-y-2">
                        {logoPreview && (
                           <div className="h-20 w-20 overflow-hidden rounded border">
                              <img src={logoPreview} alt="Logo preview" className="h-full w-full object-contain" />
                           </div>
                        )}
                        <div className="flex-1">
                           <Input id="logo" type="file" accept="image/*" onChange={(e) => onLogoChange('logo', e.target.files?.[0])} />
                        </div>
                     </div>
                     <p className="text-muted-foreground text-xs">Recommended: PNG or SVG, max 1MB</p>
                     <InputError message={errors.logo} />
                  </div>
               </CardContent>
            </Card>

            <Card>
               <CardHeader>
                  <CardTitle>Colors</CardTitle>
                  <CardDescription>Customize the certificate color scheme</CardDescription>
               </CardHeader>
               <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                     <div className="space-y-2">
                        <Label htmlFor="primaryColor">Primary Color</Label>
                        <div className="flex gap-2">
                           <Input
                              id="primaryColor"
                              type="color"
                              value={data.template_data.primaryColor}
                              onChange={(e) => setData('template_data', { ...data.template_data, primaryColor: e.target.value })}
                              className="h-10 w-16"
                           />
                           <Input
                              value={data.template_data.primaryColor}
                              onChange={(e) => setData('template_data', { ...data.template_data, primaryColor: e.target.value })}
                              placeholder="#3730a3"
                           />
                        </div>
                     </div>

                     <div className="space-y-2">
                        <Label htmlFor="secondaryColor">Secondary Color</Label>
                        <div className="flex gap-2">
                           <Input
                              id="secondaryColor"
                              type="color"
                              value={data.template_data.secondaryColor}
                              onChange={(e) => setData('template_data', { ...data.template_data, secondaryColor: e.target.value })}
                              className="h-10 w-16"
                           />
                           <Input
                              value={data.template_data.secondaryColor}
                              onChange={(e) => setData('template_data', { ...data.template_data, secondaryColor: e.target.value })}
                              placeholder="#4b5563"
                           />
                        </div>
                     </div>

                     <div className="space-y-2">
                        <Label htmlFor="backgroundColor">Background Color</Label>
                        <div className="flex gap-2">
                           <Input
                              id="backgroundColor"
                              type="color"
                              value={data.template_data.backgroundColor}
                              onChange={(e) => setData('template_data', { ...data.template_data, backgroundColor: e.target.value })}
                              className="h-10 w-16"
                           />
                           <Input
                              value={data.template_data.backgroundColor}
                              onChange={(e) => setData('template_data', { ...data.template_data, backgroundColor: e.target.value })}
                              placeholder="#dbeafe"
                           />
                        </div>
                     </div>

                     <div className="space-y-2">
                        <Label htmlFor="borderColor">Border Color</Label>
                        <div className="flex gap-2">
                           <Input
                              id="borderColor"
                              type="color"
                              value={data.template_data.borderColor}
                              onChange={(e) => setData('template_data', { ...data.template_data, borderColor: e.target.value })}
                              className="h-10 w-16"
                           />
                           <Input
                              value={data.template_data.borderColor}
                              onChange={(e) => setData('template_data', { ...data.template_data, borderColor: e.target.value })}
                              placeholder="#f59e0b"
                           />
                        </div>
                     </div>
                  </div>
               </CardContent>
            </Card>

            <Card>
               <CardHeader>
                  <CardTitle>Typography</CardTitle>
                  <CardDescription>Choose the font style for your certificate</CardDescription>
               </CardHeader>
               <CardContent>
                  <div className="space-y-2">
                     <Label htmlFor="fontFamily">Font Family</Label>
                     <Select
                        value={data.template_data.fontFamily}
                        onValueChange={(value) => setData('template_data', { ...data.template_data, fontFamily: value })}
                     >
                        <SelectTrigger>
                           <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                           <SelectItem value="serif">Serif (Classic)</SelectItem>
                           <SelectItem value="sans-serif">Sans Serif (Modern)</SelectItem>
                           <SelectItem value="monospace">Monospace (Technical)</SelectItem>
                           <SelectItem value="cursive">Cursive (Elegant)</SelectItem>
                        </SelectContent>
                     </Select>
                  </div>
               </CardContent>
            </Card>

            <Card>
               <CardHeader>
                  <CardTitle>Certificate Text</CardTitle>
                  <CardDescription>Customize the text content of your certificate</CardDescription>
               </CardHeader>
               <CardContent className="space-y-4">
                  <div className="space-y-2">
                     <Label htmlFor="titleText">Title Text</Label>
                     <Input
                        id="titleText"
                        value={data.template_data.titleText}
                        onChange={(e) => setData('template_data', { ...data.template_data, titleText: e.target.value })}
                        placeholder="Certificate of Completion"
                     />
                  </div>

                  <div className="space-y-2">
                     <Label htmlFor="descriptionText">Description Text</Label>
                     <Textarea
                        id="descriptionText"
                        value={data.template_data.descriptionText}
                        onChange={(e) => setData('template_data', { ...data.template_data, descriptionText: e.target.value })}
                        placeholder="This certificate is proudly presented to"
                        rows={3}
                     />
                  </div>

                  <div className="space-y-2">
                     <Label htmlFor="completionText">Completion Text</Label>
                     <Input
                        id="completionText"
                        value={data.template_data.completionText}
                        onChange={(e) => setData('template_data', { ...data.template_data, completionText: e.target.value })}
                        placeholder="for successfully completing the course"
                     />
                  </div>

                  <div className="space-y-2">
                     <Label htmlFor="footerText">Footer Text</Label>
                     <Input
                        id="footerText"
                        value={data.template_data.footerText}
                        onChange={(e) => setData('template_data', { ...data.template_data, footerText: e.target.value })}
                        placeholder="Authorized Certificate"
                     />
                  </div>
               </CardContent>
            </Card>

            <Button onClick={handleSubmit} disabled={processing} className="w-full">
               <Save className="mr-2 h-4 w-4" />
               {processing ? 'Saving...' : template ? 'Update Template' : 'Create Template'}
            </Button>
         </div>

         {/* Preview Section */}
         <div className="lg:sticky lg:top-6">
            <Card>
               <CardHeader>
                  <CardTitle>Live Preview</CardTitle>
                  <CardDescription>See how your certificate will look</CardDescription>
               </CardHeader>
               <CardContent>
                  <CertificatePreview
                     template={data}
                     studentName="John Doe"
                     courseName="Sample Course Name"
                     completionDate="January 1, 2025"
                     logoUrl={logoPreview}
                  />
               </CardContent>
            </Card>
         </div>
      </div>
   );
};

export default CertificateBuilderForm;
