<?php

use App\Models\Setting;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasTable('settings')) {
            return;
        }

        Setting::firstOrCreate(
            ['type' => 'whatsapp'],
            [
                'sub_type' => null,
                'title' => 'WhatsApp Settings',
                'fields' => [
                    'active' => false,
                    'provider' => 'meta',
                    'send_mode' => 'text',
                    'phone_number_id' => '',
                    'access_token' => '',
                    'api_url' => '',
                    'template_name' => '',
                    'template_language' => 'en',
                    'message_template' => 'Hello {name}, this is your scheduled reminder from {app}.',
                ],
            ]
        );
    }

    public function down(): void
    {
        if (Schema::hasTable('settings')) {
            Setting::where('type', 'whatsapp')->delete();
        }
    }
};
