<?php

namespace Modules\Updater\Services;

use Exception;
use ZipArchive;
use Modules\Updater\Models\Backup;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Artisan;

class UpdateService extends FileService
{
   /**
    * Clear all caches with optional aggressive mode
    */
   public function clearCaches(bool $aggressive = false): void
   {
      $commands = [
         'cache:clear --no-interaction --force',
         'config:clear --no-interaction --force',
         'route:clear --no-interaction --force',
         'view:clear --no-interaction --force',
         'event:clear --no-interaction --force',
      ];

      if ($aggressive) {
         $commands[] = 'optimize:clear --no-interaction --force';
      }

      foreach ($commands as $command) {
         try {
            Artisan::call($command);
            Log::info("Executed: php artisan {$command}");
         } catch (\Exception $e) {
            Log::error("Failed to execute {$command}: " . $e->getMessage());
         }
      }
   }

   /**
    * Manually delete cache files that might be locked
    */
   public function manuallyClearCacheFiles(): void
   {
      $cachePaths = [
         base_path('bootstrap/cache/'),
         storage_path('framework/cache/data/'),
         storage_path('framework/sessions/'),
         storage_path('framework/views/'),
      ];

      foreach ($cachePaths as $path) {
         try {
            if (file_exists($path)) {
               // Delete all files in cache directories
               $files = new \RecursiveIteratorIterator(
                  new \RecursiveDirectoryIterator($path, \RecursiveDirectoryIterator::SKIP_DOTS),
                  \RecursiveIteratorIterator::CHILD_FIRST
               );

               foreach ($files as $file) {
                  if ($file->isFile()) {
                     @unlink($file->getRealPath());
                  }
               }
               Log::info("Manually cleared cache files in: {$path}");
            }
         } catch (\Exception $e) {
            Log::error("Failed to manually clear cache in {$path}: " . $e->getMessage());
         }
      }
   }

   /**
    * Update application from uploaded ZIP file
    */
   public function updateApplicationFromZip($zipFilePath)
   {
      $zip = new ZipArchive();
      $rootPath = base_path();

      try {
         // Validate ZIP file exists
         if (!file_exists($zipFilePath)) {
            throw new \Exception('Update ZIP file not found: ' . $zipFilePath);
         }

         // Open the update ZIP file
         if ($zip->open($zipFilePath) !== TRUE) {
            throw new \Exception('Cannot open update ZIP file: ' . basename($zipFilePath));
         }

         $extractedCount = 0;

         // Manually extract files to skip overwriting .env
         for ($i = 0; $i < $zip->numFiles; $i++) {
            $fileName = $zip->getNameIndex($i);

            // Skip the .env file anywhere in the project
            if (basename($fileName) === '.env') {
               continue;
            }

            $destination = $rootPath . DIRECTORY_SEPARATOR . $fileName;

            // If it's a directory, create it if it doesn't exist
            if (substr($fileName, -1) === '/') {
               if (!is_dir($destination)) {
                  mkdir($destination, 0755, true);
               }
               continue;
            }

            // Ensure parent directories exist
            $dir = dirname($destination);
            if (!is_dir($dir)) {
               mkdir($dir, 0755, true);
            }

            // Write file contents
            file_put_contents($destination, $zip->getFromIndex($i));
            $extractedCount++;
         }

         $zip->close();

         // Log successful extraction
         Log::info("Update ZIP extracted successfully", [
            'files_extracted' => $extractedCount,
            'target_directory' => $rootPath
         ]);
      } catch (\Exception $e) {
         // Log the error before throwing
         Log::error("Failed to extract update ZIP", [
            'file' => $zipFilePath,
            'error' => $e->getMessage()
         ]);

         throw $e;
      }
   }

   // public function updateApplicationFromZip($zipFilePath)
   // {
   //    $zip = new ZipArchive();
   //    $rootPath = base_path();

   //    try {
   //       // Validate ZIP file exists
   //       if (!file_exists($zipFilePath)) {
   //          throw new \Exception('Update ZIP file not found: ' . $zipFilePath);
   //       }

   //       // Extract the update ZIP file directly to project root
   //       if ($zip->open($zipFilePath) !== TRUE) {
   //          throw new \Exception('Cannot open update ZIP file: ' . basename($zipFilePath));
   //       }

   //       // Extract all files, overwriting existing ones
   //       if (!$zip->extractTo($rootPath)) {
   //          $zip->close();
   //          throw new \Exception('Failed to extract update ZIP file to project directory');
   //       }

   //       $extractedCount = $zip->numFiles;
   //       $zip->close();

   //       // Log successful extraction
   //       Log::info("Update ZIP extracted successfully", [
   //          'files_extracted' => $extractedCount,
   //          'target_directory' => $rootPath
   //       ]);
   //    } catch (\Exception $e) {
   //       throw $e;
   //    }
   // }
}
