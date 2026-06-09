<?php

namespace App\Providers;

use App\Models\Page;
use App\Models\Setting;
use App\Models\User;
use Illuminate\Auth\Notifications\ResetPassword;
use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\URL;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->singleton('system_settings', function (): ?Setting {
            try {
                if (isDBConnected() && Schema::hasTable('settings')) {
                    return Setting::where('type', 'system')->first();
                }

                return null;
            } catch (\Throwable $th) {
                return null;
            }
        });

        $this->app->singleton('intro_page', function (): ?Page {
            try {
                if (isDBConnected() && Schema::hasTable('settings')) {
                    $home = Setting::where('type', 'home_page')->first();

                    $page = Page::where('id', $home->fields['page_id'])
                        ->with(['sections' => function ($query) {
                            $query->orderBy('sort', 'asc');
                        }])
                        ->first();

                    return $page;
                }

                return null;
            } catch (\Throwable $th) {
                return null;
            }
        });
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Schema::defaultStringLength(191);

        ResetPassword::createUrlUsing(function (User $user, string $token) {
            return env('FRONTEND_URL') . '/reset-password?token=' . $token . '&email=' . $user->email;
        });

        // Trust proxies when running behind a reverse proxy (e.g., Docker, nginx)
        // This allows Laravel to correctly detect HTTPS when behind a proxy
        if (config('app.env') !== 'local' || request()->hasHeader('X-Forwarded-Proto')) {
            request()->setTrustedProxies(
                ['*'],
                \Illuminate\Http\Request::HEADER_X_FORWARDED_FOR |
                    \Illuminate\Http\Request::HEADER_X_FORWARDED_HOST |
                    \Illuminate\Http\Request::HEADER_X_FORWARDED_PORT |
                    \Illuminate\Http\Request::HEADER_X_FORWARDED_PROTO |
                    \Illuminate\Http\Request::HEADER_X_FORWARDED_PREFIX
            );
        }

        // Force HTTPS scheme for URLs when accessed via HTTPS
        // This ensures assets load with the correct protocol
        if (request()->header('X-Forwarded-Proto') === 'https' || request()->secure()) {
            URL::forceScheme('https');
        }
    }
}
