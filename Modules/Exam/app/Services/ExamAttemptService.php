<?php

namespace Modules\Exam\Services;

use App\Models\User;
use Modules\Exam\Models\Exam;
use Modules\Exam\Models\ExamAttempt;
use Modules\Exam\Models\ExamAttemptAnswer;
use Illuminate\Support\Facades\DB;

class ExamAttemptService
{
   /**
    * Start a new exam attempt
    */
   public function startAttempt(User $user, Exam $exam): ?ExamAttempt
   {
      $previousAttempts = ExamAttempt::where('user_id', $user->id)
         ->where('exam_id', $exam->id)
         ->count();

      if ($previousAttempts >= $exam->max_attempts) {
         return null;
      }

      $minutes = ((int) $exam->duration_hours * 60) + (int) $exam->duration_minutes;
      if ($minutes < 1) {
         $minutes = 60;
      }

      return ExamAttempt::create([
         'user_id' => $user->id,
         'exam_id' => $exam->id,
         'attempt_number' => $previousAttempts + 1,
         'start_time' => now(),
         'expires_at' => now()->addMinutes($minutes),
         'total_marks' => $exam->total_marks,
         'status' => 'in_progress',
      ]);
   }

   public function saveAnswer(ExamAttempt $attempt, int $questionId, array $answerData): ExamAttemptAnswer
   {
      return ExamAttemptAnswer::updateOrCreate(
         [
            'exam_attempt_id' => $attempt->id,
            'exam_question_id' => $questionId,
         ],
         [
            'answer_data' => $answerData,
         ]
      );
   }

   /**
    * Submit exam answers without grading (for manual review)
    */
   public function submitAttempt(ExamAttempt $attempt, array $answers): ExamAttempt
   {
      if ($attempt->status !== 'in_progress') {
         return $attempt->fresh();
      }

      DB::beginTransaction();
      try {
         $this->storeAnswers($attempt, $answers);
         $attempt = $this->finalizeGrading($attempt, [], true);

         DB::commit();
         return $attempt;
      } catch (\Exception $e) {
         DB::rollBack();
         throw $e;
      }
   }

   public function expireOverdueAttempts(): int
   {
      $expired = 0;

      ExamAttempt::query()
         ->where('status', 'in_progress')
         ->with('exam')
         ->orderBy('id')
         ->chunkById(50, function ($attempts) use (&$expired) {
            foreach ($attempts as $attempt) {
               if ($attempt->deadline()->isPast()) {
                  $this->submitAttempt($attempt, []);
                  $expired++;
               }
            }
         });

      return $expired;
   }

   private function storeAnswers(ExamAttempt $attempt, array $answers): void
   {
      foreach ($answers as $answer) {
         if (empty($answer['exam_question_id'])) {
            continue;
         }

         $question = \Modules\Exam\Models\ExamQuestion::query()
            ->where('id', $answer['exam_question_id'])
            ->where('exam_id', $attempt->exam_id)
            ->first();

         if (!$question) {
            continue;
         }

         $answerData = $answer['answer_data'] ?? [];
         if (is_string($answerData)) {
            $decoded = json_decode($answerData, true);
            $answerData = is_array($decoded) ? $decoded : ['value' => $answerData];
         }
         if (!is_array($answerData)) {
            $answerData = ['value' => $answerData];
         }

         $existing = ExamAttemptAnswer::query()
            ->where('exam_attempt_id', $attempt->id)
            ->where('exam_question_id', $question->id)
            ->first();

         if ($question->question_type === 'file_upload' && empty($answerData['file_path']) && $existing) {
            continue;
         }

         ExamAttemptAnswer::updateOrCreate(
            [
               'exam_attempt_id' => $attempt->id,
               'exam_question_id' => $question->id,
            ],
            [
               'answer_data' => $answerData,
            ]
         );
      }
   }

