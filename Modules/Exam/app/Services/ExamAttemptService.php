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

      // Create new attempt
      return ExamAttempt::create([
         'user_id' => $user->id,
         'exam_id' => $exam->id,
         'attempt_number' => $previousAttempts + 1,
         'start_time' => now(),
         'total_marks' => $exam->total_marks,
         'status' => 'in_progress',
      ]);
   }

   /**
    * Submit exam answers without grading (for manual review)
    */
   public function submitAttempt(ExamAttempt $attempt, array $answers): ExamAttempt
   {
      DB::beginTransaction();
      try {
         foreach ($answers as $answer) {
            $question = \Modules\Exam\Models\ExamQuestion::find($answer['exam_question_id']);

            if (!$question) {
               continue;
            }

            // Save the answer without grading
            ExamAttemptAnswer::create([
               'exam_attempt_id' => $attempt->id,
               'exam_question_id' => $question->id,
               'answer_data' => $answer['answer_data'],
               'is_correct' => null, // Will be graded during review
               'marks_obtained' => 0, // Will be assigned during review
            ]);
         }

         // Update attempt status to submitted (pending review)
         $attempt->update([
            'end_time' => now(),
            'status' => 'submitted', // Changed from 'completed' to 'submitted'
         ]);

         DB::commit();
         return $attempt->fresh();
      } catch (\Exception $e) {
         DB::rollBack();
         throw $e;
      }
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
            // Short answers need manual grading
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

      $isCorrect = $correctOption && $correctOption->id == $answerData['selected_option_id'];

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
      DB::beginTransaction();
      try {
         $totalObtainedMarks = 0;
         $correctAnswers = 0;
         $incorrectAnswers = 0;

         // Load attempt with answers and questions
         $attempt->load(['attempt_answers.exam_question']);

         foreach ($attempt->attempt_answers as $attemptAnswer) {
            $question = $attemptAnswer->exam_question;

            if (!$question) {
               continue;
            }

            // Check if this question has manual grading
            $questionId = $question->id;
            if (isset($manualGrades[$questionId])) {
               // Use manual grade
               $marksObtained = floatval($manualGrades[$questionId]);
               $isCorrect = $marksObtained >= $question->marks;

               $attemptAnswer->update([
                  'is_correct' => $isCorrect,
                  'marks_obtained' => $marksObtained,
               ]);
            } else {
               // Auto-grade based on question type
               $result = $this->gradeAnswer($question, $attemptAnswer->answer_data);

               $attemptAnswer->update([
                  'is_correct' => $result['is_correct'],
                  'marks_obtained' => $result['marks_obtained'],
               ]);
            }

            // Refresh to get updated values
            $attemptAnswer->refresh();

            // Update is_correct flag based on marks obtained
            $questionMarks = floatval($question->marks);
            $obtainedMarks = floatval($attemptAnswer->marks_obtained);

            // If student got full marks, mark as correct
            if ($obtainedMarks >= $questionMarks) {
               if ($attemptAnswer->is_correct !== true) {
                  $attemptAnswer->update(['is_correct' => true]);
                  $attemptAnswer->refresh();
               }
               $correctAnswers++;
            } elseif ($obtainedMarks > 0) {
               // Partial marks - still incorrect
               if ($attemptAnswer->is_correct !== false) {
                  $attemptAnswer->update(['is_correct' => false]);
                  $attemptAnswer->refresh();
               }
               $incorrectAnswers++;
            } else {
               // Zero marks - incorrect
               if ($attemptAnswer->is_correct !== false) {
                  $attemptAnswer->update(['is_correct' => false]);
                  $attemptAnswer->refresh();
               }
               $incorrectAnswers++;
            }

            $totalObtainedMarks += $attemptAnswer->marks_obtained;
         }

         // Calculate percentage and pass/fail
         $percentage = $attempt->total_marks > 0
            ? round(($totalObtainedMarks / $attempt->total_marks) * 100, 2)
            : 0;

         $isPassed = $totalObtainedMarks >= $attempt->exam->pass_mark;

         // Update attempt with grading results
         $attempt->update([
            'obtained_marks' => $totalObtainedMarks,
            'percentage' => $percentage,
            'correct_answers' => $correctAnswers,
            'incorrect_answers' => $incorrectAnswers,
            'is_passed' => $isPassed,
            'status' => 'completed',
         ]);

         DB::commit();
         return $attempt->fresh();
      } catch (\Exception $e) {
         DB::rollBack();
         throw $e;
      }
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
            if (in_array($question->question_type, ['listening', 'short_answer'])) {
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
