<?php

namespace Modules\Certificate\Database\Seeders;

use Illuminate\Database\Seeder;
use Modules\Certificate\Models\MarksheetTemplate;

class MarksheetTemplateSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Template 1: Professional Blue (Academic Standard)
        MarksheetTemplate::firstOrCreate(
            ['name' => 'Professional Blue Marksheet'],
            [
                'type' => 'course',
                'logo_path' => null,
                'template_data' => [
                    'primaryColor' => '#1e40af',
                    'secondaryColor' => '#475569',
                    'backgroundColor' => '#ffffff',
                    'borderColor' => '#2563eb',
                    'headerText' => 'Academic Marksheet',
                    'institutionName' => 'Learning Management System',
                    'footerText' => 'This is an official academic record',
                    'fontFamily' => 'sans-serif',
                ],
                'is_active' => true,
            ]
        );

        // Template 2: Elegant Green (Success & Achievement)
        MarksheetTemplate::firstOrCreate(
            ['name' => 'Elegant Green Marksheet'],
            [
                'type' => 'course',
                'logo_path' => null,
                'template_data' => [
                    'primaryColor' => '#047857',
                    'secondaryColor' => '#1f2937',
                    'backgroundColor' => '#f0fdf4',
                    'borderColor' => '#10b981',
                    'headerText' => 'Course Performance Report',
                    'institutionName' => 'Excellence in Education',
                    'footerText' => 'Certified Academic Achievement Record',
                    'fontFamily' => 'serif',
                ],
                'is_active' => false,
            ]
        );

        // Template 3: Royal Purple (Premium Academic)
        MarksheetTemplate::firstOrCreate(
            ['name' => 'Royal Purple Marksheet'],
            [
                'type' => 'course',
                'logo_path' => null,
                'template_data' => [
                    'primaryColor' => '#6b21a8',
                    'secondaryColor' => '#374151',
                    'backgroundColor' => '#fef3ff',
                    'borderColor' => '#c026d3',
                    'headerText' => 'Official Transcript',
                    'institutionName' => 'Premier Learning Academy',
                    'footerText' => 'Excellence in Academic Performance',
                    'fontFamily' => 'serif',
                ],
                'is_active' => false,
            ]
        );

        // // Template 4: Classic Red (Exam Results)
        // MarksheetTemplate::firstOrCreate(
        //     ['name' => 'Classic Red Exam Marksheet'],
        //     [
        //         'type' => 'exam',
        //         'logo_path' => null,
        //         'template_data' => [
        //             'primaryColor' => '#dc2626',
        //             'secondaryColor' => '#1f2937',
        //             'backgroundColor' => '#ffffff',
        //             'borderColor' => '#ef4444',
        //             'headerText' => 'Examination Results',
        //             'institutionName' => 'Learning Management System',
        //             'footerText' => 'Official Examination Record',
        //             'fontFamily' => 'sans-serif',
        //         ],
        //         'is_active' => true,
        //     ]
        // );

        // // Template 5: Modern Orange (Assessment Results)
        // MarksheetTemplate::firstOrCreate(
        //     ['name' => 'Modern Orange Exam Marksheet'],
        //     [
        //         'type' => 'exam',
        //         'logo_path' => null,
        //         'template_data' => [
        //             'primaryColor' => '#ea580c',
        //             'secondaryColor' => '#374151',
        //             'backgroundColor' => '#fff7ed',
        //             'borderColor' => '#f97316',
        //             'headerText' => 'Assessment Results Sheet',
        //             'institutionName' => 'Academic Excellence Center',
        //             'footerText' => 'Verified Examination Performance',
        //             'fontFamily' => 'sans-serif',
        //         ],
        //         'is_active' => false,
        //     ]
        // );

        // // Template 6: Bold Teal (Test Results)
        // MarksheetTemplate::firstOrCreate(
        //     ['name' => 'Bold Teal Exam Marksheet'],
        //     [
        //         'type' => 'exam',
        //         'logo_path' => null,
        //         'template_data' => [
        //             'primaryColor' => '#0d9488',
        //             'secondaryColor' => '#1f2937',
        //             'backgroundColor' => '#f0fdfa',
        //             'borderColor' => '#14b8a6',
        //             'headerText' => 'Test Results Certificate',
        //             'institutionName' => 'Professional Testing Institute',
        //             'footerText' => 'Authenticated Test Performance Record',
        //             'fontFamily' => 'serif',
        //         ],
        //         'is_active' => false,
        //     ]
        // );
    }
}