   public function finalizeGrading(ExamAttempt $attempt, array $manualGrades = [], bool $closing = false): ExamAttempt
   {
      $attempt->load(['exam.questions']);

      if ($closing) {
         $existingIds = $attempt->attempt_answers()->pluck('exam_question_id');
         foreach ($attempt->exam->questions as $question) {
            if ($existingIds->contains($question->id)) {
               continue;
            }

            ExamAttemptAnswer::create([
               'exam_attempt_id' => $attempt->id,
               'exam_question_id' => $question->id,
               'answer_data' => [],
               'marks_obtained' => 0,
            ]);
         }
      }

      $attempt->load(['attempt_answers.exam_question', 'exam.questions']);

      $totalObtainedMarks = 0;
      $correctAnswers = 0;
      $incorrectAnswers = 0;
      $pending = 0;
      $answeredQuestionIds = [];

      foreach ($attempt->attempt_answers as $attemptAnswer) {
         $question = $attemptAnswer->exam_question;
         if (!$question) {
            continue;
         }

         $answeredQuestionIds[] = $question->id;
         $questionId = $question->id;

         if (array_key_exists($questionId, $manualGrades)) {
            $marksObtained = max(0, min(floatval($manualGrades[$questionId]), floatval($question->marks)));
            $attemptAnswer->is_correct = $marksObtained >= floatval($question->marks);
            $attemptAnswer->marks_obtained = $marksObtained;
            $attemptAnswer->save();
         } elseif ($this->isManualQuestion($question->question_type)) {
            $pending++;
            $totalObtainedMarks += floatval($attemptAnswer->marks_obtained);
            continue;
         } else {
            $result = $this->gradeAnswer($question, $attemptAnswer->answer_data ?? []);
            $attemptAnswer->is_correct = $result['is_correct'];
            $attemptAnswer->marks_obtained = $result['marks_obtained'];
            $attemptAnswer->save();
         }

         $attemptAnswer->refresh();
         $obtainedMarks = floatval($attemptAnswer->marks_obtained);
         $totalObtainedMarks += $obtainedMarks;

         if ($attemptAnswer->is_correct === true || $obtainedMarks >= floatval($question->marks)) {
            $correctAnswers++;
         } else {
            $incorrectAnswers++;
         }
      }

      $missingQuestions = $attempt->exam->questions->whereNotIn('id', $answeredQuestionIds);
      foreach ($missingQuestions as $question) {
         if ($this->isManualQuestion($question->question_type)) {
            $pending++;
         } else {
            $incorrectAnswers++;
         }
      }

      $isPassed = $pending === 0 && $totalObtainedMarks >= floatval($attempt->exam->pass_mark);

      $payload = [
         'obtained_marks' => $totalObtainedMarks,
         'correct_answers' => $correctAnswers,
         'incorrect_answers' => $incorrectAnswers,
         'is_passed' => $isPassed,
         'status' => $pending > 0 ? 'submitted' : 'completed',
      ];

      if ($closing || $attempt->status === 'in_progress') {
         $payload['end_time'] = now();
      }

      $attempt->update($payload);

      return $attempt->fresh(['exam', 'attempt_answers.exam_question.question_options']);
   }

   private function isManualQuestion(string $type): bool
   {
      return in_array($type, ['short_answer', 'file_upload'], true);
   }

   /**
    * Grade an answer based on question type
    */
   private function gradeAnswer($question, $answerData): array
   {
      $result = [
         'is_correct' => null,
         'marks_obtained' => 0,
      ];

      switch ($question->question_type) {
         case 'multiple_choice':
            $result = $this->gradeMultipleChoice($question, $answerData);
            break;

         case 'multiple_select':
            $result = $this->gradeMultipleSelect($question, $answerData);
            break;

         case 'matching':
            $result = $this->gradeMatching($question, $answerData);
            break;

         case 'fill_blank':
            $result = $this->gradeFillBlank($question, $answerData);
            break;

         case 'ordering':
            $result = $this->gradeOrdering($question, $answerData);
            break;

         case 'listening':
            $result = $this->gradeListening($question, $answerData);
            break;

         case 'short_answer':
         case 'file_upload':
            $result['is_correct'] = null;
            $result['marks_obtained'] = 0;
            break;
      }

      return $result;
   }

   /**
    * Grade multiple choice question
    */
   private function gradeMultipleChoice($question, $answerData): array
   {
      $correctOption = $question->question_options()
         ->where('is_correct', true)
         ->first();

      $isCorrect = $correctOption && $correctOption->id == ($answerData['selected_option_id'] ?? null);

      return [
         'is_correct' => $isCorrect,
         'marks_obtained' => $isCorrect ? $question->marks : 0,
      ];
   }

