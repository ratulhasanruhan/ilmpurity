<?php

namespace Modules\Exam\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Modules\Exam\Models\Exam;

class ExamApprovalNotification extends Notification
{
    use Queueable;

    /**
     * Create a new notification instance.
     */
    public function __construct(private Exam $exam, private array $data)
    {
        //
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail', 'database'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('Exam Approval Status Update')
            ->view('mail.exam-approval', [
                'user' => $notifiable,
                'exam' => $this->exam,
                'status' => $this->data['status'],
                'feedback' => $this->data['feedback'] ?? null,
            ]);
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        $id = $this->exam->id;
        $slug = $this->exam->slug;

        $url = route('exams.details', [$slug, $id]);

        return [
            'title' => $this->exam->status . ': ' . $this->exam->title,
            'body' => $this->data['feedback'] ?? 'Your exam status has been updated.',
            'url' => $url,
        ];
    }
}
