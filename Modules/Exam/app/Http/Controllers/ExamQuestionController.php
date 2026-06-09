<?php

namespace Modules\Exam\Http\Controllers;

use App\Http\Controllers\Controller;
use Modules\Exam\Models\Exam;
use Modules\Exam\Models\ExamQuestion;
use Modules\Exam\Http\Requests\ExamQuestionRequest;
use Modules\Exam\Services\ExamQuestionService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ExamQuestionController extends Controller
{
   public function __construct(
      protected ExamQuestionService $question
   ) {}

   /**
    * Store a newly created question
    */
   public function store(ExamQuestionRequest $request)
   {
      $this->question->createQuestion($request->validated());

      return back()->with('success', 'Question created successfully.');
   }

   /**
    * Update the specified question
    */
   public function update(ExamQuestionRequest $request, string $id)
   {
      $this->question->updateQuestion($id, $request->all());

      return back()->with('success', 'Question updated successfully.');
   }

   /**
    * Remove the specified question
    */
   public function destroy(string $id)
   {
      $this->question->deleteQuestion($id);

      return back()->with('success', 'Question deleted successfully.');
   }

   /**
    * Reorder questions
    */
   public function reorder(Request $request)
   {
      $this->question->updateSortValues('exam_questions', $request->sortedData);

      return back()->with('success', 'Questions reordered successfully.');
   }

   /**
    * Duplicate a question
    */
   public function duplicate(ExamQuestion $question)
   {
      $this->question->duplicateQuestion($question);

      return back()->with('success', 'Question duplicated successfully.');
   }
}
