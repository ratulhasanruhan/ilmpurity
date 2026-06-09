<?php

namespace App\Services\Course;

use App\Models\ChunkedUpload;
use App\Models\Course\LessonResource;
use App\Models\Course\SectionLesson;
use App\Services\MediaService;
use App\Services\LocalFileUploadService;
use App\Services\S3MultipartUploadService;

class LessonResourceService extends MediaService
{
   protected LocalFileUploadService | S3MultipartUploadService $uploaderService;

   public function __construct()
   {
      $this->uploaderService = config('filesystems.default') === 's3' ? new S3MultipartUploadService() : new LocalFileUploadService();
   }

   function sortSectionLessons(array $sortedData): bool
   {
      foreach ($sortedData as $value) {
         SectionLesson::where('id', $value['id'])->update([
            'sort' => $value['sort']
         ]);
      }

      return true;
   }

   public function resourceStore(array $data): LessonResource
   {
      if ($data['type'] === 'link') {
         $resource = LessonResource::create($data);
      } else {
         $resource = LessonResource::create([...$data, 'resource' => $data['resource_url']]);
      }

      return $resource;
   }

   public function resourceUpdate(LessonResource $resource, array $data): bool
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

   public function resourceDelete(LessonResource $resource): bool
   {
      $chunkedUpload = ChunkedUpload::where('file_url', $resource->resource)->first();
      $chunkedUpload && $this->uploaderService->deleteFile($chunkedUpload);

      $resource->delete();

      return true;
   }
}