   /**
    * Grade multiple select question
    */
   private function gradeMultipleSelect($question, $answerData): array
   {
      $correctOptionIds = $question->question_options()
         ->where('is_correct', true)
         ->pluck('id')
         ->sort()
         ->values()
         ->toArray();

      $selectedIds = collect($answerData['selected_option_ids'] ?? [])
         ->sort()
         ->values()
         ->toArray();

      $isCorrect = $correctOptionIds === $selectedIds;

      return [
         'is_correct' => $isCorrect,
         'marks_obtained' => $isCorrect ? $question->marks : 0,
      ];
   }

   /**
    * Grade matching question
    */
   private function gradeMatching($question, $answerData): array
   {
      $correctMatches = $question->options['matches'] ?? [];
      $userMatches = $answerData['matches'] ?? [];

      $correctCount = 0;
      foreach ($correctMatches as $match) {
         $userMatch = collect($userMatches)->firstWhere('id', $match['id']);
         if ($userMatch && $userMatch['answer'] === $match['answer']) {
            $correctCount++;
         }
      }

      $totalMatches = count($correctMatches);
      $percentage = $totalMatches > 0 ? ($correctCount / $totalMatches) : 0;
      $isCorrect = $percentage === 1.0;

      return [
         'is_correct' => $isCorrect,
         'marks_obtained' => $percentage * $question->marks,
      ];
   }

   /**
    * Grade fill in the blank question
    */
   private function gradeFillBlank($question, $answerData): array
   {
      $correctAnswers = $question->options['answers'] ?? [];
      $userAnswers = $answerData['answers'] ?? [];

      $correctCount = 0;
      foreach ($correctAnswers as $index => $correctAnswer) {
         $userAnswer = $userAnswers[$index] ?? '';
         if (strtolower(trim($userAnswer)) === strtolower(trim($correctAnswer))) {
            $correctCount++;
         }
      }

      $totalBlanks = count($correctAnswers);
      $percentage = $totalBlanks > 0 ? ($correctCount / $totalBlanks) : 0;
      $isCorrect = $percentage === 1.0;

      return [
         'is_correct' => $isCorrect,
         'marks_obtained' => $percentage * $question->marks,
      ];
   }

   /**
    * Grade ordering question
    */
   private function gradeOrdering($question, $answerData): array
   {
      $correctOrder = $question->options['correct_order'] ?? [];
      $userOrder = $answerData['order'] ?? [];

      $isCorrect = $correctOrder === $userOrder;

      return [
         'is_correct' => $isCorrect,
         'marks_obtained' => $isCorrect ? $question->marks : 0,
      ];
   }

   /**
    * Grade listening question (similar to multiple choice)
    */
   private function gradeListening($question, $answerData): array
   {
      return $this->gradeMultipleChoice($question, $answerData);
   }

   /**
    * Get user's attempt history
    */
   public function getUserAttempts(User $user, Exam $exam)
   {
      return ExamAttempt::where('user_id', $user->id)
         ->where('exam_id', $exam->id)
         ->with('attempt_answers.exam_question')
         ->orderBy('created_at', 'desc')
         ->get();
   }

   /**
    * Get attempt analytics
    */
   public function getAttemptAnalytics(ExamAttempt $attempt): array
   {
      $answers = $attempt->attempt_answers()->with('exam_question')->get();

      $byQuestionType = [];
      foreach ($answers as $answer) {
         $type = $answer->exam_question->question_type;
         if (!isset($byQuestionType[$type])) {
            $byQuestionType[$type] = [
               'total' => 0,
               'correct' => 0,
               'incorrect' => 0,
               'pending' => 0,
            ];
         }

         $byQuestionType[$type]['total']++;

         if ($answer->is_correct === true) {
            $byQuestionType[$type]['correct']++;
         } elseif ($answer->is_correct === false) {
            $byQuestionType[$type]['incorrect']++;
         } else {
            $byQuestionType[$type]['pending']++;
         }
      }

      return [
         'attempt' => $attempt,
         'by_question_type' => $byQuestionType,
         'percentage' => $attempt->percentage,
         'duration_minutes' => $attempt->duration,
         'time_per_question' => $attempt->duration && $answers->count() > 0
            ? $attempt->duration / $answers->count()
            : 0,
      ];
   }

