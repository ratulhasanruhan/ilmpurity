<?php

namespace Modules\Exam\Services;

use App\Models\Instructor;
use App\Models\User;
use App\Services\MediaService;
use Illuminate\Support\Str;
use Modules\Exam\Models\Exam;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Auth;
use Modules\Exam\Models\ExamCategory;
use Modules\Exam\Notifications\ExamApprovalNotification;
use Modules\Exam\Services\ExamAttemptService;

class ExamService extends MediaService
{
   public function __construct(
      protected ExamCategoryService $examCategory,
      protected ExamAttemptService $examAttempt,
   ) {}

   /**
    * Get all exams with filters and pagination
    */
   public function getAllExams(array $data, ?User $user = null, bool $paginate = false): LengthAwarePaginator|Collection
   {
      $perPage = array_key_exists('per_page', $data) ? intval($data['per_page']) : 10;

      $query = Exam::with([
         'instructor.user',
         'exam_category',
      ])
         ->withCount('enrollments')
         ->withAvg('reviews as average_rating', 'rating')
         ->when(array_key_exists('search', $data) && !empty($data['search']), function ($query) use ($data) {
            return $query->where('title', 'LIKE', '%' . $data['search'] . '%')
               ->orWhere('description', 'LIKE', '%' . $data['search'] . '%');
         })
         ->when(array_key_exists('status', $data), function ($query) use ($data) {
            return $query->where('status', $data['status']);
         })
         ->when(array_key_exists('category', $data) && $data['category'] !== 'all', function ($query) use ($data) {
            return $query->whereHas('exam_category', function ($category) use ($data) {
               $category->where('slug', $data['category']);
            });
         })
         ->when(array_key_exists('level', $data) && $data['level'] !== 'all', function ($query) use ($data) {
            return $query->where('level', $data['level']);
         })
         ->when(array_key_exists('pricing_type', $data) && $data['pricing_type'] !== 'all', function ($query) use ($data) {
            return $query->where('pricing_type', $data['pricing_type']);
         })
         ->when($user && $user->user_type === 'instructor', function ($query) use ($user) {
            return $query->where('instructor_id', $user->instructor->id);
         })
         ->orderBy('created_at', 'desc');

      if ($paginate) {
         return $query->paginate($perPage);
      }

      return $query->get();
   }

   /**
    * Create a new exam
    */
   public function createExam(array $data): Exam
   {
      $exam = Exam::create([
         ...$data,
         'slug' => Str::slug($data['title']),
         'user_id' => Auth::id(),
      ]);

      if (isset($data['thumbnail']) && $data['thumbnail']) {
         $exam->update([
            'thumbnail' => $this->addNewDeletePrev($exam, $data['thumbnail'], 'thumbnail')
         ]);
      }

      return $exam;
   }

   /**
    * Update an exam
    */
   public function updateExam(Exam $exam, array $data): Exam
   {
      // Handle tab-based updates
      switch ($data['tab'] ?? 'basic') {
         case 'attempts':
            $exam->update($data);
            break;

         case 'basic':
            $exam->update($data);
            break;

         case 'pricing':
            $exam->update($data);
            break;

         case 'settings':
            $exam->update($data);
            break;

         case 'media':
            $media = [];

            if (isset($data['thumbnail']) && $data['thumbnail']) {
               $media['thumbnail'] = $this->addNewDeletePrev($exam, $data['thumbnail'], 'thumbnail');
            }

            if (!empty($media)) {
               $exam->update($media);
            }
            break;

         case 'seo':
            $exam->update($data);
            break;

         case 'status':
            $exam->update($data);

            if (array_key_exists('feedback', $data)) {
               $instructor = Instructor::find($exam->instructor_id);
               $user = User::find($instructor->user_id);

               $user->notify(new ExamApprovalNotification($exam, $data));
            }
            break;

         default:
            $exam->update($data);
            break;
      }

      return $exam->fresh();
   }

   /**
    * Delete an exam
    */
   public function deleteExam(Exam $exam): bool
   {
      return $exam->delete();
   }

   /**
    * Get exam by ID
    */
   public function getExamById(string $id): ?Exam
   {
      return Exam::with(['instructor.user', 'exam_category', 'questions', 'reviews.user'])
         ->where('id', $id)
         ->first();
   }

   /**
    * Get checkout exam
    */
   public function getCheckoutExam(string $id): ?Exam
   {
      return Exam::where('id', $id)
         ->where('status', 'published')
         ->first();
   }

