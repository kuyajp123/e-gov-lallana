<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class HouseholdStatusUpdatedMail extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public function __construct(
        public string $residentName,
        public string $notificationTitle,
        public string $notificationMessage,
        public ?string $actionUrl = null
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: "[Barangay Lallana] {$this->notificationTitle}",
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.household-status',
            with: [
                'residentName' => $this->residentName,
                'title' => $this->notificationTitle,
                'bodyMessage' => $this->notificationMessage,
                'actionUrl' => $this->actionUrl,
            ],
        );
    }
}
