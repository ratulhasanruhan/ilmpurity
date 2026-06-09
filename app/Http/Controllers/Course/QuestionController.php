<?php

namespace App\Http\Controllers\Course;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreQuestionRequest;
use App\Http\Requests\UpdateQuestionRequest;
use App\Services\Course\QuizQuestionService;
use Illuminate\Http\Request;

class QuestionController extends Controller
{
    public function __construct(
        private QuizQuestionService $questionService,
    ) {}

    public function store(StoreQuestionRequest $request)
    {
        $this->questionService->createQuestion($request->validated());

        return back()->with('success', 'Question has been added.');
    }

    public function update(UpdateQuestionRequest $request, $id)
    {
        $this->questionService->updateQuestion($request->validated(), $id);

        return back()->with('success', 'Question has been updated.');
    }

    public function delete($id)
    {
        $this->questionService->deleteQuestion($id);

        return back()->with('success', 'Question has been deleted.');
    }

    public function sort(Request $request)
    {
        $this->questionService->sortQuestions($request->sortedData);

        return back()->with('success', 'Sections sorted successfully');
    }
}
