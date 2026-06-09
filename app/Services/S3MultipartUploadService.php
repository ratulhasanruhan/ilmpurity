<?php

namespace App\Services;

use App\Models\ChunkedUpload;
use Aws\S3\S3Client;
use Aws\S3\Exception\S3Exception;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class S3MultipartUploadService
{
    protected string $bucket;
    protected S3Client $s3Client;

    public function __construct()
    {
        $this->s3Client = new S3Client([
            'credentials' => [
                'key'    => config('filesystems.disks.s3.key'),
                'secret' => config('filesystems.disks.s3.secret'),
            ],
            'region' => config('filesystems.disks.s3.region'),
            'version' => 'latest',
        ]);

        $this->bucket = config('filesystems.disks.s3.bucket');
    }

    /**
     * Initialize multipart upload
     *
     * @param string $filename Original filename
     * @param string $mimeType Mime type of the file
     * @param int $fileSize Total file size
     * @param int $userId User ID
     * @param array $metadata Additional metadata
     * @return ChunkedUpload
     */
    // In S3MultipartUploadService.php
    public function initiateUpload(string $filename, string $mimeType, int $fileSize, int $userId, array $metadata = []): ChunkedUpload
    {
        try {
            // Generate a unique file path for S3
            $extension = pathinfo($filename, PATHINFO_EXTENSION);
            $s3Key = 'lessons/' . Str::uuid() . '.' . $extension;

            // Create multipart upload request
            $result = $this->s3Client->createMultipartUpload([
                'Bucket' => $this->bucket,
                'Key' => $s3Key,
                'ContentType' => $mimeType,
                'ACL' => 'private',
            ]);

            // Create record in database
            // 'file_url' => 'https://uilib-lms.s3.us-east-1.amazonaws.com' . $s3Key,
            $uploadRecord = ChunkedUpload::create([
                'user_id' => $userId,
                'filename' => $s3Key,
                'original_filename' => $filename,
                'file_path' => $s3Key,
                'disk' => 's3',
                'mime_type' => $mimeType,
                'size' => $fileSize,
                'upload_id' => $result['UploadId'],
                'key' => $s3Key,
                'status' => 'initialized',
                'chunks_completed' => 0,
                'total_chunks' => 0,
                'metadata' => $metadata,
            ]);

            return $uploadRecord;
        } catch (S3Exception $e) {
            Log::error('S3 multipart upload initialization error: ' . $e->getMessage());
            throw $e;
        }
    }

    /**
     * Upload a part of the file
     *
     * @param ChunkedUpload $upload Upload record
     * @param int $partNumber Part number (1-based)
     * @param string $partContent Content of the part
     * @return array Part information for completing the upload
     */
    public function uploadPart(ChunkedUpload $upload, int $partNumber, string $partContent): array
    {
        try {
            // Upload the part
            $result = $this->s3Client->uploadPart([
                'Bucket' => $this->bucket,
                'Key' => $upload->key,
                'UploadId' => $upload->upload_id,
                'PartNumber' => $partNumber,
                'Body' => $partContent,
            ]);

            // Update upload record
            $upload->increment('chunks_completed');

            // Return part information for completing the upload later
            return [
                'PartNumber' => $partNumber,
                'ETag' => $result['ETag'],
            ];
        } catch (S3Exception $e) {
            Log::error('S3 multipart upload part error: ' . $e->getMessage());
            throw $e;
        }
    }

    /**
     * Complete multipart upload
     *
     * @param ChunkedUpload $upload Upload record
     * @param array $parts Array of part information from uploadPart()
     * @return bool
     */
    public function completeUpload(ChunkedUpload $upload, array $parts): bool
    {
        try {
            // Complete the multipart upload
            $this->s3Client->completeMultipartUpload([
                'Bucket' => $this->bucket,
                'Key' => $upload->key,
                'UploadId' => $upload->upload_id,
                'MultipartUpload' => [
                    'Parts' => $parts
                ],
            ]);

            // Generate the S3 URL
            $region = config('filesystems.disks.s3.region');
            $s3Url = "https://{$this->bucket}.s3.{$region}.amazonaws.com/{$upload->key}";

            // Update upload record
            $upload->update([
                'status' => 'completed',
                'file_url' => $s3Url,
            ]);

            return true;
        } catch (S3Exception $e) {
            Log::error('S3 multipart upload completion error: ' . $e->getMessage());
            $upload->update(['status' => 'failed']);
            throw $e;
        }
    }

    /**
     * Abort multipart upload
     *
     * @param ChunkedUpload $upload Upload record
     * @return bool
     */
    public function abortUpload(ChunkedUpload $upload): bool
    {
        try {
            if ($upload->upload_id) {
                $this->s3Client->abortMultipartUpload([
                    'Bucket' => $this->bucket,
                    'Key' => $upload->key,
                    'UploadId' => $upload->upload_id,
                ]);
            }

            // Update upload record
            $upload->update([
                'status' => 'aborted',
            ]);

            return true;
        } catch (S3Exception $e) {
            Log::error('S3 multipart upload abort error: ' . $e->getMessage());
            return false;
        }
    }


    /**
     * Delete a file from S3
     *
     * @param string $key The S3 file path/key to delete
     * @return bool True on success, false on failure
     */
    public function deleteFile(ChunkedUpload $upload): bool
    {
        // Clean up any remaining chunks
        $this->abortUpload($upload);

        $result = $this->s3Client->deleteObject([
            'Bucket' => $this->bucket,
            'Key' => $upload->key
        ]);

        if ($result) {
            $upload->delete();
            return true;
        }

        return false;
    }
}
