<?php

namespace Modules\Exam\Http\Controllers;

use App\Http\Controllers\Controller;
use Modules\Exam\Models\Exam;
use Modules\Exam\Models\ExamAttempt;
use Modules\Exam\Models\ExamAttemptAnswer;
use Modules\Exam\Models\ExamQuestion;
use Modules\Exam\Http\Requests\ExamAttemptRequest;
use Modules\Exam\Services\ExamAttemptService;
use Modules\Exam\Services\ExamEnrollmentService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class ExamAttemptController extends Controller
{
   public function __construct(
      protected ExamAttemptService $attemptService,
      protected ExamEnrollmentService $enrollmentService
   ) {}

   /**
    * Start a new exam attempt
    */
   public function start(ExamAttemptRequest $request, Exam $exam)
   {
      $user = Auth::user();
      $attempt = $this->attemptService->startAttempt($user, $exam);

      if (!$attempt) {
         return back()->with('error', 'Unable to start exam. You may have reached the maximum number of attempts.');
      }

      return redirect()
         ->route('exam-attempts.take', $attempt->id)
         ->with('success', 'Exam started. Good luck!');
   }

   /**
    * Take the exam (show questions)
    */
   public function take(ExamAttempt $attempt)
   {
      $this->ensureOwner($attempt);
      $attempt->load(['exam.questions.question_options', 'attempt_answers']);

      if ($attempt->status !== 'in_progress') {
         return $this->resultRedirect($attempt, 'This attempt has already been submitted.');
      }

      if ($attempt->deadline()->isPast()) {
         $attempt = $this->attemptService->submitAttempt($attempt, []);

         return $this->resultRedirect($attempt, 'Time is up. Your exam was submitted automatically.');
      }

      $this->hideAnswerKeys($attempt);

      return Inertia::render('student/exam/attempt', [
         'attempt' => $attempt,
      ]);
   }

   /**
    * Save one answer while the exam is in progress.
    */
   public function saveAnswer(Request $request, ExamAttempt $attempt)
   {
      $this->ensureOwner($attempt);

      if ($attempt->status !== 'in_progress') {
         return back()->with('error', 'This attempt has already been submitted.');
      }

      if ($attempt->deadline()->isPast()) {
         $attempt = $this->attemptService->submitAttempt($attempt, []);

         return $this->resultRedirect($attempt, 'Time is up. Your exam was submitted automatically.');
      }

      $validated = $request->validate([
         'question_id' => 'required|integer|exists:exam_questions,id',
         'answer_data' => 'nullable',
         'file' => 'nullable|file|mimes:jpg,jpeg,png,webp,pdf|max:10240',
      ]);

      $question = ExamQuestion::query()
         ->where('id', $validated['question_id'])
         ->where('exam_id', $attempt->exam_id)
         ->firstOrFail();

      $answerData = $request->input('answer_data', []);
      if (is_string($answerData)) {
         $decoded = json_decode($answerData, true);
         $answerData = is_array($decoded) ? $decoded : [];
      }
      if (!is_array($answerData)) {
         $answerData = [];
      }

      if ($request->hasFile('file')) {
         $file = $request->file('file');
         $existing = ExamAttemptAnswer::query()
            ->where('exam_attempt_id', $attempt->id)
            ->where('exam_question_id', $question->id)
            ->first();

         if ($existing && !empty($existing->answer_data['file_path'])) {
            Storage::disk('local')->delete($existing->answer_data['file_path']);
         }

         $path = $file->store("exam-answers/{$attempt->id}/{$question->id}", 'local');
         $answerData = [
            'file_path' => $path,
            'file_name' => $file->getClientOriginalName(),
            'mime' => $file->getClientMimeType(),
         ];
      }

      $this->attemptService->saveAnswer($attempt, $question->id, $answerData);

      return back();
   }

   /**
    * Submit exam answers
    */
   public function submit(ExamAttemptRequest $request, ExamAttempt $attempt)
   {
      $this->ensureOwner($attempt);

      if ($attempt->status !== 'in_progress') {
         return $this->resultRedirect($attempt, 'This attempt has already been submitted.');
      }

      $answers = $request->input('answers', []);
      if (!is_array($answers)) {
         $answers = [];
      }

      $attempt = $this->attemptService->submitAttempt($attempt, $answers);
      $message = $attempt->status === 'completed'
         ? 'Exam submitted. Your result is ready.'
         : 'Exam submitted. Objective questions are graded. Creative answers are waiting for review.';

      return $this->resultRedirect($attempt, $message);
   }

   public function answerFile(ExamAttemptAnswer $answer)
   {
      $attempt = $answer->exam_attempt()->with('exam.instructor')->firstOrFail();
      abort_unless($this->canViewAttempt($attempt), 403);

      $path = $answer->answer_data['file_path'] ?? null;
      abort_unless($path && Storage::disk('local')->exists($path), 404);

      return Storage::disk('local')->response($path, $answer->answer_data['file_name'] ?? 'answer');
   }

   /**
    * Abandon an in-progress attempt
    */
   public function abandon(ExamAttempt $attempt)
   {
      $this->ensureOwner($attempt);

      if ($attempt->status !== 'in_progress') {
         return back()->with('error', 'This attempt is not in progress.');
      }

      $this->attemptService->abandonAttempt($attempt);

      return redirect()
         ->route('student.exam.show', [
            'id' => $attempt->exam_id,
            'tab' => 'attempts',
         ])
         ->with('info', 'Exam attempt abandoned.');
   }

   /**
    * Grade exam attempt (Admin/Instructor only)
    */
   public function grade(Request $request, ExamAttempt $attempt)
   {
      $attempt->loadMissing('exam.instructor');
      abort_unless($this->canReviewAttempt($attempt), 403);

      $manualGrades = $request->input('manual_grades', []);
      if (!is_array($manualGrades)) {
         $manualGrades = [];
      }

      $this->attemptService->reviewAttempt($attempt, $manualGrades);

      return redirect(route('exams.edit', ['exam' => $attempt->exam_id, 'tab' => 'attempts']))
         ->with('success', 'Exam attempt graded successfully!');
   }

   private function resultRedirect(ExamAttempt $attempt, string $message)
   {
      return redirect()
         ->route('student.exam.show', [
            'id' => $attempt->exam_id,
            'tab' => 'attempts',
            'attempt' => $attempt->id,
         ])
         ->with('success', $message);
   }

   private function ensureOwner(ExamAttempt $attempt): void
   {
      abort_unless((int) $attempt->user_id === (int) Auth::id(), 403);
   }

   private function canViewAttempt(ExamAttempt $attempt): bool
   {
      $user = Auth::user();
      if (!$user) {
         return false;
      }

      if ((int) $attempt->user_id === (int) $user->id || $user->role === 'admin') {
         return true;
      }

      return $user->role === 'instructor'
         && (int) optional($attempt->exam->instructor)->user_id === (int) $user->id;
   }

   private function canReviewAttempt(ExamAttempt $attempt): bool
   {
      $user = Auth::user();
      if (!$user) {
         return false;
      }

      if ($user->role === 'admin') {
         return true;
      }

      return $user->role === 'instructor'
         && (int) optional($attempt->exam->instructor)->user_id === (int) $user->id;
   }

   private function hideAnswerKeys(ExamAttempt $attempt): void
   {
      $attempt->exam->questions->each(function ($question) {
         $question->question_options->each->makeHidden(['is_correct']);

         $options = $question->options ?? [];
         unset($options['answers'], $options['correct_order'], $options['sample_answer']);

         if ($question->question_type === 'matching' && !empty($options['matches'])) {
            $options['choices'] = collect($options['matches'])->pluck('answer')->filter()->shuffle()->values()->all();
            $options['matches'] = collect($options['matches'])->map(function ($match) {
               return [
                  'id' => $match['id'] ?? null,
                  'question' => $match['question'] ?? '',
               ];
            })->all();
         }

         $question->setAttribute('options', $options);
      });
   }
}
