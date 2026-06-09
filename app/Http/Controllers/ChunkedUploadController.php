<?php

namespace App\Http\Controllers;

use App\Http\Requests\ChunkInitiateRequest;
use App\Http\Requests\ChunkUploadRequest;
use App\Models\ChunkedUpload;
use App\Services\LocalFileUploadService;
use App\Services\S3MultipartUploadService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class ChunkedUploadController extends Controller
{
    /**
     * Determine which upload service to use based on request or config
     */
    private function getUploadService(Request $request): S3MultipartUploadService | LocalFileUploadService
    {
        $storage = $request->input('storage');

        $storageType = 'local';

        if (empty($storage)) {
            $storageType = config('filesystems.default');
        } else {
            $storageType = $storage;
        }

        return $storageType === 's3' ? new S3MultipartUploadService() : new LocalFileUploadService();
    }

    /**
     * Initialize a new chunked upload
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function initialize(ChunkInitiateRequest $request)
    {
        try {
            $uploaderService = $this->getUploadService($request);

            $metadata = [
                'filetype' => $request->filetype,
                'course_id' => $request->course_id,
                'course_section_id' => $request->course_section_id,
            ];

            // Initialize the upload in the database and S3
            $upload = $uploaderService->initiateUpload(
                $request->input('filename'),
                $request->input('mimetype'),
                $request->input('filesize'),
                Auth::id(),
                $metadata
            );

            // Update total chunks
            $upload->update(['total_chunks' => $request->total_chunks]);

            return response()->json([
                'success' => true,
                'key' => $upload->key,
                'upload_id' => $upload->id,
                'aws_upload_id' => $upload->upload_id,
                'message' => 'Upload initialized successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to initialize upload: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Upload a chunk of the file
     *
     * @param Request $request
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function uploadChunk(ChunkUploadRequest $request, $id)
    {
        try {
            // Find the upload record
            $upload = ChunkedUpload::where('id', $id)
                ->where('user_id', Auth::id())
                ->where('status', '!=', 'completed')
                ->firstOrFail();

            // Determine upload service based on the stored disk type
            $uploaderService = $this->getUploadService($request);

            // Get part number
            $partNumber = $request->input('part_number');

            // Process the base64 encoded data
            // Remove the data URL prefix (e.g., "data:image/png;base64,")
            $encodedData = $request->input('chunk_data');
            $base64Content = substr($encodedData, strpos($encodedData, ',') + 1);

            // Decode the base64 data
            $chunk = base64_decode($base64Content);

            if (!$chunk) {
                return response()->json([
                    'success' => false,
                    'message' => 'Failed to decode base64 chunk data'
                ], 400);
            }

            // Upload the part to S3
            $part = $uploaderService->uploadPart($upload, $partNumber, $chunk);

            // Store part information in the database (for completing the upload later)
            DB::table('chunked_upload_parts')->insert([
                'upload_id' => $upload->id,
                'part_number' => $partNumber,
                'etag' => $part['ETag'],
                'size' => strlen($chunk),
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            return response()->json([
                'success' => true,
                'part_number' => $partNumber,
                'percentage' => $upload->percentCompleted(),
                'chunks_completed' => $upload->chunks_completed,
                'message' => 'Chunk uploaded successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to upload chunk: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Complete the chunked upload
     *
     * @param Request $request
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function complete(Request $request, $id)
    {
        try {
            // Determine upload service based on the stored disk type
            $uploaderService = $this->getUploadService($request);

            // Find the upload record
            $upload = ChunkedUpload::where('id', $id)
                ->where('user_id', Auth::id())
                ->firstOrFail();

            if ($upload->status === 'completed') {
                return response()->json([
                    'success' => true,
                    'message' => 'Upload already completed',
                    'file_path' => $upload->file_path,
                ]);
            }

            if ($upload->chunks_completed < $upload->total_chunks) {
                return response()->json([
                    'success' => false,
                    'message' => 'Cannot complete upload, not all chunks have been uploaded'
                ], 422);
            }

            // Get all parts from database
            $parts = DB::table('chunked_upload_parts')
                ->where('upload_id', $upload->id)
                ->orderBy('part_number')
                ->get()
                ->map(function ($part) {
                    return [
                        'PartNumber' => $part->part_number,
                        'ETag' => $part->etag,
                    ];
                })
                ->toArray();

            // Complete the upload
            $uploaderService->completeUpload($upload, $parts);

            // After successful completion
            DB::table('chunked_upload_parts')
                ->where('upload_id', $upload->id)
                ->delete();

            // Return file information
            return response()->json([
                'success' => true,
                'message' => 'Upload completed successfully',
                'file_path' => $upload->file_path,
                'file_url' => $upload->file_url,
                'mime_type' => $upload->mime_type,
                'file_name' => $upload->original_filename,
                'file_size' => $upload->size,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to complete upload: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Check upload status
     *
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function status($id)
    {
        try {
            // Find the upload record
            $upload = ChunkedUpload::where('id', $id)
                ->where('user_id', Auth::id())
                ->firstOrFail();

            return response()->json([
                'success' => true,
                'status' => $upload->status,
                'chunks_completed' => $upload->chunks_completed,
                'total_chunks' => $upload->total_chunks,
                'percentage' => $upload->percentCompleted(),
                'file_path' => $upload->status === 'completed' ? $upload->file_path : null,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to check upload status: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Abort upload
     *
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function abort(Request $request, $id)
    {
        try {
            // Find the upload record
            $upload = ChunkedUpload::where('id', $id)
                ->where('user_id', Auth::id())
                ->firstOrFail();

            // Determine upload service based on the stored disk type
            $uploaderService = $this->getUploadService($request);

            // Abort the upload
            $uploaderService->abortUpload($upload);

            return response()->json([
                'success' => true,
                'message' => 'Upload aborted successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to abort upload: ' . $e->getMessage()
            ], 500);
        }
    }
}
