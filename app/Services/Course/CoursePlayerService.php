<?php

namespace App\Services\Course;

use App\Models\Course\Course;
use App\Models\Course\CourseCertificate;
use App\Models\Course\SectionLesson;
use App\Models\Course\SectionQuiz;
use App\Models\Course\WatchHistory;
use App\Models\User;
use Illuminate\Support\Facades\Auth;

class CoursePlayerService
{
   function getWatchingLesson(string $lesson_id, string $watching_type): SectionLesson | SectionQuiz
   {
      $user = Auth::user();

      return $watching_type === 'lesson' ?
         SectionLesson::with([
            'resources',
            'forums' => function ($query) {
               $query->with([
                  'user',
                  'replies' => function ($replies) {
                     $replies->with(['user']);
                  },
               ]);
            },
         ])->find($lesson_id) :
         SectionQuiz::with([
            'quiz_questions',
            'quiz_submissions' => function ($query) use ($user) {
               $query->where('user_id', $user->id);
            }
         ])->find($lesson_id);
   }

   function getWatchHistory(string $course_id, ?string $user_id): ?WatchHistory
   {
      if ($user_id) {
         return WatchHistory::where('course_id', $course_id)
            ->where('user_id', $user_id)
            ->first();
      } else {
         return null;
      }
   }

   function watchHistory(Course $course, string $watching_id, string $watching_type, string $user_id): WatchHistory
   {
      // Get or create watch history
      $watchHistory = WatchHistory::where('course_id', $course->id)
         ->where('user_id', $user_id)
         ->first();

      // Find current section, next item, and previous item
      $nextItem = null;
      $prevItem = null;
      $currentSection = null;
      $foundCurrent = false;

      // Create a flat list of all content items with their section info and proper ordering
      $allItems = [];
      $globalOrder = 0;

      foreach ($course->sections as $sectionIndex => $section) {
         // Add lessons first (maintaining their lesson_number order within section)
         $sectionLessons = $section->section_lessons->sortBy('lesson_number');
         foreach ($sectionLessons as $lesson) {
            $allItems[] = [
               'id' => $lesson->id,
               'type' => 'lesson',
               'section' => $section,
               'section_index' => $sectionIndex,
               'lesson_number' => $lesson->lesson_number,
               'global_order' => $globalOrder++
            ];
         }

         // Add quizzes after all lessons in the section
         foreach ($section->section_quizzes as $quiz) {
            $allItems[] = [
               'id' => $quiz->id,
               'type' => 'quiz',
               'section' => $section,
               'section_index' => $sectionIndex,
               'lesson_number' => 999999, // High number to put after lessons
               'global_order' => $globalOrder++
            ];
         }
      }

      // Items are already in the correct order due to global_order, no sorting needed

      // Find current item and determine next/previous
      for ($i = 0; $i < count($allItems); $i++) {
         if ((string)$allItems[$i]['id'] === (string)$watching_id && $allItems[$i]['type'] === $watching_type) {
            $currentSection = $allItems[$i]['section'];

            // Set previous item
            if ($i > 0) {
               $prevItem = [
                  'id' => $allItems[$i - 1]['id'],
                  'type' => $allItems[$i - 1]['type']
               ];
            }

            // Set next item  
            if ($i < count($allItems) - 1) {
               $nextItem = [
                  'id' => $allItems[$i + 1]['id'],
                  'type' => $allItems[$i + 1]['type']
               ];
            }
            break;
         }
      }

      if ($watchHistory) {
         $completedItems = json_decode($watchHistory->completed_watching, true) ?: [];
         $previousItemId = $watchHistory->current_watching_id;
         $previousItemType = $watchHistory->current_watching_type;

         // Mark previous item as completed when moving to a new item
         if ($previousItemId && $previousItemId != $watching_id) {
            $previousItemToComplete = [
               'id' => $previousItemId,
               'type' => $previousItemType,
            ];

            // Check if item is not already in completed items using array_filter
            $isDuplicate = array_filter($completedItems, function ($item) use ($previousItemToComplete) {
               return (string)$item['id'] === (string)$previousItemToComplete['id'] && $item['type'] === $previousItemToComplete['type'];
            });

            if (empty($isDuplicate)) {
               $completedItems[] = $previousItemToComplete;
            }
         }

         // Also mark all items before the current item as completed (for sequential progression)
         $currentItemIndex = -1;
         for ($i = 0; $i < count($allItems); $i++) {
            if ((string)$allItems[$i]['id'] === (string)$watching_id && $allItems[$i]['type'] === $watching_type) {
               $currentItemIndex = $i;
               break;
            }
         }

         // Mark all previous items in sequence as completed
         if ($currentItemIndex > 0) {
            for ($i = 0; $i < $currentItemIndex; $i++) {
               $itemToComplete = [
                  'id' => $allItems[$i]['id'],
                  'type' => $allItems[$i]['type'],
               ];

               // Check if item is not already completed
               $isDuplicate = array_filter($completedItems, function ($item) use ($itemToComplete) {
                  return (string)$item['id'] === (string)$itemToComplete['id'] && $item['type'] === $itemToComplete['type'];
               });

               if (empty($isDuplicate)) {
                  $completedItems[] = $itemToComplete;
               }
            }
         }

         // Clean up duplicates and ensure consistent data types
         $completedItems = $this->cleanupCompletedItems($completedItems);

         $watchHistory->completed_watching = json_encode($completedItems);
         $watchHistory->prev_watching_id = $prevItem ? $prevItem['id'] : null;
         $watchHistory->prev_watching_type = $prevItem ? $prevItem['type'] : null;
         $watchHistory->current_watching_id = $watching_id;
         $watchHistory->current_watching_type = $watching_type;
         $watchHistory->next_watching_id = $nextItem ? $nextItem['id'] : null;
         $watchHistory->next_watching_type = $nextItem ? $nextItem['type'] : null;
         $watchHistory->current_section_id = $currentSection ? $currentSection->id : null;
         $watchHistory->save();
      } else {
         // Get the first section of the course
         $user = User::where('role', 'admin')->first();

         if ($user->id == $user_id) {
            $watchHistory = WatchHistory::create([
               'current_watching_type' => $watching_type,
               'course_id' => $course->id,
               'user_id' => $user->id,
               'current_watching_id' => $watching_id,
               'current_section_id' => $currentSection ? $currentSection->id : null,
               'prev_watching_id' => $prevItem ? $prevItem['id'] : null,
               'prev_watching_type' => $prevItem ? $prevItem['type'] : null,
               'next_watching_id' => $nextItem ? $nextItem['id'] : null,
               'next_watching_type' => $nextItem ? $nextItem['type'] : null,
               'completed_watching' => json_encode([]), // Start with empty completed items
            ]);
         } else {
            $watchHistory = WatchHistory::create([
               'current_watching_type' => $watching_type,
               'course_id' => $course->id,
               'user_id' => $user_id,
               'current_watching_id' => $watching_id,
               'current_section_id' => $currentSection ? $currentSection->id : null,
               'prev_watching_id' => $prevItem ? $prevItem['id'] : null,
               'prev_watching_type' => $prevItem ? $prevItem['type'] : null,
               'next_watching_id' => $nextItem ? $nextItem['id'] : null,
               'next_watching_type' => $nextItem ? $nextItem['type'] : null,
               'completed_watching' => json_encode([]), // Start with empty completed items
            ]);

            WatchHistory::create([
               'current_watching_type' => $watching_type,
               'course_id' => $course->id,
               'user_id' => $user->id,
               'current_watching_id' => $watching_id,
               'current_section_id' => $currentSection ? $currentSection->id : null,
               'prev_watching_id' => $prevItem ? $prevItem['id'] : null,
               'prev_watching_type' => $prevItem ? $prevItem['type'] : null,
               'next_watching_id' => $nextItem ? $nextItem['id'] : null,
               'next_watching_type' => $nextItem ? $nextItem['type'] : null,
               'completed_watching' => json_encode([]), // Start with empty completed items
            ]);
         }
      }

      return $watchHistory;
   }

