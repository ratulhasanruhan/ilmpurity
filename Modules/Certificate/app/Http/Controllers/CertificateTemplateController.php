<?php

namespace Modules\Certificate\Http\Controllers;

use App\Http\Controllers\Controller;
use Modules\Certificate\Http\Requests\CertificateTemplateRequest;
use Modules\Certificate\Models\CertificateTemplate;
use Modules\Certificate\Models\MarksheetTemplate;
use Modules\Certificate\Services\CertificateService;
use Inertia\Inertia;
use Illuminate\Http\Request;

class CertificateTemplateController extends Controller
{
    public function __construct(protected CertificateService $certificateService) {}

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $templates = CertificateTemplate::latest()->get();

        return Inertia::render('dashboard/certificate/certificate', [
            'templates' => $templates,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('dashboard/certificate/certificate-builder');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(CertificateTemplateRequest $request)
    {
        $this->certificateService->createCertificateTemplate($request->validated());

        return redirect()
            ->route('certificate.templates.index')
            ->with('success', 'Certificate template created successfully!');
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit($id)
    {
        $template = CertificateTemplate::findOrFail($id);

        return Inertia::render('dashboard/certificate/certificate-builder', [
            'template' => $template,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(CertificateTemplateRequest $request, $id)
    {
        $this->certificateService->updateCertificateTemplate($id, $request->validated());

        return redirect()
            ->route('certificate.templates.index')
            ->with('success', 'Certificate template updated successfully!');
    }

    /**
     * Activate a specific template.
     */
    public function activate(Request $request, $id)
    {
        $this->certificateService->activateCertificateTemplate($id, $request->type);

        return redirect()->back()->with('success', 'Certificate template activated successfully!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $this->certificateService->deleteCertificateTemplate($id);

        return redirect()->back()->with('success', 'Certificate template deleted successfully!');
    }
}
