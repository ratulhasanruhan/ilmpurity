<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Modules\Exam\Services\ExamAttemptService;

class ExpireExamAttempts extends Command
{
    protected $signature = 'exams:expire-attempts';

    protected $description = 'Submit exam attempts whose timer has expired';

    public function handle(ExamAttemptService $attemptService): int
    {
        $expired = $attemptService->expireOverdueAttempts();
        $this->info("Submitted {$expired} expired exam attempt(s).");

        return self::SUCCESS;
    }
}