   public function calculateCompletion(Course $course, WatchHistory $watchHistory): array
   {
      $completedItems = json_decode($watchHistory->completed_watching, true) ?: [];

      // Count the total number of items (lessons + quizzes) across all sections
      $totalItems = 0;
      foreach ($course->sections as $section) {
         $totalItems += count($section->section_lessons) + count($section->section_quizzes);
      }

      // Count how many items are completed
      $completedCount = 0;
      foreach ($course->sections as $section) {
         // Count completed lessons
         foreach ($section->section_lessons as $lesson) {
            foreach ($completedItems as $completedItem) {
               if ((string)$completedItem['id'] === (string)$lesson->id && $completedItem['type'] === 'lesson') {
                  $completedCount++;
                  break;
               }
            }
         }

         // Count completed quizzes
         foreach ($section->section_quizzes as $quiz) {
            foreach ($completedItems as $completedItem) {
               if ((string)$completedItem['id'] === (string)$quiz->id && $completedItem['type'] === 'quiz') {
                  $completedCount++;
                  break;
               }
            }
         }
      }

      // Calculate completion
      $completion = $totalItems > 0 ? round(($completedCount / $totalItems) * 100, 2) : 0;

      return [
         'total_items' => $totalItems,
         'completed_items' => $completedCount,
         'completion' => $completion,
      ];
   }

   /**
    * Clean up completed items to remove duplicates and ensure consistent data types
    */
   private function cleanupCompletedItems(array $completedItems): array
   {
      $cleaned = [];
      $seen = [];

      foreach ($completedItems as $item) {
         // Ensure consistent data types (string for ID)
         $normalizedItem = [
            'id' => (string)$item['id'],
            'type' => $item['type']
         ];

         // Create unique key for duplicate checking
         $key = $normalizedItem['id'] . '|' . $normalizedItem['type'];

         // Only add if not already seen
         if (!isset($seen[$key])) {
            $seen[$key] = true;
            $cleaned[] = $normalizedItem;
         }
      }

      return $cleaned;
   }
}
