<?php

namespace App\Http\Middleware;

use App\Services\SettingsService;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AppConfig
{
    public function __construct(private SettingsService $settingsService) {}

    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $system = $this->settingsService->getSetting(['type' => 'system'])['fields'];
        $storage = $this->settingsService->getSetting(['type' => 'storage'])['fields'];

        // App configuration
        config(['app.name' => $system['name']]);

        // Storage configuration
        if ($storage['storage_driver'] == 's3') {
            config(['media-library.disk_name' => 's3']);
            config([
                'filesystems.default' => 's3',
                'filesystems.disks.s3.key' => $storage['aws_access_key_id'],
                'filesystems.disks.s3.secret' => $storage['aws_secret_access_key'],
                'filesystems.disks.s3.region' => $storage['aws_default_region'],
                'filesystems.disks.s3.bucket' => $storage['aws_bucket'],
                // 'filesystems.disks.s3.use_path_style_endpoint' => $storage['aws_use_path_style_endpoint'],
            ]);
        } else {
            config(['media-library.disk_name' => 'public']);
            config(['filesystems.default' => 'local']);
        }

        // Check S3 configuration from config
        if (config('filesystems.default') === 's3') {
            // Check if required S3 credentials exist in config
            if (
                empty(config('filesystems.disks.s3.key')) ||
                empty(config('filesystems.disks.s3.secret')) ||
                empty(config('filesystems.disks.s3.region')) ||
                empty(config('filesystems.disks.s3.bucket'))
            ) {
                return back()->with('error', 'S3 storage configuration is incomplete. File will not upload to the S3 right now.');
            }
        }

        return $next($request);
    }
}
