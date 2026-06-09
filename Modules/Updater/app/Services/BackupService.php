<?php

namespace Modules\Updater\Services;

use Exception;
use ZipArchive;
use Modules\Updater\Models\Backup;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class BackupService extends FileService
{
   public function createBackup($backupName, $sourceCodeSize, $estimatedDatabaseSize)
   {
      $backup = Backup::create([
         'backup_name' => $backupName,
         'source_code_zip' => $backupName . '_source_code.zip',
         'database_zip' => $backupName . '_database.zip',
         'source_code_size' => $sourceCodeSize,
         'database_size' => $estimatedDatabaseSize,
         'status' => 'completed',
         'notes' => 'Full application backup created successfully',
      ]);

      return $backup;
   }

   /**
    * Create source code backup as ZIP
    */
   public function createSourceCodeBackup($backupName, $backupDir)
   {
      $zipPath = $backupDir . '/' . $backupName . '_source_code.zip';
      $zip = new ZipArchive();

      if ($zip->open($zipPath, ZipArchive::CREATE | ZipArchive::OVERWRITE) !== TRUE) {
         throw new Exception('Cannot create source code zip file');
      }

      $rootPath = base_path();
      $iterator = new \RecursiveIteratorIterator(
         new \RecursiveDirectoryIterator($rootPath),
         \RecursiveIteratorIterator::LEAVES_ONLY
      );

      foreach ($iterator as $file) {
         if (!$file->isDir()) {
            $filePath = $file->getRealPath();
            $relativePath = substr($filePath, strlen($rootPath) + 1);

            // Skip backup directory, storage/logs, node_modules, .git, etc.
            if ($this->shouldSkipFile($relativePath)) {
               continue;
            }

            $zip->addFile($filePath, $relativePath);
         }
      }

      $zip->close();
      return $zipPath;
   }

   /**
    * Create database backup as ZIP (shared hosting compatible)
    */
   public function createDatabaseBackup($backupName, $backupDir)
   {
      $sqlPath = $backupDir . '/' . $backupName . '_database.sql';
      $zipPath = $backupDir . '/' . $backupName . '_database.zip';

      try {
         // Create SQL dump using PHP (compatible with shared hosting)
         $this->createSQLDump($sqlPath);

         // Create ZIP file for database
         $zip = new ZipArchive();
         if ($zip->open($zipPath, ZipArchive::CREATE | ZipArchive::OVERWRITE) !== TRUE) {
            throw new Exception('Cannot create database zip file');
         }

         $zip->addFile($sqlPath, basename($sqlPath));
         $zip->close();

         // Remove the SQL file, keep only ZIP
         unlink($sqlPath);

         return $zipPath;
      } catch (\Exception $e) {
         // Clean up files on error
         if (file_exists($sqlPath)) {
            unlink($sqlPath);
         }
         if (file_exists($zipPath)) {
            unlink($zipPath);
         }
         throw new Exception('Database backup failed: ' . $e->getMessage());
      }
   }

   /**
    * Restore application from backup files
    */
   public function restoreFromBackup($sourceCodeZipPath, $databaseZipPath)
   {
      $rootPath = base_path();
      $tempDir = storage_path('app/temp_restore');

      try {
         // Create temporary directory for database restoration
         if (!file_exists($tempDir)) {
            mkdir($tempDir, 0755, true);
         }

         // Step 1: Extract source code backup (overwrites existing files)
         $this->extractSourceCodeBackup($sourceCodeZipPath, $rootPath);

         // Step 2: Extract and restore database backup
         $this->restoreDatabaseBackup($databaseZipPath, $tempDir);

         // Clean up temporary directory
         $this->removeDirectory($tempDir);
      } catch (\Exception $e) {
         // Clean up on failure
         if (file_exists($tempDir)) {
            $this->removeDirectory($tempDir);
         }
         throw $e;
      }
   }

   /**
    * Delete backup from database and filesystem
    */
   public function deleteFromBackup($id)
   {
      // Find the backup record
      $backup = Backup::findOrFail($id);
      $backupDir = storage_path('app/backups');

      // Delete physical files
      $sourceCodePath = $backupDir . '/' . $backup->source_code_zip;
      $databasePath = $backupDir . '/' . $backup->database_zip;

      $deletedFiles = [];
      $failedFiles = [];

      // Delete source code ZIP
      if (file_exists($sourceCodePath)) {
         if (unlink($sourceCodePath)) {
            $deletedFiles[] = $backup->source_code_zip;
         } else {
            $failedFiles[] = $backup->source_code_zip;
         }
      } else {
         $failedFiles[] = $backup->source_code_zip . ' (not found)';
      }

      // Delete database ZIP
      if (file_exists($databasePath)) {
         if (unlink($databasePath)) {
            $deletedFiles[] = $backup->database_zip;
         } else {
            $failedFiles[] = $backup->database_zip;
         }
      } else {
         $failedFiles[] = $backup->database_zip . ' (not found)';
      }

      // Delete database record
      $backup->delete();

      return $backup;
   }

   /**
    * Estimate database backup size before creating it
    */
   public function estimateDatabaseBackupSize()
   {
      try {
         $dbName = config('database.connections.mysql.database');

         // Get total database size in bytes
         $result = DB::select("
             SELECT 
                ROUND(SUM(data_length + index_length)) as size_bytes
             FROM information_schema.tables 
             WHERE table_schema = ?
          ", [$dbName]);

         $databaseSizeBytes = $result[0]->size_bytes ?? 0;

         return $databaseSizeBytes;
      } catch (\Exception $e) {
         // If estimation fails, return a reasonable default (5MB)
         return 5 * 1024 * 1024;
      }
   }

   /**
    * Create SQL dump using PHP (shared hosting compatible)
    */
   private function createSQLDump($sqlPath)
   {
      $dbName = config('database.connections.mysql.database');

      // Get all tables
      $tables = DB::select('SHOW TABLES');
      $tableKey = 'Tables_in_' . $dbName;

      $sql = "-- Database: {$dbName}\n";
      $sql .= "-- Generated on: " . date('Y-m-d H:i:s') . "\n";
      $sql .= "-- PHP Version: " . phpversion() . "\n\n";
      $sql .= "SET SQL_MODE = \"NO_AUTO_VALUE_ON_ZERO\";\n";
      $sql .= "START TRANSACTION;\n";
      $sql .= "SET time_zone = \"+00:00\";\n\n";

      foreach ($tables as $table) {
         $tableName = $table->$tableKey;

         // Skip certain system tables if needed
         if (in_array($tableName, ['sessions', 'cache', 'cache_locks'])) {
            continue;
         }

         $sql .= $this->getDumpForTable($tableName);
      }

      $sql .= "COMMIT;\n";

      // Write to file
      file_put_contents($sqlPath, $sql);
   }

   /**
    * Generate SQL dump for a specific table
    */
   private function getDumpForTable($tableName)
   {
      $sql = "\n-- --------------------------------------------------------\n";
      $sql .= "-- Table structure for table `{$tableName}`\n";
      $sql .= "-- --------------------------------------------------------\n\n";

      // Get CREATE TABLE statement
      $createTable = DB::select("SHOW CREATE TABLE `{$tableName}`")[0];
      $sql .= "DROP TABLE IF EXISTS `{$tableName}`;\n";
      $sql .= $createTable->{'Create Table'} . ";\n\n";

      // Get table data
      $sql .= "-- Dumping data for table `{$tableName}`\n\n";

      $rows = DB::table($tableName)->get();

      if ($rows->count() > 0) {
         $sql .= "INSERT INTO `{$tableName}` (";

         // Get column names
         $columns = array_keys((array)$rows->first());
         $sql .= "`" . implode("`, `", $columns) . "`";
         $sql .= ") VALUES\n";

         $values = [];
         foreach ($rows as $row) {
            $rowData = (array)$row;
            $escapedValues = array_map(function ($value) {
               if ($value === null) {
                  return 'NULL';
               }
               return "'" . addslashes($value) . "'";
            }, $rowData);
            $values[] = "(" . implode(", ", $escapedValues) . ")";
         }

         $sql .= implode(",\n", $values) . ";\n\n";
      }

      return $sql;
   }
}
