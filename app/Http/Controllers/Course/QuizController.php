<?php

namespace App\Http\Controllers\Course;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreQuizRequest;
use App\Http\Requests\UpdateQuizRequest;
use App\Services\Course\SectionQuizService;
use Illuminate\Support\Facades\Auth;

class QuizController extends Controller
{
    public function __construct(
        private SectionQuizService $quizService,
    ) {}

    public function store(StoreQuizRequest $request)
    {
        $this->quizService->createQuiz($request->validated(), Auth::user()->id);

        return back()->with('success', 'Quiz has been created.');
    }

    public function update(UpdateQuizRequest $request, string $id)
    {
        $this->quizService->updateQuiz($request->validated(), $id);

        return back()->with('success', 'Quiz has been updated.');
    }

    public function destroy(string $id)
    {
        $this->quizService->deleteQuiz($id);

        return back()->with('success', 'Quiz has been deleted.');
    }
}
