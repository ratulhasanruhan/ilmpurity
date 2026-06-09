# Certificate Module

A comprehensive certificate builder system for the Mentor LMS platform that allows admins to create, manage, and activate custom certificate templates for course completion.

## Features

- **Visual Certificate Builder**: Create custom certificate templates with live preview
- **Full Customization**: Customize colors, fonts, text, and logos
- **Template Management**: Create, edit, delete, and activate certificate templates
- **One Active Template**: Only one template can be active at a time for consistency
- **Student Downloads**: Students can download certificates in PNG or PDF format
- **Dynamic Data**: Certificates automatically populate with student name, course name, and completion date

## Architecture

### Backend (Laravel)

#### Database Schema

- **Table**: `certificate_templates`
   - `id` - Primary key
   - `name` - Template name for admin reference
   - `logo_path` - Path to uploaded logo (nullable)
   - `template_data` - JSON field containing all customization data
   - `is_active` - Boolean flag (only one can be true at a time)
   - `created_at`, `updated_at` - Timestamps

#### Models

- **CertificateTemplate** (`Modules/Certificate/app/Models/CertificateTemplate.php`)
   - Handles template CRUD operations
   - Automatically ensures only one template is active
   - Casts `template_data` to array for easy access

#### Controllers

- **CertificateTemplateController** (`Modules/Certificate/app/Http/Controllers/CertificateTemplateController.php`)
   - `index()` - List all templates for admin
   - `store()` - Create new template
   - `update()` - Update existing template
   - `activate()` - Set a template as active
   - `destroy()` - Delete template (including logo file)

- **CertificateController** (`Modules/Certificate/app/Http/Controllers/CertificateController.php`)
   - `show()` - Display certificate download page with active template

#### Routes

Admin routes (prefix: `/admin`):

- `GET /certificate-templates` - List all templates
- `POST /certificate-templates` - Create template
- `PUT /certificate-templates/{id}` - Update template
- `DELETE /certificate-templates/{id}` - Delete template
- `POST /certificate-templates/{id}/activate` - Activate template

Student routes:

- `GET /certificates/{courseId}` - View and download certificate

### Frontend (React + TypeScript)

#### Admin Pages

- **Certificate Index** (`resources/js/pages/dashboard/certificate/index.tsx`)
   - Dashboard view showing all certificate templates
   - Grid layout with template cards
   - Quick preview, edit, activate, and delete actions
   - Empty state with call-to-action

- **Certificate Builder Form** (`resources/js/pages/dashboard/certificate/partials/certificate-builder-form.tsx`)
   - Comprehensive form for creating/editing templates
   - Real-time preview while editing
   - Sections:
      - Basic Information (name, active status)
      - Logo & Branding (upload logo)
      - Colors (primary, secondary, background, border)
      - Typography (font family selection)
      - Certificate Text (title, description, completion text, footer)

- **Certificate Preview** (`resources/js/pages/dashboard/certificate/partials/certificate-preview.tsx`)
   - Reusable preview component
   - Shows how certificate will look with sample data
   - Used in both builder and preview modal

#### Student Components

- **Dynamic Certificate** (`resources/js/components/dynamic-certificate.tsx`)
   - Displays certificate using active template
   - Download options (PNG/PDF)
   - Canvas-based rendering for high-quality downloads
   - Automatically populates with student data

#### Types

- **Certificate Types** (`resources/js/types/certificate.d.ts`)
   - TypeScript interfaces for type safety
   - Includes CertificateTemplate, CertificateTemplateData, and page props

## Template Data Structure

The `template_data` JSON field contains:

```json
{
   "primaryColor": "#3730a3",
   "secondaryColor": "#4b5563",
   "backgroundColor": "#dbeafe",
   "borderColor": "#f59e0b",
   "titleText": "Certificate of Completion",
   "descriptionText": "This certificate is proudly presented to",
   "completionText": "for successfully completing the course",
   "footerText": "Authorized Certificate",
   "fontFamily": "serif"
}
```

## Installation & Setup

### 1. Run Migration

```bash
php artisan migrate
```

### 2. Ensure Storage Link

```bash
php artisan storage:link
```

### 3. File Permissions

Ensure the `storage/app/public/certificates/logos/` directory is writable.

### 4. Frontend Dependencies

All required packages should already be installed:

- `jspdf` - PDF generation
- `date-fns` - Date formatting
- Shadcn/UI components

