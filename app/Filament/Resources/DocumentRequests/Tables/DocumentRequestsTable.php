<?php

namespace App\Filament\Resources\DocumentRequests\Tables;

use App\Enums\DocumentRequestStatus;
use App\Enums\PaymentStatus;
use App\Models\DocumentRequest;
use App\Models\DocumentType;
use Filament\Actions\Action;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\ViewAction;
use Filament\Forms\Components\Textarea;
use Filament\Notifications\Notification;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Table;
use Illuminate\Support\Facades\Auth;

class DocumentRequestsTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('reference_code')
                    ->label('Ref Code')
                    ->searchable()
                    ->sortable()
                    ->weight('bold'),

                TextColumn::make('user.name')
                    ->label('Resident')
                    ->searchable()
                    ->sortable(),

                TextColumn::make('documentType.name')
                    ->label('Document Type')
                    ->searchable()
                    ->sortable(),

                TextColumn::make('current_status')
                    ->label('Status')
                    ->badge()
                    ->formatStateUsing(fn (DocumentRequestStatus $state): string => $state->label())
                    ->color(fn (DocumentRequestStatus $state): string => $state->color()),

                TextColumn::make('fee_cents')
                    ->label('Fee')
                    ->formatStateUsing(fn (int $state): string => $state === 0 ? 'Free' : '₱'.number_format($state / 100, 2))
                    ->sortable(),

                TextColumn::make('payment_status')
                    ->label('Payment')
                    ->badge()
                    ->formatStateUsing(fn (PaymentStatus $state): string => $state->label())
                    ->color(fn (PaymentStatus $state): string => $state->color()),

                TextColumn::make('submitted_at')
                    ->label('Submitted')
                    ->dateTime('M d, Y h:i A')
                    ->sortable(),
            ])
            ->filters([
                SelectFilter::make('current_status')
                    ->label('Status')
                    ->options([
                        DocumentRequestStatus::Pending->value => 'Pending Review',
                        DocumentRequestStatus::Processing->value => 'Processing',
                        DocumentRequestStatus::OnHold->value => 'On Hold',
                        DocumentRequestStatus::Returned->value => 'Returned for Correction',
                        DocumentRequestStatus::Completed->value => 'Completed',
                        DocumentRequestStatus::ReadyForPickup->value => 'Ready for Pickup',
                        DocumentRequestStatus::Rejected->value => 'Rejected',
                        DocumentRequestStatus::Cancelled->value => 'Cancelled',
                    ]),

                SelectFilter::make('document_type_id')
                    ->label('Document Type')
                    ->options(fn (): array => DocumentType::pluck('name', 'id')->all()),

                SelectFilter::make('payment_status')
                    ->label('Payment Status')
                    ->options([
                        PaymentStatus::Unpaid->value => 'Unpaid',
                        PaymentStatus::Paid->value => 'Paid',
                        PaymentStatus::Waived->value => 'Waived / Free',
                    ]),
            ])
            ->recordActions([
                ViewAction::make(),

                Action::make('start_processing')
                    ->label('Start')
                    ->icon('heroicon-o-play')
                    ->color('info')
                    ->requiresConfirmation()
                    ->visible(fn (DocumentRequest $record): bool => $record->current_status === DocumentRequestStatus::Pending)
                    ->action(function (DocumentRequest $record): void {
                        $record->transitionTo(
                            DocumentRequestStatus::Processing,
                            Auth::id(),
                            'Barangay staff started processing this request.'
                        );

                        Notification::make()
                            ->title('Processing Started')
                            ->body("Request {$record->reference_code} is now being processed.")
                            ->info()
                            ->send();
                    }),

                Action::make('mark_ready_for_pickup')
                    ->label('Ready for Pickup')
                    ->icon('heroicon-o-building-library')
                    ->color('success')
                    ->requiresConfirmation()
                    ->visible(fn (DocumentRequest $record): bool => in_array($record->current_status, [DocumentRequestStatus::Processing, DocumentRequestStatus::Completed], true))
                    ->action(function (DocumentRequest $record): void {
                        $record->transitionTo(
                            DocumentRequestStatus::ReadyForPickup,
                            Auth::id(),
                            'Document is ready for pickup at the Barangay Hall.'
                        );

                        Notification::make()
                            ->title('Ready for Pickup')
                            ->body("Request {$record->reference_code} marked as ready for pickup.")
                            ->success()
                            ->send();
                    }),

                Action::make('return_correction')
                    ->label('Return')
                    ->icon('heroicon-o-arrow-uturn-left')
                    ->color('warning')
                    ->visible(fn (DocumentRequest $record): bool => in_array($record->current_status, [DocumentRequestStatus::Pending, DocumentRequestStatus::Processing], true))
                    ->schema([
                        Textarea::make('remarks')
                            ->label('Correction Remarks')
                            ->placeholder('Specify what the resident needs to correct...')
                            ->required()
                            ->rows(3),
                    ])
                    ->action(function (DocumentRequest $record, array $data): void {
                        $record->transitionTo(
                            DocumentRequestStatus::Returned,
                            Auth::id(),
                            $data['remarks']
                        );

                        Notification::make()
                            ->title('Returned for Correction')
                            ->body("Request {$record->reference_code} returned to resident.")
                            ->warning()
                            ->send();
                    }),
            ])
            ->toolbarActions([
                BulkActionGroup::make([
                    DeleteBulkAction::make()
                        ->visible(fn (): bool => Auth::user()?->isAdmin() ?? false),
                ]),
            ]);
    }
}
