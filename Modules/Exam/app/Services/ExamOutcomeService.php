<?php

namespace Modules\Exam\Services;

use Modules\Exam\Models\ExamOutcome;

class ExamOutcomeService
{
    public function createOutcome(array $data)
    {
        return ExamOutcome::create($data);
    }

    public function updateOutcome(array $data, string $id)
    {
        return ExamOutcome::find($id)->update($data);
    }

    public function deleteOutcome(string $id): bool
    {
        return ExamOutcome::find($id)->delete();
    }
}