## Usage

### Admin: Creating a Certificate Template

1. Navigate to **Admin Dashboard** → **Certificate Templates**
2. Click **"Create Template"**
3. Fill in the form:
   - **Template Name**: Give it a descriptive name
   - **Logo**: Upload your institution/course logo (optional)
   - **Colors**: Choose your brand colors using color pickers
   - **Typography**: Select font style (serif, sans-serif, etc.)
   - **Text Content**: Customize all certificate text
4. Preview updates in real-time on the right side
5. Toggle **"Set as Active Template"** to make it the active certificate
6. Click **"Create Template"** to save

### Admin: Managing Templates

- **View All**: See all templates in a grid layout
- **Preview**: Click on the mini-preview to see full-size preview
- **Edit**: Click "Edit" button to modify template
- **Activate**: Click "Activate" to set as the active template (deactivates others)
- **Delete**: Click trash icon to delete template

### Student: Downloading Certificate

1. Complete a course
2. Navigate to the course certificate page
3. Choose download format (PNG or PDF)
4. Click "Download" button
5. Certificate is generated with your name, course name, and completion date

## Customization Options

### Colors

- **Primary Color**: Main headings and student name
- **Secondary Color**: Body text and descriptions
- **Background Color**: Certificate background
- **Border Color**: Decorative borders and lines

### Typography

- **Serif**: Classic, formal look
- **Sans Serif**: Modern, clean look
- **Monospace**: Technical, code-style look
- **Cursive**: Elegant, handwritten style

### Text Fields

All text fields support custom content including:

- Title (default: "Certificate of Completion")
- Description (default: "This certificate is proudly presented to")
- Completion text (default: "for successfully completing the course")
- Footer (default: "Authorized Certificate")

## API Endpoints

### Admin Endpoints

**List Templates**

```
GET /admin/certificate-templates
Response: { templates: CertificateTemplate[] }
```

**Create Template**

```
POST /admin/certificate-templates
Body: {
  name: string,
  logo: File (optional),
  template_data: object,
  is_active: boolean
}
```

**Update Template**

```
PUT /admin/certificate-templates/{id}
Body: Same as create
```

**Activate Template**

```
POST /admin/certificate-templates/{id}/activate
```

**Delete Template**

```
DELETE /admin/certificate-templates/{id}
```

### Student Endpoints

**View Certificate**

```
GET /certificates/{courseId}
Response: { courseId, certificateTemplate, student, course, completionDate }
```

## Technical Notes

### Image Handling

- Logos are stored in `storage/app/public/certificates/logos/`
- Supported formats: JPEG, PNG, JPG, SVG
- Maximum file size: 2MB
- Files are automatically deleted when template is deleted

### Active Template Logic

- Only one template can be active at a time
- Activating a template automatically deactivates all others
- Handled in the model's `boot()` method using an event listener
- If no active template exists, default template data is used

### Canvas Rendering

- Certificates use HTML5 Canvas for download generation
- Ensures high-quality, resolution-independent output
- Supports both PNG and PDF formats
- Font rendering uses system fonts for consistency

## Future Enhancements

Potential features for future versions:

- Multiple layout templates (portrait, landscape, different designs)
- Signature field support
- QR code for certificate verification
- Email certificate directly to students
- Certificate expiration dates
- Multi-language support for certificate text
- Custom field placeholders (e.g., instructor name, course duration)
- Certificate analytics and download tracking

## Troubleshooting

### Logo not displaying

- Ensure `php artisan storage:link` has been run
- Check file permissions on storage directory
- Verify logo file was uploaded successfully

### Template not saving

- Check browser console for errors
- Verify CSRF token is valid
- Ensure all required fields are filled

### Download not working

- Check browser console for errors
- Ensure jsPDF is installed
- Try different download format (PNG vs PDF)

## Support

For issues or questions, please contact the development team or create an issue in the project repository.

## Structure

┌─────────────┐ ┌──────────────────┐ ┌─────────────┐
│ Admin │────────>│ Template CRUD │────────>│ Database │
│ Dashboard │ │ Controller │ │ (JSON) │
└─────────────┘ └──────────────────┘ └─────────────┘
│
v
┌─────────────┐ ┌──────────────────┐ ┌─────────────┐
│ Student │────────>│ Certificate │────────>│ Active │
│ Download │ │ Controller │ │ Template │
└─────────────┘ └──────────────────┘ └─────────────┘
