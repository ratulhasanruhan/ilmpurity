<?php

namespace Modules\Certificate\Http\Controllers;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Modules\Certificate\Models\CertificateTemplate;

class CertificateController extends Controller
{
    /**
     * Display the certificate download page for a specific course.
     */
    public function show($courseId)
    {
        // Get the active certificate template
        $activeTemplate = CertificateTemplate::where('is_active', true)->first();

        // If no active template exists, use default template data
        if (!$activeTemplate) {
            $activeTemplate = [
                'id' => 0,
                'name' => 'Default Template',
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
                'is_active' => false,
            ];
        }

        return Inertia::render('student/certificate/show', [
            'courseId' => $courseId,
            'certificateTemplate' => $activeTemplate,
        ]);
    }
}
