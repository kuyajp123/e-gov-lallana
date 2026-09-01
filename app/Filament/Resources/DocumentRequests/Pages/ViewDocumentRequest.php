<?php

namespace App\Filament\Resources\DocumentRequests\Pages;

use App\Enums\DocumentRequestStatus;
use App\Enums\PaymentStatus;
use App\Filament\Resources\DocumentRequests\DocumentRequestResource;
use App\Models\DocumentRequest;
use Filament\Actions\Action;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Notifications\Notification;
use Filament\Resources\Pages\ViewRecord;
use Illuminate\Support\Facades\Auth;

/**
 * @property DocumentRequest $record
 */
class ViewDocumentRequest extends ViewRecord
{
    protected static string $resource = DocumentRequestResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Action::make('start_processing')
                ->label('Start Processing')
                ->icon('heroicon-o-play')
                ->color('info')
                ->requiresConfirmation()
                ->visible(fn (): bool => $this->record->current_status === DocumentRequestStatus::Pending)
                ->action(function (): void {
                    $this->record->transitionTo(
                        DocumentRequestStatus::Processing,
                        Auth::id(),
                        'Barangay staff started processing this request.'
                    );

                    Notification::make()
                        ->title('Processing Started')
                        ->body("Document request {$this->record->reference_code} is now being processed.")
                        ->info()
                        ->send();

                    $this->refreshFormData(['current_status']);
                }),

            Action::make('put_on_hold')
                ->label('Put On Hold')
                ->icon('heroicon-o-pause')
                ->color('gray')
                ->visible(fn (): bool => $this->record->current_status === DocumentRequestStatus::Processing)
                ->schema([
                    Textarea::make('reason')
                        ->label('Reason for Holding')
                        ->placeholder('e.g. Awaiting barangay captain signature, document printing queue...')
                        ->required()
                        ->rows(3),
                ])
                ->action(function (array $data): void {
                    $this->record->transitionTo(
                        DocumentRequestStatus::OnHold,
                        Auth::id(),
                        'Request put on hold: '.$data['reason']
                    );

                    Notification::make()
                        ->title('Request On Hold')
                        ->body("Document request {$this->record->reference_code} is currently on hold.")
                        ->send();

                    $this->refreshFormData(['current_status']);
                }),

            Action::make('resume_processing')
                ->label('Resume Processing')
                ->icon('heroicon-o-arrow-path')
                ->color('info')
                ->requiresConfirmation()
                ->visible(fn (): bool => $this->record->current_status === DocumentRequestStatus::OnHold)
                ->action(function (): void {
                    $this->record->transitionTo(
                        DocumentRequestStatus::Processing,
                        Auth::id(),
                        'Processing resumed by barangay staff.'
                    );

                    Notification::make()
                        ->title('Processing Resumed')
                        ->body("Document request {$this->record->reference_code} is back in processing.")
                        ->info()
                        ->send();

                    $this->refreshFormData(['current_status']);
                }),

            Action::make('return_correction')
                ->label('Return for Correction')
                ->icon('heroicon-o-arrow-uturn-left')
                ->color('warning')
                ->visible(fn (): bool => in_array($this->record->current_status, [DocumentRequestStatus::Pending, DocumentRequestStatus::Processing], true))
                ->schema([
                    Textarea::make('remarks')
                        ->label('Correction Remarks')
                        ->placeholder('Specify what information or documents the resident needs to correct/resubmit...')
                        ->required()
                        ->rows(3),
                ])
                ->action(function (array $data): void {
                    $this->record->transitionTo(
                        DocumentRequestStatus::Returned,
                        Auth::id(),
                        $data['remarks']
                    );

                    Notification::make()
                        ->title('Returned for Correction')
                        ->body("Document request {$this->record->reference_code} returned to resident.")
                        ->warning()
                        ->send();

                    $this->refreshFormData(['current_status']);
                }),

            Action::make('reject')
                ->label('Reject Request')
                ->icon('heroicon-o-x-circle')
                ->color('danger')
                ->visible(fn (): bool => in_array($this->record->current_status, [DocumentRequestStatus::Pending, DocumentRequestStatus::Processing], true))
                ->schema([
                    Textarea::make('remarks')
                        ->label('Rejection Reason')
                        ->placeholder('State official reason for rejecting this document request...')
                        ->required()
                        ->rows(3),
                ])
                ->action(function (array $data): void {
                    $this->record->transitionTo(
                        DocumentRequestStatus::Rejected,
                        Auth::id(),
                        $data['remarks']
                    );

                    Notification::make()
                        ->title('Request Rejected')
                        ->body("Document request {$this->record->reference_code} has been rejected.")
                        ->danger()
                        ->send();

                    $this->refreshFormData(['current_status']);
                }),

            Action::make('mark_completed')
                ->label('Mark Completed')
                ->icon('heroicon-o-check')
                ->color('success')
                ->requiresConfirmation()
                ->visible(fn (): bool => $this->record->current_status === DocumentRequestStatus::Processing)
                ->action(function (): void {
                    $this->record->transitionTo(
                        DocumentRequestStatus::Completed,
                        Auth::id(),
                        'Document processed and signed.'
                    );

                    Notification::make()
                        ->title('Document Completed')
                        ->body("Document request {$this->record->reference_code} marked as completed.")
                        ->success()
                        ->send();

                    $this->refreshFormData(['current_status']);
                }),

            Action::make('mark_ready_for_pickup')
                ->label('Ready for Pickup')
                ->icon('heroicon-o-building-library')
                ->color('success')
                ->requiresConfirmation()
                ->visible(fn (): bool => in_array($this->record->current_status, [DocumentRequestStatus::Processing, DocumentRequestStatus::Completed], true))
                ->action(function (): void {
                    $this->record->transitionTo(
                        DocumentRequestStatus::ReadyForPickup,
                        Auth::id(),
                        'Document is printed, signed, and ready for physical pickup at Barangay Hall.'
                    );

                    Notification::make()
                        ->title('Ready for Pickup')
                        ->body("Document request {$this->record->reference_code} is ready for pickup.")
                        ->success()
                        ->send();

                    $this->refreshFormData(['current_status']);
                }),

            Action::make('update_payment')
                ->label('Update Payment')
                ->icon('heroicon-o-banknotes')
                ->color('primary')
                ->schema([
                    Select::make('payment_status')
                        ->label('Payment Status')
                        ->options([
                            PaymentStatus::Unpaid->value => 'Unpaid',
                            PaymentStatus::Paid->value => 'Paid',
                            PaymentStatus::Waived->value => 'Waived / Free',
                        ])
                        ->default(fn (): string => $this->record->payment_status->value)
                        ->required(),
                ])
                ->action(function (array $data): void {
                    $newStatus = PaymentStatus::from($data['payment_status']);
                    $this->record->update(['payment_status' => $newStatus]);

                    Notification::make()
                        ->title('Payment Status Updated')
                        ->body("Payment status updated to {$newStatus->label()}.")
                        ->success()
                        ->send();

                    $this->refreshFormData(['payment_status']);
                }),
        ];
    }
}
