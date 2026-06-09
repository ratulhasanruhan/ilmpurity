<?php

namespace App\Services\Course;

use App\Models\Course\QuestionAnswer;
use App\Models\Course\QuizQuestion;
use App\Models\Course\QuizSubmission;
use App\Models\Course\SectionQuiz;

class SectionQuizService extends CourseSectionService
{
   public function createQuiz(array $data, string $userId): SectionQuiz
   {
      $hours = $data['hours'] ?? 0;
      $minutes = $data['minutes'] ?? 0;
      $seconds = $data['seconds'] ?? 0;

      $quiz = SectionQuiz::create([
         ...$data,
         'duration' => $hours . ':' . $minutes . ':' . $seconds,
      ]);

      $this->initWatchHistory($data['course_id'], 'quiz', $userId);

      return $quiz;
   }

   public function updateQuiz(array $data, string $id): SectionQuiz
   {
      $hours = $data['hours'] ?? 0;
      $minutes = $data['minutes'] ?? 0;
      $seconds = $data['seconds'] ?? 0;

      return SectionQuiz::findOrFail($id)->update([
         ...$data,
         'duration' => $hours . ':' . $minutes . ':' . $seconds,
      ]);
   }

   public function deleteQuiz(string $id): bool
   {
      return SectionQuiz::findOrFail($id)->delete();
   }

   public function quizSubmission(array $data): QuizSubmission|bool
   {
      $quiz = SectionQuiz::findOrFail($data['section_quiz_id']);

      $submission = QuizSubmission::where('user_id', $data['user_id'])
         ->where('section_quiz_id', $quiz->id)
         ->first();

      // Get or create quiz submission
      if ($submission) {
         if ($submission->attempts >= $quiz->retake) {
            return false;
         } else {
            $submission->increment('attempts');
         }
      } else {
         $submission = QuizSubmission::create([
            'section_quiz_id' => $quiz->id,
            'user_id' => $data['user_id'],
            'attempts' => 1,
            'correct_answers' => 0,
            'incorrect_answers' => 0,
            'total_marks' => 0,
            'is_passed' => false,
         ]);
      }

      $totalQuestions = count($data['answers']);
      $correctAnswers = 0;

      foreach ($data['answers'] as $answer) {
         $question = QuizQuestion::findOrFail($answer['question_id']);

         // Compare submitted answer with correct answer
         $isCorrect = $this->checkAnswer($question, $answer['answer']);

         // Create question answer
         QuestionAnswer::create([
            'answers' => json_encode($answer['answer']), // Store answers as JSON
            'is_correct' => $isCorrect,
            'user_id' => $data['user_id'],
            'quiz_question_id' => $question->id,
         ]);

         if ($isCorrect) {
            $correctAnswers++;
         }
      }

      // Calculate and update score
      $score = ($correctAnswers / $totalQuestions) * $quiz->total_mark;

      // Update submission with final results
      $submission->update([
         'correct_answers' => $correctAnswers,
         'incorrect_answers' => $totalQuestions - $correctAnswers,
         'total_marks' => $score,
         'is_passed' => $score >= $quiz->pass_mark // Assuming 50% is passing score
      ]);

      return $submission;
   }

   /**
    * Check if the submitted answer matches the correct answer
    */
   private function checkAnswer(QuizQuestion $question, $submittedAnswer): bool
   {
      $correctAnswer = json_decode($question->answer, true);
      $submittedAnswer = is_array($submittedAnswer) ? $submittedAnswer : [$submittedAnswer];

      // Sort both arrays to ensure order doesn't matter
      sort($correctAnswer);
      sort($submittedAnswer);

      return $correctAnswer == $submittedAnswer;
   }
}
