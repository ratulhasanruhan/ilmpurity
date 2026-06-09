<?php

namespace App\Http\Controllers;

use App\Http\Requests\SendNewsletterRequest;
use App\Http\Requests\StoreNewsletterRequest;
use App\Http\Requests\UpdateNewsletterRequest;
use App\Services\NewsletterService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class NewsletterController extends Controller
{
    public function __construct(private NewsletterService $newsletterService) {}

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $newsletters = $this->newsletterService->getNewsletters($request->all(), true);

        return Inertia::render('dashboard/newsletters/index', compact('newsletters'));
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreNewsletterRequest $request)
    {
        $this->newsletterService->createNewsletter($request->validated());

        return back()->with('success', 'Newsletter created successfully');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateNewsletterRequest $request, string $id)
    {
        $this->newsletterService->updateNewsletter($id, $request->validated());

        return back()->with('success', 'Newsletter updated successfully');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $this->newsletterService->deleteNewsletter($id);

        return back()->with('success', 'Newsletter deleted successfully');
    }

    /**
     * Sent newsletter to the users
     */
    public function newsletter_send(SendNewsletterRequest $request)
    {
        $this->newsletterService->NewsletterNotification($request->validated());

        return back()->with('success', 'Newsletter sent successfully');
    }
}
