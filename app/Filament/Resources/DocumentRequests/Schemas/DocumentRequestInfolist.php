<?php

namespace App\Filament\Resources\DocumentRequests\Schemas;

use App\Enums\DocumentRequestStatus;
use App\Enums\PaymentStatus;
use App\Models\DocumentRequest;
use Filament\Infolists\Components\RepeatableEntry;
use Filament\Infolists\Components\TextEntry;
use Filament\Schemas\Components\Grid;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class DocumentRequestInfolist
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Request Overview')
                    ->schema([
                        Grid::make(3)->schema([
                            TextEntry::make('reference_code')
                                ->label('Reference Code')
                                ->weight('bold'),
                            TextEntry::make('current_status')
                                ->label('Status')
                                ->badge()
                                ->formatStateUsing(fn (DocumentRequestStatus $state): string => $state->label())
                                ->color(fn (DocumentRequestStatus $state): string => $state->color()),
                            TextEntry::make('documentType.name')
                                ->label('Document Type')
                                ->weight('medium'),
                        ]),
                        Grid::make(3)->schema([
                            TextEntry::make('formatted_fee')
                                ->label('Fee Amount'),
                            TextEntry::make('payment_status')
                                ->label('Payment Status')
                                ->badge()
                                ->formatStateUsing(fn (PaymentStatus $state): string => $state->label())
                                ->color(fn (PaymentStatus $state): string => $state->color()),
                            TextEntry::make('submitted_at')
                                ->label('Submitted At')
                                ->dateTime('M d, Y h:i A'),
                        ]),
                        TextEntry::make('purpose')
                            ->label('Stated Purpose')
                            ->placeholder('No purpose provided'),
                        TextEntry::make('admin_notes')
                            ->label('Internal Admin Notes')
                            ->placeholder('None recorded'),
                    ]),

                Section::make('Resident Information')
                    ->schema([
                        Grid::make(3)->schema([
                            TextEntry::make('user.name')
                                ->label('Full Name')
                                ->weight('bold'),
                            TextEntry::make('user.email')
                                ->label('Email Address'),
                            TextEntry::make('user.phone_number')
                                ->label('Phone Number')
                                ->placeholder('—'),
                        ]),
                    ]),

                Section::make('Cancellation Details')
                    ->visible(fn (DocumentRequest $record): bool => $record->current_status === DocumentRequestStatus::Cancelled)
                    ->schema([
                        Grid::make(2)->schema([
                            TextEntry::make('cancellation_reason')
                                ->label('Cancellation Reason')
                                ->formatStateUsing(fn ($state): string => $state?->label() ?? '—'),
                            TextEntry::make('cancelled_at')
                                ->label('Cancelled At')
                                ->dateTime('M d, Y h:i A'),
                        ]),
                        TextEntry::make('cancellation_notes')
                            ->label('Resident Notes')
                            ->placeholder('None provided'),
                    ]),

                Section::make('Dynamic Form Submissions')
                    ->schema([
                        TextEntry::make('submitted_data')
                            ->label('Submitted Fields')
                            ->formatStateUsing(function ($state): string {
                                if (empty($state) || ! is_array($state)) {
                                    return 'No additional dynamic fields.';
                                }
                                $lines = [];
                                foreach ($state as $key => $val) {
                                    $label = ucwords(str_replace('_', ' ', (string) $key));
                                    $value = is_array($val) ? json_encode($val) : (string) $val;
                                    $lines[] = "**{$label}:** {$value}";
                                }

                                return implode("\n\n", $lines);
                            })
                            ->markdown(),
                    ]),

                Section::make('Attached Documents & Government ID')
                    ->schema([
                        RepeatableEntry::make('files')
                            ->label('Uploaded Files')
                            ->schema([
                                Grid::make(3)->schema([
                                    TextEntry::make('file_type')
                                        ->label('File Type')
                                        ->badge()
                                        ->color(fn (string $state): string => $state === 'government_id' ? 'primary' : 'gray'),
                                    TextEntry::make('fileRecord.file_name')
                                        ->label('File Name')
                                        ->weight('bold'),
                                    TextEntry::make('purpose')
                                        ->label('Purpose / Note')
                                        ->placeholder('—'),
                                ]),
                            ]),
                    ]),

                Section::make('Status History & Audit Trail')
                    ->schema([
                        RepeatableEntry::make('statusHistory')
                            ->label('Transition Log')
                            ->schema([
                                Grid::make(4)->schema([
                                    TextEntry::make('status')
                                        ->label('Status')
                                        ->badge()
                                        ->color('info'),
                                    TextEntry::make('changedByUser.name')
                                        ->label('Changed By')
                                        ->placeholder('System'),
                                    TextEntry::make('created_at')
                                        ->label('Date & Time')
                                        ->dateTime('M d, Y h:i A'),
                                    TextEntry::make('remarks')
                                        ->label('Remarks')
                                        ->placeholder('No remarks'),
                                ]),
                            ]),
                    ]),
            ]);
    }
}
