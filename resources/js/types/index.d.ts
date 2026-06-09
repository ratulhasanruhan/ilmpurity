// Ensure this file is treated as a module
interface Auth {
   user: User;
}

interface BreadcrumbItem {
   title: string;
   href: string;
}

// User related types
interface User extends TableCommon {
   name: string;
   email: string;
   status: number | null;
   social_links: { host: string; profile_link: string }[] | null;
   role: string;
   about: string | null;
   photo: string | null;
   email_verified_at: string | null;
   password: string;
   instructor_id: number | null;
   remember_token?: string;
}

// Instructor related types
interface Instructor extends TableCommon {
   skills: string; // Stored as JSON string
   designation: string;
   biography: string;
   resume: string; // File path
   user_id: number;
   user: User; // Relationship to User model
   status: 'pending' | 'approved' | 'rejected';
   payout_methods: Settings[];
   courses: Course[];
   courses_count: number;
   total_reviews_count: number;
   total_average_rating: number;
   total_enrollments_count: number;

   // Exam related fields
   exams: Exam[];
   exams_count: number;
   total_exam_reviews_count: number;
   total_exam_average_rating: number;
   total_exam_instructors_count: number;
}

interface Notification extends TableCommon {
   type: string;
   read_at: string | null;
   data: { title: string; body: string; url?: string };
   notifiable_id: number;
   notifiable_type: string;
}

interface Newsletter extends TableCommon {
   subject: string;
   description: string;
}

interface Payout extends TableCommon {
   amount: number;
   status: string;
   payout_method: string;
   transaction_id: string;
   session_id: string;
   user_id: number;
   user: User;
}

interface Page extends TableCommon {
   name: string;
   slug: string;
   type: string;
   title: string;
   description: string;
   meta_description: string;
   meta_keywords: string;
   active: boolean;
   sort: number;
   sections: PageSection[];
}

interface PageSection extends TableCommon {
   name: string;
   slug: string;
   title?: string;
   sub_title?: string;
   description?: string;
   thumbnail?: string;
   video_url?: string;
   background_image?: string;
   background_color?: string;
   flags: { [key: string]: boolean };
   properties: {
      array: any[];
      contents: any[];
      [key: string]: any;
   };
   active: boolean;
   sort: number;
   page_id: number;
   page?: Page;
}

interface PageSectionFormValues {
   name: string;
   title: string;
   description: string | null;
   thumbnail: string | null;
   properties: Record<string, any>;
   active: boolean;
   sort: number;
}

interface PropertyField {
   type: 'text' | 'icon' | 'textarea' | 'file' | 'image' | 'url' | 'array' | 'object' | 'boolean' | 'number' | 'select' | 'contents';
   label: string;
   name: string;
   value: any;
   options?: { label: string; value: any }[];
   fields?: PropertyField[]; // For nested fields in array or object types
   isArray?: boolean;
}

interface PropertyFields {
   contents: number[];
   array: {
      url: string;
      text: string;
      image: string;
      label: string;
      value: string;
      tittle: string;
      [key: string]: any;
   }[];
   [key: string]: any;
}