   public function getExamAttempt(string $id, array $data = [])
   {
      return ExamAttempt::with(['exam', 'user', 'attempt_answers.exam_question.question_options'])
         ->where('id', $id)
         ->when(isset($data['user_id']), function ($query) use ($data) {
            return $query->where('user_id', $data['user_id']);
         })
         ->first();
   }

   public function getExamAttempts(array $data, bool $pagination = false)
   {
      $per_page = array_key_exists('per_page', $data) ? intval($data['per_page']) : 10;

      $exams = ExamAttempt::with(['user', 'attempt_answers.exam_question'])
         ->where('exam_id', $data['exam_id'])
         ->when(array_key_exists('user_id', $data) && $data['user_id'], function ($query) use ($data) {
            return $query->where('user_id', $data['user_id']);
         })
         ->when(array_key_exists('name', $data) && $data['name'], function ($query) use ($data) {
            return $query->whereHas('user', function ($query) use ($data) {
               $query->where('name', 'like', '%' . $data['name'] . '%');
            });
         })
         ->when(array_key_exists('status', $data) && $data['status'] !== 'all', function ($query) use ($data) {
            return $query->where('status', $data['status']);
         })
         ->when(array_key_exists('is_passed', $data) && $data['is_passed'] !== 'all', function ($query) use ($data) {
            return $query->where('is_passed', $data['is_passed']);
         })
         ->orderBy('created_at', 'desc');

      if ($pagination) {
         return $exams->paginate($per_page);
      }

      return $exams->get();
   }

   public function getBestExamAttempt(string $exam_id, string $user_id)
   {
      return ExamAttempt::where('exam_id', $exam_id)
         ->where('user_id', $user_id)
         ->where('status', 'completed')
         ->orderBy('obtained_marks', 'desc')
         ->first();
   }

   public function getAttemptResult(string $exam_id, string $attempt_id): ExamAttempt
   {
      return ExamAttempt::with(['exam', 'attempt_answers.exam_question.question_options'])
         ->where('id', $attempt_id)
         ->where('exam_id', $exam_id)
         ->first();
   }

   /**
    * Abandon an in-progress attempt
    */
   public function abandonAttempt(ExamAttempt $attempt): ExamAttempt
   {
      $attempt->update([
         'status' => 'abandoned',
         'end_time' => now(),
      ]);

      return $attempt;
   }

   /**
    * Review and grade an exam attempt
    */
   public function reviewAttempt(ExamAttempt $attempt, array $manualGrades = []): ExamAttempt
   {
      return DB::transaction(function () use ($attempt, $manualGrades) {
         return $this->finalizeGrading($attempt, $manualGrades, false);
      });
   }

   /**
    * Auto-grade attempt answers without finalizing (for preview during review)
    */
   public function autoGradeAttempt(ExamAttempt $attempt): ExamAttempt
   {
      DB::beginTransaction();
      try {
         // Load attempt with answers and questions
         $attempt->load(['attempt_answers.exam_question']);

         foreach ($attempt->attempt_answers as $attemptAnswer) {
            $question = $attemptAnswer->exam_question;

            if (!$question) {
               continue;
            }

            // Skip manual grading questions (listening, short_answer)
            if ($this->isManualQuestion($question->question_type)) {
               continue;
            }

            // Auto-grade based on question type
            $result = $this->gradeAnswer($question, $attemptAnswer->answer_data);

            $attemptAnswer->update([
               'is_correct' => $result['is_correct'],
               'marks_obtained' => $result['marks_obtained'],
            ]);
         }

         DB::commit();
         return $attempt->fresh();
      } catch (\Exception $e) {
         DB::rollBack();
         throw $e;
      }
   }

   /**
    * Get attempt details for review
    */
   public function getAttemptForReview(string $attemptId)
   {
      return ExamAttempt::with([
         'user',
         'exam',
         'attempt_answers.exam_question.question_options'
      ])
         ->findOrFail($attemptId);
   }
}
