<?php

namespace Modules\Certificate\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Modules\Certificate\Models\MarksheetTemplate;

class MarksheetTemplateController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $templates = MarksheetTemplate::latest()->get();

        return Inertia::render('dashboard/certificate/marksheet', [
            'templates' => $templates,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('dashboard/certificate/marksheet-builder');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'logo' => 'nullable|image|mimes:jpeg,png,jpg,svg|max:2048',
            'template_data' => 'required|array',
            'is_active' => 'boolean',
        ]);

        $logoPath = null;
        if ($request->hasFile('logo')) {
            $logoPath = $request->file('logo')->store('marksheets/logos', 'public');
        }

        $template = MarksheetTemplate::create([
            'name' => $validated['name'],
            'logo_path' => $logoPath,
            'template_data' => $validated['template_data'],
            'is_active' => $validated['is_active'] ?? false,
        ]);

        return redirect()->route('marksheet.templates.index')->with('success', 'Marksheet template created successfully!');
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit($id)
    {
        $template = MarksheetTemplate::findOrFail($id);

        return Inertia::render('dashboard/certificate/marksheet-builder', [
            'template' => $template,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $template = MarksheetTemplate::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'logo' => 'nullable|image|mimes:jpeg,png,jpg,svg|max:2048',
            'template_data' => 'required|array',
            'is_active' => 'boolean',
        ]);

        // Handle logo update
        if ($request->hasFile('logo')) {
            if ($template->logo_path) {
                Storage::disk('public')->delete($template->logo_path);
            }
            $validated['logo_path'] = $request->file('logo')->store('marksheets/logos', 'public');
        }

        $template->update([
            'name' => $validated['name'],
            'logo_path' => $validated['logo_path'] ?? $template->logo_path,
            'template_data' => $validated['template_data'],
            'is_active' => $validated['is_active'] ?? $template->is_active,
        ]);

        return redirect()->route('marksheet.templates.index')->with('success', 'Marksheet template updated successfully!');
    }

    /**
     * Activate a specific template.
     */
    public function activate($id)
    {
        $template = MarksheetTemplate::findOrFail($id);

        // Deactivate all other templates
        MarksheetTemplate::where('id', '!=', $id)->update(['is_active' => false]);

        // Activate this template
        $template->update(['is_active' => true]);

        return redirect()->back()->with('success', 'Marksheet template activated successfully!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $template = MarksheetTemplate::findOrFail($id);

        // Delete logo if exists
        if ($template->logo_path) {
            Storage::disk('public')->delete($template->logo_path);
        }

        $template->delete();

        return redirect()->back()->with('success', 'Marksheet template deleted successfully!');
    }
}
