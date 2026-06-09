<?php

namespace Modules\Exam\Services;

use App\Models\ChunkedUpload;
use App\Services\BaseService;
use App\Services\LocalFileUploadService;
use App\Services\S3MultipartUploadService;
use Modules\Exam\Models\Exam;
use Modules\Exam\Models\ExamQuestion;
use Modules\Exam\Models\ExamQuestionOption;
use Illuminate\Database\Eloquent\Collection;

class ExamQuestionService extends BaseService
{
   protected LocalFileUploadService | S3MultipartUploadService $uploaderService;

   public function __construct()
   {
      $this->uploaderService = config('filesystems.default') === 's3' ? new S3MultipartUploadService() : new LocalFileUploadService();
   }

   /**
    * Get all questions for an exam
    */
   public function getExamQuestions(Exam $exam): Collection
   {
      return $exam->questions()->with('question_options')->get();
   }

   /**
    * Create a new question
    */
   public function createQuestion(array $data): ExamQuestion
   {
      // Extract question options if present
      $questionOptions = $data['question_options'] ?? [];
      unset($data['question_options']);

      if (
         array_key_exists('new_audio_url', $data['options'])
      ) {
         $data['options']['audio_url'] = $data['options']['new_audio_url'];
         unset($data['options']['new_audio_url']);
      }

      $question = ExamQuestion::create($data);

      // Create question options for multiple choice/select
      if (!empty($questionOptions)) {
         foreach ($questionOptions as $option) {
            $question->question_options()->create($option);
         }
      }

      // Update exam total marks and questions count
      $exam = Exam::find($question->exam_id);
      if ($exam) {
         $this->updateExamTotals($exam);
      }

      return $question->load('question_options');
   }

   /**
    * Update a question
    */
   public function updateQuestion(string $id, array $data): ExamQuestion
   {
      // Store exam_id before update
      $question = ExamQuestion::find($id);
      $examId = $question->exam_id;

      // Extract question options if present
      $questionOptions = $data['question_options'] ?? null;
      unset($data['question_options']);

      if (
         array_key_exists('new_audio_url', $data['options']) &&
         array_key_exists('audio_url', $data['options']) &&
         $data['options']['audio_url'] !== null
      ) {
         $chunkedUpload = ChunkedUpload::where('file_url', $data['options']['audio_url'])->first();
         $chunkedUpload && $this->uploaderService->deleteFile($chunkedUpload);
         $data['options']['audio_url'] = $data['options']['new_audio_url'];
         unset($data['options']['new_audio_url']);

         $question->update([...$data, 'options' => $data['options']]);
      } else {
         $question->update($data);
      }

      // Update question options if provided
      if ($questionOptions !== null) {
         // Delete existing options
         $question->question_options()->delete();

         // Create new options
         foreach ($questionOptions as $option) {
            // Ensure the option doesn't have an id (for new creation)
            unset($option['id']);
            $question->question_options()->create($option);
         }
      }

      // Update exam total marks and questions count
      $exam = Exam::find($examId);
      if ($exam) {
         $this->updateExamTotals($exam);
      }

      return $question->fresh(['question_options']);
   }

   /**
    * Delete a question
    */
   public function deleteQuestion(string $id): bool
   {
      $question = ExamQuestion::find($id);
      if (!$question) {
         return false;
      }

      $examId = $question->exam_id;
      $result = $question->delete();

      if ($result) {
         $exam = Exam::find($examId);
         if ($exam) {
            $this->updateExamTotals($exam);
         }
      }

      return $result;
   }

   /**
    * Update exam total marks and question count
    */
   private function updateExamTotals(Exam $exam): void
   {
      $totalMarks = $exam->questions()->sum('marks');
      $totalQuestions = $exam->questions()->count();

      $exam->update([
         'total_marks' => $totalMarks,
         'total_questions' => $totalQuestions,
      ]);
   }

   /**
    * Bulk import questions
    */
   public function bulkImportQuestions(Exam $exam, array $questions): int
   {
      $count = 0;
      foreach ($questions as $questionData) {
         $questionData['exam_id'] = $exam->id;
         $this->createQuestion($questionData);
         $count++;
      }

      return $count;
   }

   /**
    * Reorder questions
    */
   public function reorderQuestions(Exam $exam, array $questionIds): void
   {
      foreach ($questionIds as $index => $questionId) {
         ExamQuestion::where('id', $questionId)
            ->where('exam_id', $exam->id)
            ->update(['sort' => $index]);
      }
   }

   /**
    * Duplicate a question
    */
   public function duplicateQuestion(ExamQuestion $question): ExamQuestion
   {
      $newQuestion = $question->replicate();
      $newQuestion->title = $question->title . ' (Copy)';
      $newQuestion->save();

      // Duplicate options
      foreach ($question->question_options as $option) {
         $newOption = $option->replicate();
         $newOption->exam_question_id = $newQuestion->id;
         $newOption->save();
      }

      // Update exam totals
      $this->updateExamTotals($question->exam);

      return $newQuestion->load('question_options');
   }
}
