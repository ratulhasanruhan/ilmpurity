/**
 * Certificate Template Types
 */

interface CertificateTemplate extends TableCommon {
   type: 'course' | 'exam';
   name: string;
   logo_path: string | null;
   template_data: CertificateTemplateData;
   is_active: boolean;
}

interface CertificateTemplateData {
   primaryColor: string;
   secondaryColor: string;
   backgroundColor: string;
   borderColor: string;
   titleText: string;
   descriptionText: string;
   completionText: string;
   footerText: string;
   fontFamily: 'serif' | 'sans-serif' | 'monospace' | 'cursive';
}

interface MarksheetTemplate extends TableCommon {
   type: 'course' | 'exam';
   name: string;
   logo_path: string | null;
   template_data: MarksheetTemplateData;
   is_active: boolean;
}

interface MarksheetTemplateData {
   primaryColor: string;
   secondaryColor: string;
   backgroundColor: string;
   borderColor: string;
   headerText: string;
   institutionName: string;
   footerText: string;
   fontFamily: 'serif' | 'sans-serif' | 'monospace' | 'cursive';
}

interface CertificateBuilderPageProps {
   template?: CertificateTemplate;
}

interface MarksheetBuilderPageProps {
   template?: MarksheetTemplate;
}

interface StudentCertificateProps {
   courseId: number;
   certificateTemplate: CertificateTemplate;
   course?: {
      title: string;
   };
   student?: {
      name: string;
   };
   completionDate?: string;
}

interface StudentMarks {
   assignment: {
      total: number;
      obtained: number;
      percentage: number;
   };
   quiz: {
      total: number;
      obtained: number;
      percentage: number;
   };
   overall: {
      percentage: number;
      grade: string;
   };
}
