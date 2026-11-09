<?php

namespace App\Console\Commands;

use App\Services\WhatsAppService;
use Illuminate\Console\Command;

class SendScheduledWhatsApp extends Command
{
    protected $signature = 'whatsapp:send-scheduled';

    protected $description = 'Send WhatsApp reminders to students at their preferred time';

    public function handle(WhatsAppService $whatsAppService): int
    {
        $sent = $whatsAppService->dispatchDueMessages();
        $this->info("Sent {$sent} WhatsApp message(s).");

        return self::SUCCESS;
    }
}
