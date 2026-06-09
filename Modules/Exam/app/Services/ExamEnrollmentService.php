<?php

namespace Modules\Exam\Services;

use Modules\Exam\Models\Exam;
use Modules\Exam\Models\ExamEnrollment;
use App\Models\User;
use App\Services\MediaService;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;
use Modules\Exam\Models\ExamAttempt;

class ExamEnrollmentService extends MediaService
{
   function getEnrollmentById(int $id): ?ExamEnrollment
   {
      return ExamEnrollment::with(['user', 'exam'])->find($id);
   }

   function getEnrollmentByExamId(int $examId, ?int $userId): ?ExamEnrollment
   {
      return ExamEnrollment::where('exam_id', $examId)->where('user_id', $userId)->first();
   }

   function getEnrollments(array $data, bool $paginate = false): LengthAwarePaginator|Collection
   {
      $page = array_key_exists('per_page', $data) ? intval($data['per_page']) : 10;

      $enrollments = ExamEnrollment::with(['user', 'exam.instructor.user'])
         ->when(array_key_exists('search', $data), function ($query) use ($data) {
            return $query->whereHas('user', function ($user) use ($data) {
               $user->where('name', 'LIKE', '%' . $data['search'] . '%');
            });
         })
         ->when(array_key_exists('instructor_id', $data), function ($query) use ($data) {
            return $query->whereHas('exam.instructor.user', function ($user) use ($data) {
               $user->where('id', $data['instructor_id']);
            });
         })
         ->when(array_key_exists('user_id', $data), function ($query) use ($data) {
            $query->where('user_id', $data['user_id']);
         })
         ->orderBy('created_at', 'desc');

      if ($paginate) {
         return $enrollments->paginate($page);
      }

      return $enrollments->get();
   }

   function createExamEnroll(array $data): ExamEnrollment
   {
      return DB::transaction(function () use ($data) {
         $examId = $data['exam_id'];
         $exam = Exam::findOrFail($examId);
         $enrollmentType = $data['enrollment_type'] ?? ($exam->expiry_type ?? 'lifetime');

         $payload = [
            'user_id' => $data['user_id'],
            'exam_id' => $examId,
            'enrollment_type' => $enrollmentType,
            'entry_date' => now(),
         ];

         if ($enrollmentType === 'limited' && $exam->expiry_duration) {
            $payload['expiry_date'] = Carbon::now()->addDays($exam->expiry_duration);
         }

         return ExamEnrollment::create($payload);
      }, 5);
   }

   function deleteEnrollment(string $id): void
   {
      $enrollment = ExamEnrollment::find($id);
      $enrollment->delete();
   }

   function getEnrollmentProgress(ExamEnrollment $enrollment): array
   {
      $exam = $enrollment->exam;
      $user = $enrollment->user;

      $attempts = $exam->attempts()
         ->where('user_id', $user->id)
         ->get();

      $completedAttempts = $attempts->where('status', 'completed')->count();
      $bestScore = $attempts->where('status', 'completed')->max('obtained_marks') ?? 0;
      $hasPassed = $attempts->where('is_passed', true)->count() > 0;

      return [
         'enrollment' => $enrollment,
         'is_active' => $enrollment->isActive(),
         'attempts_used' => $attempts->count(),
         'attempts_remaining' => max(0, $exam->max_attempts - $attempts->count()),
         'completed_attempts' => $completedAttempts,
         'best_score' => $bestScore,
         'has_passed' => $hasPassed,
      ];
   }

   function getEnrolledExam(string $id, User $user): Exam
   {
      $enrollment = ExamEnrollment::where('user_id', $user->id)
         ->where('exam_id', $id)
         ->first();

      if (!$enrollment) {
         throw new \Exception('You are not enrolled in this exam');
      }

      return Exam::with(['instructor:id,user_id', 'instructor.user:id,name,photo'])->find($id);
   }

   function calculateStudentExamMarks(string $exam_id, string $user_id): array
   {
      $attempts = ExamAttempt::where('exam_id', $exam_id)
         ->where('user_id', $user_id)
         ->where('status', 'completed')
         ->get();

      if ($attempts->isEmpty()) {
         return [
            'total_attempts' => 0,
            'best_percentage' => 0,
            'best_marks' => 0,
            'total_marks' => 0,
            'is_passed' => false,
            'grade' => 'N/A',
         ];
      }

      $bestAttempt = $attempts->sortByDesc('obtained_marks')->first();
      $exam = Exam::find($exam_id);

      $grade = calculateGrade($bestAttempt->percentage);

      return [
         'total_attempts' => $attempts->count(),
         'best_percentage' => round($bestAttempt->percentage, 2),
         'best_marks' => (float) $bestAttempt->obtained_marks,
         'total_marks' => (float) ($exam->total_marks ?? $bestAttempt->total_marks),
         'is_passed' => $bestAttempt->is_passed,
         'grade' => $grade,
      ];
   }
}
