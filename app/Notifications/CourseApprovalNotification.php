<?php

namespace App\Notifications;

use App\Models\Course\Course;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class CourseApprovalNotification extends Notification
{
    use Queueable;

    /**
     * Create a new notification instance.
     */
    public function __construct(private Course $course, private array $data)
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
            ->subject('Course Approval Status Update')
            ->view('mail.course-approval', [
                'user' => $notifiable,
                'course' => $this->course,
                'status' => $this->data['status'],
                'feedback' => $this->data['feedback'],
            ]);
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        $id = $this->course->id;
        $slug = $this->course->slug;

        $url = route('course.details', [$slug, $id]);

        if ($this->course->created_from == 'api') {
            $url = config('app.frontend_url') . "/courses/$slug/$id";
        }

        return [
            'title' => $this->course->status . ': ' . $this->course->title,
            'body' => $this->data['feedback'],
            'url' => $url,
        ];
    }
}
