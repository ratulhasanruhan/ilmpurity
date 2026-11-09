<?php

namespace App\Services;

use App\Models\Setting;
use App\Models\User;
use App\Models\WhatsappMessageLog;
use App\Models\WhatsappPreference;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class WhatsAppService
{
    public function dispatchDueMessages(): int
    {
        $fields = $this->settings();
        if (empty($fields['active'])) {
            return 0;
        }

        $now = now();
        $sent = 0;

        $minute = $now->format('H:i');

        WhatsappPreference::query()
            ->with('user')
            ->where('enabled', true)
            ->where(function ($query) use ($now) {
                $query->whereNull('last_sent_on')
                    ->orWhereDate('last_sent_on', '<', $now->toDateString());
            })
            ->orderBy('id')
            ->chunkById(100, function ($preferences) use ($fields, $minute, &$sent) {
                foreach ($preferences as $preference) {
                    $preferredMinute = substr((string) $preference->preferred_time, 0, 5);
                    if ($preferredMinute !== $minute || !$preference->user) {
                        continue;
                    }

                    $result = $this->deliver($preference->user, $preference->phone, $fields, $this->renderMessage($preference->user, $fields));
                    if ($result['ok']) {
                        $preference->update(['last_sent_on' => now()->toDateString()]);
                        $sent++;
                    }
                }
            });

        return $sent;
    }

    public function sendTest(string $phone, ?User $user = null): array
    {
        $fields = $this->settings();
        if (empty($fields['active'])) {
            return ['ok' => false, 'message' => 'Turn on WhatsApp messaging and save the settings first.'];
        }

        $recipient = $user ?? new User(['name' => 'Student']);
        $result = $this->deliver($user, $this->normalizePhone($phone), $fields, $this->renderMessage($recipient, $fields));

        return [
            'ok' => $result['ok'],
            'message' => $result['ok'] ? 'Test WhatsApp message sent.' : $result['message'],
        ];
    }

    public function savePreference(User $user, array $data): WhatsappPreference
    {
        $time = strlen($data['preferred_time']) === 5
            ? $data['preferred_time'] . ':00'
            : $data['preferred_time'];

        return WhatsappPreference::updateOrCreate(
            ['user_id' => $user->id],
            [
                'phone' => $this->normalizePhone($data['phone']),
                'preferred_time' => $time,
                'enabled' => (bool) $data['enabled'],
            ]
        );
    }

    private function deliver(?User $user, string $phone, array $fields, string $message): array
    {
        $phone = $this->normalizePhone($phone);

        try {
            $response = $fields['provider'] === 'webhook'
                ? $this->sendWebhook($phone, $message, $fields, $user)
                : $this->sendMeta($phone, $message, $fields, $user);

            $ok = $response->successful();
            $body = $response->body();

            WhatsappMessageLog::create([
                'user_id' => $user?->id,
                'phone' => $phone,
                'message' => $message,
                'status' => $ok ? 'sent' : 'failed',
                'response' => mb_substr($body, 0, 2000),
                'sent_at' => now(),
            ]);

            if (!$ok) {
                Log::warning('WhatsApp message failed', ['phone' => $phone, 'response' => $body]);
            }

            return [
                'ok' => $ok,
                'message' => $ok ? 'Message sent.' : 'WhatsApp provider rejected the message. Check the API settings and the message log.',
            ];
        } catch (\Throwable $exception) {
            WhatsappMessageLog::create([
                'user_id' => $user?->id,
                'phone' => $phone,
                'message' => $message,
                'status' => 'failed',
                'response' => mb_substr($exception->getMessage(), 0, 2000),
                'sent_at' => now(),
            ]);

            Log::error('WhatsApp message exception', ['phone' => $phone, 'error' => $exception->getMessage()]);

            return ['ok' => false, 'message' => $exception->getMessage()];
        }
    }

    private function sendMeta(string $phone, string $message, array $fields, ?User $user)
    {
        $phoneNumberId = $fields['phone_number_id'] ?? '';
        $token = $fields['access_token'] ?? '';

        if ($phoneNumberId === '' || $token === '') {
            throw new \RuntimeException('WhatsApp Cloud API phone number ID and access token are required.');
        }

        $payload = ($fields['send_mode'] ?? 'text') === 'template'
            ? [
                'messaging_product' => 'whatsapp',
                'to' => $phone,
                'type' => 'template',
                'template' => [
                    'name' => $fields['template_name'] ?? '',
                    'language' => ['code' => $fields['template_language'] ?: 'en'],
                    'components' => [[
                        'type' => 'body',
                        'parameters' => [[
                            'type' => 'text',
                            'text' => $user?->name ?: 'Student',
                        ]],
                    ]],
                ],
            ]
            : [
                'messaging_product' => 'whatsapp',
                'to' => $phone,
                'type' => 'text',
                'text' => ['body' => $message],
            ];

        return Http::withToken($token)
            ->acceptJson()
            ->post("https://graph.facebook.com/v21.0/{$phoneNumberId}/messages", $payload);
    }

    private function sendWebhook(string $phone, string $message, array $fields, ?User $user)
    {
        $url = $fields['api_url'] ?? '';
        if ($url === '') {
            throw new \RuntimeException('WhatsApp webhook URL is required.');
        }

        $request = Http::acceptJson();
        if (!empty($fields['access_token'])) {
            $request = $request->withToken($fields['access_token']);
        }

        return $request->post($url, [
            'to' => $phone,
            'phone' => $phone,
            'message' => $message,
            'name' => $user?->name,
        ]);
    }

    private function renderMessage(User $user, array $fields): string
    {
        $template = trim((string) ($fields['message_template'] ?? ''));
        if ($template === '') {
            $template = 'Hello {name}, this is your scheduled reminder from {app}.';
        }

        return str_replace(
            ['{name}', '{app}'],
            [$user->name ?: 'Student', config('app.name')],
            $template
        );
    }

    public function normalizePhone(string $phone): string
    {
        return preg_replace('/\D+/', '', $phone) ?? '';
    }

    private function settings(): array
    {
        $setting = Setting::query()->where('type', 'whatsapp')->first();

        return $setting?->fields ?? [];
    }
}
