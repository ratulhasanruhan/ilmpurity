<?php

namespace App\Services\Course;

use App\Models\ChunkedUpload;
use App\Models\Course\Course;
use App\Models\Course\CourseSection;
use App\Models\Course\SectionLesson;
use App\Models\Course\WatchHistory;
use App\Services\MediaService;
use App\Services\Course\CoursePlayerService;
use App\Services\LocalFileUploadService;
use App\Services\S3MultipartUploadService;

class CourseSectionService extends MediaService
{
   protected LocalFileUploadService | S3MultipartUploadService $uploaderService;

   public function __construct()
   {
      $this->uploaderService = config('filesystems.default') === 's3' ? new S3MultipartUploadService() : new LocalFileUploadService();
   }

   function createSection(array $data, string $user_id): CourseSection
   {
      return CourseSection::create([...$data, 'user_id' => $user_id]);
   }

   function updateSection(string $id, array $data): bool
   {
      return CourseSection::find($id)->update($data);
   }

   function deleteSection(string $id): bool
   {
      return CourseSection::find($id)->delete();
   }

   function sortSections(array $sortedData): bool
   {
      foreach ($sortedData as $value) {
         CourseSection::where('id', $value['id'])
            ->update(['sort' => $value['sort']]);
      }

      return true;
   }

   function createSectionLesson(array $data, string $user_id): SectionLesson
   {
      $lesson = SectionLesson::create($data);

      $this->lessonHandler($lesson, $data);

      $this->initWatchHistory($data['course_id'], 'lesson', $user_id);

      return $lesson;
   }

   function updateSectionLesson(string $id, array $data): SectionLesson
   {
      $lesson = SectionLesson::find($id);

      $this->lessonHandler($lesson, $data);

      return $lesson;
   }

