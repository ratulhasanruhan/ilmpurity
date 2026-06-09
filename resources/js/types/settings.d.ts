type Appearance = 'light' | 'dark' | 'system';

interface Settings<T> extends TableCommon {
   type: string;
   sub_type: string;
   title: string;
   fields: T;
}

interface PaymentFields {
   active: boolean;
   currency: string;
   test_mode: boolean;
}

interface SystemFields {
   name: string;
   title: string;
   keywords: string;
   description: string;
   logo_dark: string;
   logo_light: string;
   favicon: string | null;
   banner: string | null;
   author: string;
   slogan: string;
   email: string;
   address: string;
   phone: string;
   selling_tax: number;
   selling_currency: string;
   instructor_revenue: number;
   footer_text: string;
   footer_link: string;
   global_style: string;
   direction: string;
   language_selector: boolean;
   theme: Appearance;
}

interface GoogleAuthFields {
   active: boolean;
   client_id: string;
   client_secret: string;
   redirect: string;
}

interface RecaptchaAuthFields {
   active: boolean;
   site_key: string;
   secret_key: string;
}

interface SmtpFields {
   mail_mailer: string;
   mail_host: string;
   mail_port: string;
   mail_encryption: string;
   mail_username: string;
   mail_password: string;
   mail_from_address: string;
   mail_from_name: string;
}

interface StorageFields {
   storage_driver: 'local' | 's3';
   aws_access_key_id: string;
   aws_secret_access_key: string;
   aws_default_region: string;
   aws_bucket: string;
   aws_use_path_style_endpoint: boolean;
}

// Start Payment Gateway Fields
interface MollieFields extends PaymentFields {
   test_api_key: string;
   live_api_key: string;
}

interface PaypalFields extends PaymentFields {
   sandbox_client_id: string;
   sandbox_secret_key: string;
   production_client_id: string;
   production_secret_key: string;
}

interface PaystackFields extends PaymentFields {
   test_public_key: string;
   test_secret_key: string;
   live_public_key: string;
   live_secret_key: string;
}

interface RazorpayFields extends PaymentFields {
   api_key: string;
   api_secret: string;
}

interface SSLCommerzFields extends PaymentFields {
   store_id: string;
   store_password: string;
}

interface StripeFields extends PaymentFields {
   webhook_secret: string;
   live_public_key: string;
   live_secret_key: string;
   test_public_key: string;
   test_secret_key: string;
}
// End Payment Gateway Fields

interface PageFields {
   page_id: number;
   page_name: string;
   page_slug: string;
}

interface ZoomConfigFields {
   zoom_account_email: string;
   zoom_account_id: string;
   zoom_client_id: string;
   zoom_client_secret: string;
   zoom_web_sdk: boolean;
   zoom_sdk_client_id: string;
   zoom_sdk_client_secret: string;
}

interface ApplicationBackup extends TableCommon {
   backup_name: string;
   source_code_zip: string;
   database_zip: string;
   source_code_size: number;
   database_size: number;
   status: string;
   notes: string | null;
}

interface Navbar extends TableCommon {
   title: string;
   slug: string;
   active: boolean;
   navbar_items: NavbarItem[];
}

interface NavbarItem extends TableCommon {
   sort: number;
   type: string;
   slug: string;
   title: string;
   active: boolean;
   value: string | null;
   items: NavbarItem[] | null;
   navbar_id: number;
}

interface Footer extends TableCommon {
   title: string;
   slug: string;
   active: boolean;
   footer_items: FooterItem[];
}

interface FooterItem extends TableCommon {
   sort: number;
   type: string;
   slug: string;
   title: string;
   active: boolean;
   items: any[] | null;
   footer_id: number;
}

interface JobCircular extends TableCommon {
   title: string;
   slug: string;
   description: string;
   experience_level: 'entry' | 'mid' | 'senior' | 'executive';
   location: string;
   salary_min?: number;
   salary_max?: number;
   salary_currency: string;
   salary_negotiable: boolean;
   application_deadline: string;
   contact_email: string;
   skills_required: string[];
   positions_available: number;
   job_type: 'full-time' | 'part-time' | 'contract' | 'internship' | 'freelance';
   work_type: 'on-site' | 'remote' | 'hybrid';
   status: 'draft' | 'active' | 'closed';
   formatted_salary: string;
   time_until_deadline: string;
   is_expired: boolean;
   is_published: boolean;
}
