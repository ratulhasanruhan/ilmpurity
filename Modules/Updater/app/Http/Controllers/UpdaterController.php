<?php

namespace Modules\Updater\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;
use Modules\Updater\Models\Backup;
use Modules\Updater\Services\BackupService;
use Modules\Updater\Services\UpdateService;
use Inertia\Inertia;
use ZipArchive;

class UpdaterController extends Controller
{
    function __construct(
        private BackupService $backupService,
        private UpdateService $updateService
    ) {}

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $version = file_get_contents(base_path('version.txt'));

        $recentBackups = Backup::orderBy('created_at', 'desc')
            ->take(10)
            ->get();

        return Inertia::render('system/maintenance', [
            'version' => $version,
            'recentBackups' => $recentBackups,
            'flash' => [
                'error' => fn() => $request->session()->get('error'),
                'warning' => fn() => $request->session()->get('warning'),
                'success' => fn() => $request->session()->get('success'),
            ],
        ]);
    }

    /**
     * Create application backup
     */
    public function createBackup()
    {
        ini_set('max_execution_time', 600); // Set max execution time to 600 seconds (10 minutes)

        try {
            $backupName = 'backup_' . now()->format('Y_m_d_H_i_s');
            $backupDir = storage_path('app/backups');

            // Create backup directory if it doesn't exist
            if (!file_exists($backupDir)) {
                mkdir($backupDir, 0755, true);
            }

            // 1. Create source code backup first
            $sourceCodeZip = $this->backupService->createSourceCodeBackup($backupName, $backupDir);
            $sourceCodeSize = file_exists($sourceCodeZip) ? filesize($sourceCodeZip) : 0;

            // 2. Estimate database backup size (so we can include it in the record)
            $estimatedDatabaseSize = $this->backupService->estimateDatabaseBackupSize();

            // 3. Create backup record with actual source code size and estimated database size
            $backup = $this->backupService->createBackup($backupName, $sourceCodeSize, $estimatedDatabaseSize);

            // 4. Create database backup (now includes the complete backup record with estimated size)
            $this->backupService->createDatabaseBackup($backupName, $backupDir);

            return redirect()->back()->with('success', 'Backup created successfully! Files: ' . $backup->source_code_zip . ', ' . $backup->database_zip);
        } catch (\Exception $e) {
            // If backup creation fails, delete the incomplete backup record
            if (isset($backup)) {
                $backup->delete();
            }

            return redirect()->back()->with('error', 'Backup failed: ' . $e->getMessage());
        }
    }

    /**
     * Delete backup by ID
     */
    public function deleteBackup($id)
    {
        ini_set('max_execution_time', 600); // Set max execution time to 600 seconds (10 minutes)

        try {
            $backup = $this->backupService->deleteFromBackup($id);

            // Prepare response message
            $message = "Backup '{$backup->backup_name}' deleted successfully.";
            if (!empty($deletedFiles)) {
                $message .= " Files removed: " . implode(', ', $deletedFiles) . ".";
            }
            if (!empty($failedFiles)) {
                $message .= " Warning: Could not delete some files: " . implode(', ', $failedFiles) . ".";
            }

            return redirect(route('system.maintenance'))->with('success', $message);
        } catch (\Exception $e) {
            return redirect(route('system.maintenance'))->with('error', 'Failed to delete backup: ' . $e->getMessage());
        }
    }

    /**
     * Restore backup by ID
     */
    public function restoreBackup($id)
    {
        $secret = null;
        ini_set('max_execution_time', 600); // Set max execution time to 600 seconds (10 minutes)

        try {
            // Find the backup record first (before maintenance mode)
            $backup = Backup::findOrFail($id);
            $backupDir = storage_path('app/backups');

            // Validate backup files exist
            $sourceCodePath = $backupDir . '/' . $backup->source_code_zip;
            $databasePath = $backupDir . '/' . $backup->database_zip;

            if (!file_exists($sourceCodePath)) {
                throw new \Exception('Source code backup file not found: ' . $backup->source_code_zip);
            }

            if (!file_exists($databasePath)) {
                throw new \Exception('Database backup file not found: ' . $backup->database_zip);
            }

            // Put app into maintenance mode with secret
            $secret = 'restore-' . now()->timestamp;
            Artisan::call('down', [
                '--secret' => $secret,
                '--render' => 'errors::503',
                '--retry'  => 60, // clients told to retry after 60s
            ]);

            // Store secret in cache (so frontend can show bypass link if needed)
            Cache::put('maintenance_secret', $secret, now()->addMinutes(30));

            // Pre-update refresh
            Artisan::call('optimize:clear');

            // Perform the restore operation
            $this->backupService->restoreFromBackup($sourceCodePath, $databasePath);

            // Log successful restore
            Log::info("Backup restore completed successfully: {$backup->backup_name}");

            return redirect()->back()->with('success', "Backup '{$backup->backup_name}' restored successfully! Please refresh the page.");
        } catch (\Exception $e) {
            // Log the error
            Log::error("Backup restore failed: " . $e->getMessage(), [
                'backup_id' => $id ?? null,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return redirect()->back()->with('error', 'Restore failed: ' . $e->getMessage());
        } finally {
            // Always disable maintenance mode, regardless of success or failure
            Artisan::call('up');
            Cache::forget('maintenance_secret');
            Log::info("Maintenance mode disabled after restore operation");
        }
    }

    /**
     * Download backup files
     */
    public function downloadBackup($id)
    {
        try {
            $backup = Backup::findOrFail($id);

            // Verify backup files exist
            $sourcePath = storage_path('app/backups/' . $backup->source_code_zip);
            $dbPath = storage_path('app/backups/' . $backup->database_zip);

            if (!file_exists($sourcePath) || !file_exists($dbPath)) {
                return redirect()->back()->with('error', 'Backup files not found');
            }

            // Create a temporary zip containing both files
            $zipName = 'backup_' . $backup->backup_name . '.zip';
            $zipPath = storage_path('app/temp/' . $zipName);

            // Ensure temp directory exists
            if (!file_exists(dirname($zipPath))) {
                mkdir(dirname($zipPath), 0755, true);
            }

            $zip = new ZipArchive();
            if ($zip->open($zipPath, ZipArchive::CREATE) === TRUE) {
                // Add files to the zip
                $zip->addFile($sourcePath, basename($sourcePath));
                $zip->addFile($dbPath, basename($dbPath));
                $zip->close();

                // Stream the file to the browser
                return response()->download($zipPath, $zipName)->deleteFileAfterSend(true);
            }

            return redirect()->back()->with('error', 'Failed to create download package');
        } catch (\Exception $e) {
            Log::error('Backup download failed: ' . $e->getMessage());
            return redirect()->back()->with('error', 'Failed to download backup: ' . $e->getMessage());
        }
    }

    /**
     * Update application from uploaded ZIP (using chunked upload)
     */
    public function updateApp(Request $request)
    {
        $request->validate(['update_file_url' => 'required|string']);

        $secret = null;
        $tempFilePath = null;
        ini_set('max_execution_time', 600); // Set max execution time to 600 seconds (10 minutes)

        try {
            // Pre-update refresh
            Artisan::call('optimize:clear');

            // Get uploaded file path
            $updateFileUrl = $request->input('update_file_url');
            $relativePath = parse_url($updateFileUrl, PHP_URL_PATH);
            $tempFilePath = public_path($relativePath);

            // Validate file existence
            if (!file_exists($tempFilePath)) {
                throw new \Exception('Update file not found: ' . $updateFileUrl);
            }

            // Validate ZIP format by trying to open
            $zip = new ZipArchive();
            if ($zip->open($tempFilePath) !== true) {
                throw new \Exception('Invalid ZIP file');
            }
            $zip->close();

            // Put app into maintenance mode with secret
            $secret = 'update-' . now()->timestamp;
            Artisan::call('down', [
                '--secret' => $secret,
                '--render' => 'errors::503',
                '--retry'  => 60, // clients told to retry after 60s
            ]);

            // Store secret in cache (so frontend can show bypass link if needed)
            Cache::put('maintenance_secret', $secret, now()->addMinutes(30));

            // Perform the update (your service)
            $this->updateService->updateApplicationFromZip($tempFilePath);

            // Delete temporary update file
            if (file_exists($tempFilePath)) {
                unlink($tempFilePath);
                Log::info("Temporary update file deleted: " . basename($tempFilePath));
            }

            Log::info("Application update completed successfully");

            return redirect(route('system.update.seeder'));
        } catch (\Exception $e) {
            // Clean up on error
            if ($tempFilePath && file_exists($tempFilePath)) {
                unlink($tempFilePath);
            }

            Log::error("Application update failed: " . $e->getMessage(), [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return redirect()->back()->with('error', 'Update failed: ' . $e->getMessage());
        } finally {
            // Always disable maintenance mode
            Artisan::call('up');
            Cache::forget('maintenance_secret');
            Log::info("Maintenance mode disabled after update operation");
        }
    }

    public function updateAppSeeder()
    {
        ini_set('max_execution_time', 600); // Set max execution time to 600 seconds (10 minutes)

        // Pre-update refresh
        Artisan::call('optimize:clear');

        // Run migrations
        Log::info("Running database migrations after update");
        Artisan::call('migrate', ['--force' => true]);

        // Run data updates/seeders
        Artisan::call('module:seed', [
            'module' => 'Updater',
            '--class' => 'UpdaterDatabaseSeeder',
            '--force' => true,
        ]);
        Artisan::call('module:seed', [
            'module' => 'Blog',
            '--class' => 'BlogDatabaseSeeder',
            '--force' => true,
        ]);
        Artisan::call('module:seed', [
            'module' => 'Language',
            '--class' => 'LanguageDatabaseSeeder',
            '--force' => true,
        ]);
        Artisan::call('module:seed', [
            'module' => 'Certificate',
            '--class' => 'CertificateDatabaseSeeder',
            '--force' => true,
        ]);

        return redirect(route('system.maintenance'))->with('success', 'Update completed successfully!');
    }
}
