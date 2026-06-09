<?php

namespace App\Http\Controllers;

use App\Http\Requests\Auth\UpdateGoogleAuthSettingsRequest;
use App\Http\Requests\FooterItemRequest;
use App\Http\Requests\NavbarItemRequest;
use App\Http\Requests\StoreCustomPageRequest;
use App\Http\Requests\UpdateAuthRequest;
use App\Http\Requests\UpdateCustomPageRequest;
use App\Http\Requests\UpdateInstructorProfileRequest;
use App\Http\Requests\UpdatePaymentGatewayRequest;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Services\SettingsService;
use App\Http\Requests\UpdateSmtpSettingsRequest;
use App\Http\Requests\UpdateStorageRequest;
use App\Http\Requests\UpdateZoomConfigRequest;
use App\Models\Page;
use App\Services\InstructorService;
use App\Services\StudentService;
use Illuminate\Support\Facades\Auth;
use Modules\Updater\Models\Backup;
use App\Models\Footer;
use App\Models\FooterItem;
use App\Models\Navbar;
use App\Models\NavbarItem;
use App\Models\Setting;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Artisan;

class SettingController extends Controller
{
    public function __construct(
        private StudentService $studentService,
        private SettingsService $settingsService,
        private InstructorService $instructorService
    ) {}

    /**
     * Display a listing of the resource.
     */
    public function account(Request $request)
    {
        $instructor = null;
        if (!$request->tab || $request->tab === 'profile-update') {
            $instructor = $this->instructorService->getInstructorByUserId(Auth::user()->id);
        }

        return Inertia::render('dashboard/settings/account', compact('instructor'));
    }

    /**
     * Display a listing of the resource.
     */
    public function profile_update(UpdateInstructorProfileRequest $request)
    {
        $user = Auth::user();
        $user = $this->studentService->updateProfile($request->validated(), $user->id);
        $this->instructorService->updateInstructor($request->validated(), $user->instructor_id);

        return back()->with('success', 'Profile updated successfully');
    }

    /**
     * Display a listing of the resource.
     */
    public function system(Request $request)
    {
        $system = $this->settingsService->getSetting(['type' => 'system']);

        return Inertia::render('dashboard/settings/system/index', compact('system'));
    }

    /**
     * Update the specified resource in storage.
     */
    public function system_update(Request $request, string $id)
    {
        $this->settingsService->systemUpdate($request->all(), $id);

        return back()->with('success', 'System settings updated successfully');
    }

    /**
     * Display a listing of the resource.
     */
    public function pages(Request $request)
    {
        $home = $this->settingsService->getSetting(['type' => 'home_page']);
        $pages = Page::with('sections')->get();

        return Inertia::render('dashboard/settings/pages/index', compact('home', 'pages'));
    }

    /**
     * Update the specified resource in storage.
     */
    public function home_pages_update(Request $request, string $id)
    {
        $validated = $request->validate([
            'page_id' => 'required|exists:pages,id',
            'page_name' => 'required|string',
            'page_slug' => 'required|string',
        ]);

        $this->settingsService->homePagesSelect($validated, $id);

        return back()->with('success', 'Home page has been updated successfully');
    }

    public function system_type_update(Request $request)
    {
        $request->validate([
            'sub_type' => 'required|string|in:collaborative,administrative',
        ]);

        $page = Page::where('type', $request->sub_type)->first();
        $system = Setting::where('type', 'system')->first();
        $homePage = Setting::where('type', 'home_page')->first();

        $system->update(['sub_type' => $request->sub_type]);
        $homePage->update([
            'fields' => [
                'page_id' => $page->id,
                'page_name' => $page->name,
                'page_slug' => $page->slug,
            ],
        ]);

        return back()->with('success', 'System type has been updated successfully');
    }

    public function custom_pages_edit(Request $request, string $id)
    {
        $page = Page::find($id);

        return Inertia::render('dashboard/settings/pages/update', compact('page'));
    }

    public function custom_pages_store(StoreCustomPageRequest $request)
    {
        $this->settingsService->customPagesCreate($request->validated());

        return back()->with('success', 'Custom page has been created successfully');
    }

    public function custom_pages_update(UpdateCustomPageRequest $request, string $id)
    {
        $this->settingsService->customPagesUpdate($request->validated(), $id);

        return back()->with('success', 'Custom page has been updated successfully');
    }

    public function custom_pages_destroy(string $id)
    {
        $this->settingsService->customPagesDestroy($id);

        return back()->with('success', 'Custom page has been deleted successfully');
    }

    /**
     * Update the specified resource in storage.
     */
    public function page_select(Request $request, string $id)
    {
        // $this->settingsService->pagesUpdate($request->all(), $id);

        return back()->with('success', 'Pages settings updated successfully');
    }

    /**
     * Display a listing of the resource.
     */
    public function storage(Request $request)
    {
        $storage = $this->settingsService->getSetting(['type' => 'storage']);

        return Inertia::render('dashboard/settings/storage', compact('storage'));
    }

    /**
     * Update the specified resource in storage.
     */
    // public function storage_update(Request $request, Setting $setting)
    public function storage_update(UpdateStorageRequest $request, string $id)
    {
        $this->settingsService->storageUpdate($request->validated(), $id);

        return back()->with('success', 'Storage settings updated successfully');
    }

    /**
     * Display a listing of the resource.
     */
    public function payment(Request $request)
    {
        $payments = $this->settingsService->getSettings(['type' => 'payment']);

        return Inertia::render('dashboard/settings/payment', compact('payments'));
    }