   function deleteSectionLesson(string $id): bool
   {
      $lesson = SectionLesson::findOrFail($id);

      $lesson_id = $lesson->id;
      $course_id = $lesson->course_id;
      $lesson_sort = $lesson->sort;
      $course_section_id = $lesson->course_section_id;

      // Get the current section to get its sort order
      $currentSection = CourseSection::find($course_section_id);

      if ($lesson->lesson_src) {
         $chunkedUpload = ChunkedUpload::where('file_url', $lesson->lesson_src)->first();
         $chunkedUpload && $this->uploaderService->deleteFile($chunkedUpload);
      }

      $lesson->delete();
      $lessons = SectionLesson::where('course_id', $course_id)->get();

      if ($lessons->count() <= 0) {
         WatchHistory::where('course_id', $course_id)->delete();
         return true;
      }

      // Get all watch histories for this course
      $histories = WatchHistory::where('course_id', $course_id)->get();

      foreach ($histories as $history) {
         if ($history) {
            $updateNeeded = false;

            // 1. Remove from completed_watching if exists
            $completedWatching = json_decode($history->completed_watching, true) ?? [];
            $originalCount = count($completedWatching);
            $completedWatching = array_filter($completedWatching, function ($item) use ($lesson_id) {
               return $item['id'] != $lesson_id;
            });

            if (count($completedWatching) !== $originalCount) {
               $history->completed_watching = !empty($completedWatching) ? json_encode(array_values($completedWatching)) : null;
               $updateNeeded = true;
            }

            // 2. Handle current_watching_id and next_watching_id updates
            if ($history->current_watching_id == $lesson_id) {
               // First try to find the next lesson in the same section
               $nextLesson = SectionLesson::where('course_section_id', $course_section_id)
                  ->where('sort', '>', $lesson_sort)
                  ->orderBy('sort', 'asc')
                  ->first();

               // If no next lesson in same section, try first lesson in next section
               if (!$nextLesson && $currentSection) {
                  $nextSection = CourseSection::where('course_id', $course_id)
                     ->where('sort', '>', $currentSection->sort)
                     ->orderBy('sort', 'asc')
                     ->first();

                  if ($nextSection) {
                     $nextLesson = SectionLesson::where('course_section_id', $nextSection->id)
                        ->orderBy('sort', 'asc')
                        ->first();
                  }
               }

               // If still no next lesson, try previous lesson in same section
               if (!$nextLesson) {
                  $nextLesson = SectionLesson::where('course_section_id', $course_section_id)
                     ->where('sort', '<', $lesson_sort)
                     ->orderBy('sort', 'desc')
                     ->first();
               }

               // If still no lesson found, try any lesson in the course
               if (!$nextLesson) {
                  $nextLesson = SectionLesson::where('course_id', $course_id)
                     ->where('id', '!=', $lesson_id)
                     ->orderBy('sort', 'asc')
                     ->first();
               }

               if ($nextLesson) {
                  $history->current_watching_id = $nextLesson->id;
                  $history->current_watching_type = 'lesson';
                  $history->current_section_id = $nextLesson->course_section_id;
               } else {
                  $history->current_watching_id = null;
                  $history->current_watching_type = null;
                  $history->current_section_id = null;
               }
               $updateNeeded = true;
            }

            // 3. Update next_watching_id if it matches the deleted lesson
            if ($history->next_watching_id == $lesson_id) {
               // First try to find next lesson in sort order
               $nextLesson = SectionLesson::where('course_id', $course_id)
                  ->where('sort', '>', $lesson_sort)
                  ->orderBy('sort', 'asc')
                  ->first();

               // If no next lesson, try previous lesson
               if (!$nextLesson) {
                  $nextLesson = SectionLesson::where('course_id', $course_id)
                     ->where('sort', '<', $lesson_sort)
                     ->orderBy('sort', 'desc')
                     ->first();
               }


               // If still no lesson found, try any lesson in the course
               if (!$nextLesson) {
                  $nextLesson = SectionLesson::where('course_id', $course_id)
                     ->where('id', '!=', $lesson_id)
                     ->orderBy('sort', 'asc')
                     ->first();
               }


               if ($nextLesson) {
                  $history->next_watching_id = $nextLesson->id;
                  $history->next_watching_type = 'lesson';
               } else {
                  $history->next_watching_id = null;
                  $history->next_watching_type = null;
               }
               $updateNeeded = true;
            }

            // 4. Update prev_watching_id if it matches the deleted lesson
            if ($history->prev_watching_id == $lesson_id && $history->prev_watching_type === 'lesson') {
               // Find the lesson before the deleted one
               $prevLesson = SectionLesson::where('course_id', $course_id)
                  ->where('sort', '<', $lesson_sort)
                  ->orderBy('sort', 'desc')
                  ->first();


               if ($prevLesson) {
                  $history->prev_watching_id = $prevLesson->id;
                  $history->prev_watching_type = 'lesson';
               } else {
                  // If no previous lesson, set to null
                  $history->prev_watching_id = null;
                  $history->prev_watching_type = null;
               }
               $updateNeeded = true;
            }

            if ($updateNeeded) {
               $history->save();
            }
         }
      }

      return true;
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

   private function lessonHandler(SectionLesson $lesson, array $data): SectionLesson
   {
      $updatedLesson = $data;

      switch ($data['lesson_type']) {
         case 'image':
         case 'document':
         case 'video':
            if (array_key_exists('lesson_src_new', $data) && $data['lesson_src_new']) {
               $embedCode = '<iframe src="' . $data['lesson_src_new'] . '" width="100%" height="500" frameborder="0" allowfullscreen></iframe>';

               $chunkedUpload = ChunkedUpload::where('file_url', $lesson->lesson_src)->first();
               $chunkedUpload && $this->uploaderService->deleteFile($chunkedUpload);

               $updatedLesson = [
                  ...$updatedLesson,
                  'lesson_src' => $data['lesson_src_new'],
                  'embed_source' => $embedCode,
               ];
            }

            break;

         // case 'video_url':
         //    $safeUrl = htmlspecialchars($data['lesson_src'], ENT_QUOTES, 'UTF-8');

         //    $updatedLesson = [
         //       ...$updatedLesson,
         //       'lesson_src' => $safeUrl,
         //    ];
         //    break;

         case 'embed':
            $updatedLesson = [
               ...$updatedLesson,
               'lesson_src' => $data['embed_source'],
            ];

            break;

         default:
            $updatedLesson = $data;

            break;
      }

      $lesson->update($updatedLesson);

      return $lesson;
   }

   public function initWatchHistory(string $course_id, string $watching_type, string $user_id): ?WatchHistory
   {
      $lesson = SectionLesson::query()->where('course_id', $course_id);
      $history = WatchHistory::where('course_id', $course_id)
         ->where('user_id', $user_id)
         ->first();

      if ($lesson->count() >= 0 && !$history) {
         $lesson = $lesson->orderBy('sort', 'asc')->first();

         $coursePlay = new CoursePlayerService();
         $course = Course::where('id', $course_id)->with('sections')->first();

         return $coursePlay->watchHistory($course, $lesson->id, $watching_type, $user_id);
      }

      return $history;
   }

   /**
    * Extract YouTube video ID from URL
    * 
    * @param string $url
    * @return string|null
    */
   protected function extractYouTubeVideoId(string $url): ?string
   {
      $pattern = '/(youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/';

      if (preg_match($pattern, $url, $matches)) {
         return $matches[2];
      }

      return null;
   }
}
