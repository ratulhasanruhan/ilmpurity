# Certificate Module - Quick Setup Guide

## 🚀 Quick Start

Follow these steps to get the Certificate Builder up and running:

### Step 1: Run Migration

```bash
cd /home/jamir-hossain/Works/laravel/mentor-lms
php artisan migrate
```

This will create the `certificate_templates` table with the following structure:

- `id` (primary key)
- `name` (template name)
- `logo_path` (nullable, stores logo file path)
- `template_data` (JSON, stores all customization)
- `is_active` (boolean, only one can be true)
- `created_at`, `updated_at`

### Step 2: Ensure Storage Link Exists

```bash
php artisan storage:link
```

This creates a symbolic link from `public/storage` to `storage/app/public` so logos are accessible.

### Step 3: Set Permissions (if needed)

```bash
chmod -R 775 storage/app/public
```

### Step 4: Clear Cache (optional but recommended)

```bash
php artisan route:clear
php artisan config:clear
php artisan cache:clear
```

### Step 5: Access the Certificate Builder

**Admin Side:**

- Navigate to: `/admin/certificate-templates`
- This will render the certificate builder UI

**Student Side:**

- Navigate to: `/certificates/{courseId}`
- Students will see their certificate with the active template

## 📝 Testing the System

### Create Your First Template

1. Go to `/admin/certificate-templates`
2. Click "Create Template"
3. Fill in basic info:
   - Name: "Modern Blue Certificate"
   - Toggle "Set as Active"
4. Choose colors:
   - Primary: `#3730a3` (Indigo)
   - Secondary: `#4b5563` (Gray)
   - Background: `#dbeafe` (Light Blue)
   - Border: `#f59e0b` (Amber)
5. Upload a logo (optional)
6. Customize text or use defaults
7. Click "Create Template"

### Test Student Certificate

1. Go to `/certificates/1` (or any course ID)
2. You should see the certificate with your active template
3. Try downloading as PNG and PDF

## 🔧 Integration with Your LMS

To integrate this with your existing course completion flow:

### Option 1: Add Certificate Link to Course Completion Page

In your course completion component/page, add a link:

```tsx
import { Link } from '@inertiajs/react';

// In your completion page
<Link href={route('certificate.show', course.id)}>
   <Button>
      <Award className="mr-2 h-4 w-4" />
      Download Certificate
   </Button>
</Link>;
```

### Option 2: Use the Dynamic Certificate Component Directly

```tsx
import DynamicCertificate from '@/components/dynamic-certificate';

// In your page
<DynamicCertificate template={activeTemplate} studentName={auth.user.name} courseName={course.title} completionDate={completionDate} />;
```

### Option 3: Pass Active Template from Backend

In your controller where students complete courses:

```php
use Modules\Certificate\Models\CertificateTemplate;

$activeTemplate = CertificateTemplate::where('is_active', true)->first();

return Inertia::render('YourPage', [
    'activeTemplate' => $activeTemplate,
    // ... other props
]);
```

## 🎨 Customization Tips

### Default Template

If no templates exist or none are active, the system uses default blue/gold colors automatically.

### Logo Recommendations

- **Format**: PNG or SVG preferred
- **Size**: 200x200px to 400x400px
- **Background**: Transparent PNG works best
- **Max File Size**: 2MB

### Color Schemes

**Professional Blue** (default)

```
Primary: #3730a3 (Indigo)
Secondary: #4b5563 (Gray)
Background: #dbeafe (Light Blue)
Border: #f59e0b (Amber)
```

**Elegant Green**

```
Primary: #047857 (Emerald)
Secondary: #1f2937 (Dark Gray)
Background: #d1fae5 (Light Green)
Border: #fbbf24 (Yellow)
```

**Corporate Red**

```
Primary: #991b1b (Dark Red)
Secondary: #374151 (Gray)
Background: #fee2e2 (Light Red)
Border: #92400e (Brown)
```

## 🔍 Troubleshooting

### Issue: "Class CertificateTemplate not found"

**Solution**: Make sure the module is properly registered and run:

```bash
composer dump-autoload
php artisan config:clear
```

### Issue: Logo not showing

**Solution**:

1. Check storage link: `php artisan storage:link`
2. Verify permissions: `chmod -R 775 storage/app/public`
3. Check file was uploaded to `storage/app/public/certificates/logos/`

### Issue: Routes not found

**Solution**:

1. Ensure module routes are loaded in `config/modules.php` or `bootstrap/app.php`
2. Run: `php artisan route:clear`
3. Check routes: `php artisan route:list | grep certificate`

### Issue: Template not activating

**Solution**: Check database - only one template should have `is_active = 1`. The model automatically handles this, but if you manually edited the database, fix it:

```sql
UPDATE certificate_templates SET is_active = 0;
UPDATE certificate_templates SET is_active = 1 WHERE id = [your_template_id];
```

## 📊 Database Seeder (Optional)

Create a default template for testing:

```php
// database/seeders/CertificateTemplateSeeder.php
<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Modules\Certificate\Models\CertificateTemplate;

class CertificateTemplateSeeder extends Seeder
{
    public function run()
    {
        CertificateTemplate::create([
            'name' => 'Default Blue Certificate',
            'logo_path' => null,
            'template_data' => [
                'primaryColor' => '#3730a3',
                'secondaryColor' => '#4b5563',
                'backgroundColor' => '#dbeafe',
                'borderColor' => '#f59e0b',
                'titleText' => 'Certificate of Completion',
                'descriptionText' => 'This certificate is proudly presented to',
                'completionText' => 'for successfully completing the course',
                'footerText' => 'Authorized Certificate',
                'fontFamily' => 'serif',
            ],
            'is_active' => true,
        ]);
    }
}
```

Run with:

```bash
php artisan db:seed --class=CertificateTemplateSeeder
```

## ✅ Checklist

- [ ] Run migration
- [ ] Create storage link
- [ ] Set proper permissions
- [ ] Clear caches
- [ ] Access `/admin/certificate-templates`
- [ ] Create your first template
- [ ] Set template as active
- [ ] Test student certificate download
- [ ] Integrate with course completion flow

## 🎉 You're Ready!

Your certificate builder is now fully functional. Start creating beautiful certificates for your students!

For detailed documentation, see [README.md](./README.md).
