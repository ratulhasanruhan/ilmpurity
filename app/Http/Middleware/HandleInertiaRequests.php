<?php

namespace App\Http\Middleware;

use App\Services\NotificationService;
use App\Services\SettingsService;
use App\Services\StudentService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Cookie;
use Modules\Language\Models\Language;
use Modules\Language\Services\LanguageService;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\App;
use Inertia\Middleware;
use Tighten\Ziggy\Ziggy;

class HandleInertiaRequests extends Middleware
{
    public function __construct(
        private StudentService $studentService,
        private SettingsService $settingsService,
        private LanguageService $languageService,
        private NotificationService $notificationService,
    ) {}

    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        try {
            DB::connection()->getPdo();
        } catch (\Throwable $th) {
            return [];
        }

        $user = Auth::user();
        $system = app('system_settings');
        $cartCount = $user ? $this->studentService->getCartCount() : 0;

        if (Schema::hasTable('languages')) {
            $langs = Language::where('is_active', true)->orderBy('is_default', 'desc')->get();
            $default = $langs->where('is_default', true)->first()->code;
            config(['app.locale' => $default]);
            $locale = Cookie::get('locale', $default);
            App::setLocale($locale);

            $this->languageService->setLanguageProperties($locale);
        } else {
            $langs = [];
            $locale = Cookie::get('locale', 'en');
        }

        $direction = Cookie::get('direction', 'ltr');
        if (array_key_exists('direction', $system->fields)) {
            $systemDirection = $system->fields['direction'];
            if ($systemDirection !== 'none') {
                $direction = $systemDirection;
            }
        }

        return [
            ...parent::share($request),
            'page' => app('intro_page'),
            'auth' => ['user' => $user],
            'system' => $system,
            'customize' => $request->query('customize', false),
            'navbar' => $this->settingsService->getNavbar('navbar_1'),
            'footer' => $this->settingsService->getFooter('footer_1'),
            'notifications' => $user ? $this->notificationService->notifications(['unread' => true]) : [],
            'ziggy' => fn(): array => [
                ...(new Ziggy)->toArray(),
                'location' => $request->url(),
            ],
            'flash' => [
                'error' => fn() => $request->session()->get('error'),
                'warning' => fn() => $request->session()->get('warning'),
                'success' => fn() => $request->session()->get('success'),
            ],
            'langs' => $langs,
            'locale' => $locale,
            'direction' => $direction,
            'cartCount' => $cartCount,
            'translate' => [
                'auth' => trans('auth'),
                'button' => trans('button'),
                'common' => trans('common'),
                'dashboard' => trans('dashboard'),
                'frontend' => trans('frontend'),
                'input' => trans('input'),
                'settings' => trans('settings'),
                'table' => trans('table'),
            ],
        ];
    }
}
