<?php

namespace Modules\Exam\Services;

use Modules\Exam\Models\Exam;
use App\Models\ChunkedUpload;
use Modules\Exam\Models\ExamResource;
use App\Services\MediaService;
use App\Services\LocalFileUploadService;
use App\Services\S3MultipartUploadService;

class ExamResourceService
{
   protected LocalFileUploadService | S3MultipartUploadService $uploaderService;

   public function __construct()
   {
      $this->uploaderService = config('filesystems.default') === 's3' ? new S3MultipartUploadService() : new LocalFileUploadService();
   }

   public function resourceStore(array $data): ExamResource
   {
      if ($data['type'] === 'link') {
         $resource = ExamResource::create($data);
      } else {
         $resource = ExamResource::create([...$data, 'resource' => $data['resource_url']]);
      }

      return $resource;
   }

   public function resourceUpdate(ExamResource $resource, array $data): bool
   {
      if ($data['type'] === 'link') {
         $resource->update($data);
      } else {
         $chunkedUpload = ChunkedUpload::where('file_url', $data['resource'])->first();
         $chunkedUpload && $this->uploaderService->deleteFile($chunkedUpload);

         $resource->update([...$data, 'resource' => $data['resource_url']]);
      }

      return true;
   }

   public function resourceDelete(ExamResource $resource): bool
   {
      $chunkedUpload = ChunkedUpload::where('file_url', $resource->resource)->first();
      $chunkedUpload && $this->uploaderService->deleteFile($chunkedUpload);

      $resource->delete();

      return true;
   }

   public function getExamResources(string $exam_id)
   {
      $exam = Exam::find($exam_id);
      if (!$exam) {
         return [];
      }

      // Get media files from Spatie Media Library
      $media = $exam->getMedia('resources');

      if (!$media) {
         return [];
      }

      // Convert media collection to array format
      return $media->map(function ($item) {
         return [
            'id' => $item->id,
            'name' => $item->name,
            'file_name' => $item->file_name,
            'mime_type' => $item->mime_type,
            'size' => $item->size,
            'url' => $item->getUrl(),
            'getUrl' => $item->getUrl(),
         ];
      })->toArray();
   }
}