   /**
    * Get exam by slug
    */
   public function getExamPreview(string $id, string $tab): Exam
   {
      $exam = Exam::where('id', $id)
         ->when($tab === 'overview', function ($query) {
            return $query->with(['faqs']);
         })
         ->when($tab === 'details', function ($query) {
            return $query->with(['requirements', 'outcomes']);
         })
         ->withCount('enrollments')
         ->withAvg('reviews as average_rating', 'rating')
         ->first();

      if (!$exam) {
         return abort(404, 'Exam not found');
      }

      return $exam;
   }

   /**
    * Get exam by slug
    */
   public function getExamPreviewMetadata(Exam $exam): array
   {
      // Generate meta tags for SEO and social sharing
      $system = app('system_settings');
      $siteName = $system->fields['name'] ?? 'Mentor Learning Management System';
      $pageTitle = $exam->meta_title ?? ($exam->title . ' | ' . $siteName);
      $pageDescription = $exam->meta_description ?? $exam->short_description ?? $exam->description ?? 'Professional certification exam';
      $pageKeywords = $exam->meta_keywords ?? ($exam->title . ', certification exam, professional test, ' . ($system->fields['keywords'] ?? 'LMS'));
      $ogTitle = $exam->og_title ?? $exam->title;
      $ogDescription = $exam->og_description ?? $pageDescription;

      // Prioritize exam images: thumbnail > banner > system banner
      $examImage = $exam->thumbnail ?? $exam->banner ?? $system->fields['banner'] ?? '';
      $siteUrl = request()->url();

      return [
         'metaTitle' => $pageTitle,
         'metaDescription' => $pageDescription,
         'metaKeywords' => $pageKeywords,
         'ogTitle' => $ogTitle,
         'ogDescription' => $ogDescription,
         'ogImage' => $examImage,
         'ogUrl' => $siteUrl,
         'ogType' => 'article',
         'twitterCard' => 'summary_large_image',
         'twitterTitle' => $ogTitle,
         'twitterDescription' => $ogDescription,
         'twitterImage' => $examImage,
      ];
   }

   /**
    * Get category exams metadata
    */
   public function getCategoryExamsMetadata(?ExamCategory $category, LengthAwarePaginator|Collection $exams): array
   {
      // Generate meta tags for SEO and social sharing
      $system = app('system_settings');
      $siteName = $system->fields['name'] ?? 'Mentor Learning Management System';
      $siteUrl = request()->url();

      // Get exam count with proper fallback
      $totalExams = 0;
      if (isset($exams->total)) {
         $totalExams = $exams->total;
      } elseif (isset($exams->data) && is_array($exams->data)) {
         $totalExams = count($exams->data);
      }

      // Get first exam thumbnail (prioritize over category image)
      $firstExamImage = null;
      if (!empty($exams->data) && is_array($exams->data) && count($exams->data) > 0) {
         $firstExam = $exams->data[0];
         $firstExamImage = $firstExam->thumbnail ?? $firstExam->banner ?? null;
      }

      $pageTitle = 'All Exams';
      $pageDescription = $totalExams > 0
         ? "Browse $totalExams+ professional certification exams from expert instructors. Test your skills with our comprehensive exam catalog."
         : "Browse professional certification exams from expert instructors. Test your skills with our comprehensive exam catalog.";
      $pageKeywords = 'online exams, certification exams, professional tests, skills assessment, exam preparation';
      $ogTitle = 'Professional Exams';
      $categoryImage = null;

      if ($category) {
         $pageTitle = $category->title . ' Exams';
         $ogTitle = $category->title . ' Exams';
         $pageDescription = $totalExams > 0
            ? "Explore $totalExams " . strtolower($category->title) . " certification exams. Test your expertise in " . strtolower($category->title) . " with industry-standard assessments."
            : "Explore " . strtolower($category->title) . " certification exams. Test your expertise in " . strtolower($category->title) . " with industry-standard assessments.";
         $pageKeywords = strtolower($category->title) . ', exams, certification, assessment, ' . $category->title . ' test, professional certification';
         $categoryImage = $category->thumbnail ?? null;
      }

      $fullTitle = $pageTitle . ' | ' . $siteName;

      // Prioritize first exam image over category image, then fallback to system banner
      $ogImage = $firstExamImage ?? $categoryImage ?? $system->fields['banner'] ?? '';

      return [
         'metaTitle' => $fullTitle,
         'metaDescription' => $pageDescription,
         'metaKeywords' => $pageKeywords,
         'ogTitle' => $ogTitle,
         'ogDescription' => $pageDescription,
         'ogImage' => $ogImage,
         'ogUrl' => $siteUrl,
         'ogType' => 'website',
         'twitterCard' => 'summary_large_image',
         'twitterTitle' => $ogTitle,
         'twitterDescription' => $pageDescription,
         'twitterImage' => $ogImage,
      ];
   }
}
