<?php

namespace Modules\Exam\Services;

use Modules\Exam\Models\ExamRequirement;

class ExamRequirementService
{
    public function createRequirement(array $data)
    {
        return ExamRequirement::create($data);
    }

    public function updateRequirement(array $data, string $id)
    {
        return ExamRequirement::find($id)->update($data);
    }

    public function deleteRequirement(string $id): bool
    {
        return ExamRequirement::find($id)->delete();
    }
}
