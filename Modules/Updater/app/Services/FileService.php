<?php

namespace Modules\Updater\Services;

use Exception;
use Illuminate\Support\Facades\DB;
use ZipArchive;
use Illuminate\Support\Facades\Log;

class FileService
{
   /**
    * Check if file should be skipped during backup
    */
   public function shouldSkipFile($relativePath)
   {
      $skipPatterns = [
         // 'storage/logs/',
         // 'storage/framework/cache/',
         // 'storage/framework/sessions/',
         // 'storage/framework/views/',
         // 'vendor/',
         // '.env.example',
         'storage/app/backups/',
         'node_modules/',
         'demo/',
         '.git/',
         '.github/',
         '.env',
      ];

      // File extension patterns to skip
      $skipExtensions = [
         '*.log',
         '*.zip',
         '*.tar',
         '*.rar',
         '*.gz',
         '*.bz2',
         '*.7z',
      ];

      // Check directory/path patterns
      foreach ($skipPatterns as $pattern) {
         if (strpos($relativePath, $pattern) === 0) {
            return true;
         }
      }

      // Check file extension patterns
      foreach ($skipExtensions as $pattern) {
         if (fnmatch($pattern, basename($relativePath))) {
            return true;
         }
      }

      // Also skip common backup/archive files in root
      $filename = basename($relativePath);
      $rootArchivePatterns = [
         'backup_*.zip',
         'backup_*.tar',
         'backup_*.gz',
         '*.backup',
         'dump_*.sql',
         'export_*.sql',
      ];

      foreach ($rootArchivePatterns as $pattern) {
         if (fnmatch($pattern, $filename)) {
            return true;
         }
      }

      return false;
   }

   /**
    * Extract source code backup to root directory
    */
   public function extractSourceCodeBackup($sourceCodeZipPath, $rootPath)
   {
      $zip = new ZipArchive();
      if ($zip->open($sourceCodeZipPath) !== TRUE) {
         throw new \Exception('Cannot open source code backup file');
      }

      if (!$zip->extractTo($rootPath)) {
         throw new \Exception('Failed to extract source code backup');
      }

      $zip->close();
   }

   /**
    * Extract and restore database backup (shared hosting compatible)
    */
   public function restoreDatabaseBackup($databaseZipPath, $tempDir)
   {
      // Extract database ZIP
      $zip = new ZipArchive();
      if ($zip->open($databaseZipPath) !== TRUE) {
         throw new \Exception('Cannot open database backup file');
      }

      if (!$zip->extractTo($tempDir)) {
         throw new \Exception('Failed to extract database backup');
      }
      $zip->close();

      // Find the SQL file
      $sqlFiles = glob($tempDir . '/*.sql');
      if (empty($sqlFiles)) {
         throw new \Exception('No SQL file found in database backup');
      }

      $sqlFilePath = $sqlFiles[0];

      // Import database using PHP (shared hosting compatible)
      $this->importSQLFileUsingPHP($sqlFilePath);
   }

   /**
    * Import SQL file using PHP (shared hosting compatible)
    */
   private function importSQLFileUsingPHP($sqlFilePath)
   {
      // Read SQL file
      $sql = file_get_contents($sqlFilePath);

      if (!$sql) {
         throw new \Exception('Could not read SQL backup file');
      }

      // Split SQL into statements
      $statements = $this->splitSQLStatements($sql);

      // Execute each statement
      foreach ($statements as $statement) {
         $statement = trim($statement);

         if (empty($statement) || strpos($statement, '--') === 0) {
            continue; // Skip empty lines and comments
         }

         try {
            DB::unprepared($statement);
         } catch (\Exception $e) {
            // Log the error but continue with other statements
            Log::warning("SQL statement failed during restore: " . $e->getMessage(), [
               'statement' => substr($statement, 0, 100) . '...'
            ]);
         }
      }
   }

   /**
    * Split SQL content into individual statements
    */
   private function splitSQLStatements($sql)
   {
      // Remove comments and normalize line endings
      $sql = preg_replace('/^--.*$/m', '', $sql);
      $sql = str_replace(["\r\n", "\r"], "\n", $sql);

      // Split by semicolon followed by newline
      $statements = preg_split('/;\s*\n/', $sql);

      // Filter out empty statements
      return array_filter($statements, function ($statement) {
         return !empty(trim($statement));
      });
   }

   /**
    * Recursively remove directory and its contents
    */
   public function removeDirectory($dir)
   {
      if (!file_exists($dir)) {
         return;
      }

      $files = array_diff(scandir($dir), array('.', '..'));
      foreach ($files as $file) {
         $path = $dir . '/' . $file;
         is_dir($path) ? $this->removeDirectory($path) : unlink($path);
      }

      rmdir($dir);
   }
}
