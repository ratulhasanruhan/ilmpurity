<?php

namespace Modules\Certificate\Database\Seeders;

use Illuminate\Database\Seeder;
use Modules\Certificate\Models\CertificateTemplate;

class CertificateTemplateSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Template 1: Professional Blue (Modern Corporate)
        CertificateTemplate::firstOrCreate(
            ['name' => 'Professional Blue'],
            [
                'type' => 'course',
                'logo_path' => null,
                'template_data' => [
                    'primaryColor' => '#1e40af',
                    'secondaryColor' => '#475569',
                    'backgroundColor' => '#eff6ff',
                    'borderColor' => '#2563eb',
                    'titleText' => 'Certificate of Achievement',
                    'descriptionText' => 'This certificate is proudly presented to',
                    'completionText' => 'for successfully completing the course',
                    'footerText' => 'Authorized and Certified',
                    'fontFamily' => 'sans-serif',
                ],
                'is_active' => true,
            ]
        );

        // Template 2: Elegant Green (Success & Growth)
        CertificateTemplate::firstOrCreate(
            ['name' => 'Elegant Green'],
            [
                'type' => 'course',
                'logo_path' => null,
                'template_data' => [
                    'primaryColor' => '#047857',
                    'secondaryColor' => '#1f2937',
                    'backgroundColor' => '#d1fae5',
                    'borderColor' => '#10b981',
                    'titleText' => 'Certificate of Excellence',
                    'descriptionText' => 'This is to certify that',
                    'completionText' => 'has demonstrated outstanding achievement in',
                    'footerText' => 'Congratulations on your accomplishment',
                    'fontFamily' => 'serif',
                ],
                'is_active' => false,
            ]
        );

        // Template 3: Royal Purple (Premium & Luxurious)
        CertificateTemplate::firstOrCreate(
            ['name' => 'Royal Purple'],
            [
                'type' => 'course',
                'logo_path' => null,
                'template_data' => [
                    'primaryColor' => '#6b21a8',
                    'secondaryColor' => '#374151',
                    'backgroundColor' => '#fae8ff',
                    'borderColor' => '#c026d3',
                    'titleText' => 'Certificate of Completion',
                    'descriptionText' => 'This prestigious certificate is awarded to',
                    'completionText' => 'for exceptional dedication and successful completion of',
                    'footerText' => 'Excellence in Learning',
                    'fontFamily' => 'cursive',
                ],
                'is_active' => false,
            ]
        );

        // Template 4: Classic Red (Exam Achievement)
        CertificateTemplate::firstOrCreate(
            ['name' => 'Classic Red Exam'],
            [
                'type' => 'exam',
                'logo_path' => null,
                'template_data' => [
                    'primaryColor' => '#dc2626',
                    'secondaryColor' => '#1f2937',
                    'backgroundColor' => '#fef2f2',
                    'borderColor' => '#ef4444',
                    'titleText' => 'Certificate of Examination Excellence',
                    'descriptionText' => 'This certificate is proudly presented to',
                    'completionText' => 'for outstanding performance in the examination',
                    'footerText' => 'Authorized Examination Certificate',
                    'fontFamily' => 'sans-serif',
                ],
                'is_active' => true,
            ]
        );

        // Template 5: Modern Orange (Assessment Success)
        CertificateTemplate::firstOrCreate(
            ['name' => 'Modern Orange Exam'],
            [
                'type' => 'exam',
                'logo_path' => null,
                'template_data' => [
                    'primaryColor' => '#ea580c',
                    'secondaryColor' => '#374151',
                    'backgroundColor' => '#fff7ed',
                    'borderColor' => '#f97316',
                    'titleText' => 'Certificate of Assessment Achievement',
                    'descriptionText' => 'This is to certify that',
                    'completionText' => 'has successfully passed the assessment with distinction',
                    'footerText' => 'Verified Assessment Certificate',
                    'fontFamily' => 'serif',
                ],
                'is_active' => false,
            ]
        );

        // Template 6: Bold Teal (Test Excellence)
        CertificateTemplate::firstOrCreate(
            ['name' => 'Bold Teal Exam'],
            [
                'type' => 'exam',
                'logo_path' => null,
                'template_data' => [
                    'primaryColor' => '#0d9488',
                    'secondaryColor' => '#1f2937',
                    'backgroundColor' => '#f0fdfa',
                    'borderColor' => '#14b8a6',
                    'titleText' => 'Certificate of Test Excellence',
                    'descriptionText' => 'This prestigious certificate is awarded to',
                    'completionText' => 'for exceptional performance in the test',
                    'footerText' => 'Certified Test Achievement',
                    'fontFamily' => 'cursive',
                ],
                'is_active' => false,
            ]
        );
    }
}
