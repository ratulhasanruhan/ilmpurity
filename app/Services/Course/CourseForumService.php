<?php

namespace App\Services\Course;

use App\Models\Course\Course;
use Illuminate\Support\Arr;
use App\Models\Course\CourseForum;
use App\Models\Course\CourseForumReply;
use App\Models\User;
use App\Notifications\ForumNotification;
use App\Services\MediaService;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

class CourseForumService extends MediaService
{
   function getForums(array $data, bool $paginate = false): LengthAwarePaginator|Collection
   {
      $page = array_key_exists('per_page', $data) ? intval($data['per_page']) : 10;

      $courses = CourseForum::where('course_id', $data['course_id'])
         ->when(array_key_exists('search', $data), function ($query) use ($data) {
            return $query->where('title', 'LIKE', '%' . $data['search'] . '%');
         })
         ->orderBy('created_at', 'desc');

      if ($paginate) {
         return $courses->paginate($page);
      }

      return $courses->get();
   }

   function getForumById(string $id): ?CourseForum
   {
      return CourseForum::with(['user', 'course', 'section_lesson'])
         ->where('id', $id)
         ->first();
   }

   function createForum(array $data): CourseForum
   {
      $forum = CourseForum::create($data);

      if (User::find($data['user_id'])->role == 'student') {
         $this->notifyInstructor($data);
      }

      return $forum;
   }

   function createForumReply(array $data): CourseForumReply
   {
      $replyData = Arr::except($data, 'course_forum_user_id');
      $reply = CourseForumReply::create($replyData);

      $this->notifyInstructor([...$data, 'title' => 'reply']);

      return $reply;
   }

   function updateForum(string $id, array $data): CourseForum
   {
      return CourseForum::find($id)->update($data);
   }

   function updateForumReply(string $id, array $data): CourseForumReply
   {
      return CourseForumReply::find($id)->update($data);
   }

   function deleteForum(string $id): void
   {
      CourseForum::find($id)->delete();
   }

   function deleteForumReply(string $id): void
   {
      CourseForumReply::find($id)->delete();
   }

   private function notifyInstructor(array $data): void
   {
      $course = Course::find($data['course_id']);

      if (array_key_exists('course_forum_user_id', $data) && $data['user_id'] == $course->instructor->user_id) {
         $user = User::find($data['course_forum_user_id']);

         $user->notify(new ForumNotification($data));
      } else {
         $instructor = User::find($course->instructor->user_id);

         $instructor->notify(new ForumNotification($data));
      }
   }
}