    /**
     * Update the specified resource in storage.
     */
    public function payment_update(UpdatePaymentGatewayRequest $request, string $id)
    {
        $this->settingsService->paymentUpdate($request->validated(), $id);

        return back()->with('success', 'Payment gateway settings updated successfully');
    }

    /**
     * Display a listing of the resource.
     */
    public function smtp(Request $request)
    {
        $smtp = $this->settingsService->getSetting(['type' => 'smtp']);

        return Inertia::render('dashboard/settings/smtp', compact('smtp'));
    }

    /**
     * Update the specified resource in storage.
     */
    public function smtp_update(UpdateSmtpSettingsRequest $request, string $id)
    {
        try {
            $this->settingsService->smtpUpdate($request->validated(), $id);

            return back()->with('success', 'SMTP settings updated successfully. A test email was sent to verify your configuration.');
        } catch (\Exception $e) {
            return back()->with('error', $e->getMessage());
        }
    }

    /**
     * Display a listing of the resource.
     */
    public function auth0(Request $request)
    {
        $auths = $this->settingsService->getSettings(['type' => 'auth']);

        return Inertia::render('dashboard/settings/auth', compact('auths'));
    }

    /**
     * Update the specified resource in storage.
     */
    public function auth0_update(UpdateAuthRequest $request, string $id)
    {
        $this->settingsService->authUpdate($request->validated(), $id);

        return back()->with('success', 'Auth settings updated successfully.');
    }

    /**
     * Display a listing of the resource.
     */
    public function maintenance(Request $request)
    {
        Artisan::call('optimize:clear');

        return redirect(route('system.update.seeder'));
    }

    /**
     * Display a listing of the resource.
     */
    public function live_class(Request $request)
    {
        $liveClass = $this->settingsService->getSetting(['type' => 'live_class']);

        return Inertia::render('dashboard/settings/live-class', compact('liveClass'));
    }

    /**
     * Update the specified resource in storage.
     */
    public function live_class_update(UpdateZoomConfigRequest $request, string $id)
    {
        try {
            $this->settingsService->zoomConfigUpdate($request->validated(), $id);

            return back()->with('success', 'Zoom configuration settings updated successfully.');
        } catch (\Exception $e) {
            return back()->with('error', $e->getMessage());
        }
    }

    /**
     * Store a new navbar item.
     */
    public function navbar_items_store(NavbarItemRequest $request, Navbar $navbar)
    {
        try {
            $this->settingsService->createNavbarItem($navbar, $request->validated());

            return back()->with('success', 'Navbar item created successfully');
        } catch (\Exception $e) {
            return back()->with('error', 'Failed to create navbar item: ' . $e->getMessage());
        }
    }

    /**
     * Update a navbar item.
     */
    public function navbar_items_update(NavbarItemRequest $request, NavbarItem $item)
    {
        try {
            $this->settingsService->updateNavbarItem($item, $request->validated());

            return back()->with('success', 'Navbar item updated successfully');
        } catch (\Exception $e) {
            return back()->with('error', 'Failed to update navbar item: ' . $e->getMessage());
        }
    }

    /**
     * Delete a navbar item.
     */
    public function navbar_items_destroy(NavbarItem $item)
    {
        try {
            $this->settingsService->deleteNavbarItem($item);

            return back()->with('success', 'Navbar item deleted successfully');
        } catch (\Exception $e) {
            return back()->with('error', 'Failed to delete navbar item: ' . $e->getMessage());
        }
    }

    /**
     * Reorder navbar items.
     */
    public function navbar_items_reorder(Request $request)
    {
        try {
            $this->settingsService->reorderNavbarItems($request->sortedData);

            return back()->with('success', 'Navbar items reordered successfully');
        } catch (\Exception $e) {
            return back()->with('error', 'Failed to reorder navbar items: ' . $e->getMessage());
        }
    }

    /**
     * Store a new footer item.
     */
    public function footer_items_store(FooterItemRequest $request, Footer $footer)
    {
        try {
            $this->settingsService->createFooterItem($footer, $request->validated());

            return back()->with('success', 'Footer item created successfully');
        } catch (\Exception $e) {
            return back()->with('error', 'Failed to create footer item: ' . $e->getMessage());
        }
    }

    /**
     * Update a footer item.
     */
    public function footer_items_update(FooterItemRequest $request, FooterItem $item)
    {
        try {
            $this->settingsService->updateFooterItem($item, $request->validated());

            return back()->with('success', 'Footer item updated successfully');
        } catch (\Exception $e) {
            return back()->with('error', 'Failed to update footer item: ' . $e->getMessage());
        }
    }

    /**
     * Delete a footer item.
     */
    public function footer_items_destroy(FooterItem $item)
    {
        try {
            $this->settingsService->deleteFooterItem($item);

            return back()->with('success', 'Footer item deleted successfully');
        } catch (\Exception $e) {
            return back()->with('error', 'Failed to delete footer item: ' . $e->getMessage());
        }
    }

    /**
     * Reorder footer items.
     */
    public function footer_items_reorder(Request $request)
    {
        try {
            $this->settingsService->reorderFooterItems($request->sortedData);

            return back()->with('success', 'Footer items reordered successfully');
        } catch (\Exception $e) {
            return back()->with('error', 'Failed to reorder footer items: ' . $e->getMessage());
        }
    }
}
