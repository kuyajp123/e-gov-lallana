<?php

namespace App\Filament\Resources\DocumentTypes\Schemas;

use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TagsInput;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Components\Grid;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class DocumentTypeForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Document Basic Information')
                    ->schema([
                        Grid::make(2)->schema([
                            TextInput::make('name')
                                ->label('Document Name')
                                ->placeholder('e.g. Barangay Clearance')
                                ->required()
                                ->maxLength(255),

                            TextInput::make('slug')
                                ->label('URL Slug')
                                ->placeholder('e.g. barangay-clearance')
                                ->required()
                                ->maxLength(255)
                                ->unique(ignoreRecord: true),
                        ]),

                        Grid::make(2)->schema([
                            TextInput::make('fee_cents')
                                ->label('Processing Fee (in Centavos)')
                                ->helperText('Enter 0 for Free/Libre, 5000 for ₱50.00, 10000 for ₱100.00')
                                ->numeric()
                                ->minValue(0)
                                ->default(0)
                                ->required(),

                            Toggle::make('is_active')
                                ->label('Active / Available to Residents')
                                ->default(true)
                                ->inline(false),
                        ]),

                        Textarea::make('description')
                            ->label('Description & Purpose')
                            ->placeholder('Describe what this document is used for...')
                            ->rows(3),

                        TagsInput::make('requirements')
                            ->label('Checklist of Required Supporting Documents')
                            ->placeholder('Add required document (press Enter)...'),
                    ]),

                Section::make('Dynamic Form Schema (Extra Questions for Resident)')
                    ->description('Configure additional questions or inputs the resident must provide when requesting this specific document type.')
                    ->schema([
                        Repeater::make('form_schema')
                            ->label('Form Fields')
                            ->schema([
                                Grid::make(3)->schema([
                                    TextInput::make('name')
                                        ->label('Field Key (snake_case)')
                                        ->placeholder('e.g. purpose, ctc_number')
                                        ->required(),

                                    TextInput::make('label')
                                        ->label('Field Label (Shown to Resident)')
                                        ->placeholder('e.g. Purpose of Request')
                                        ->required(),

                                    Select::make('type')
                                        ->label('Input Type')
                                        ->options([
                                            'text' => 'Short Text',
                                            'number' => 'Numeric Input',
                                            'textarea' => 'Long Textarea',
                                        ])
                                        ->default('text')
                                        ->required(),
                                ]),

                                Grid::make(2)->schema([
                                    TextInput::make('placeholder')
                                        ->label('Placeholder / Hint')
                                        ->placeholder('e.g. Employment, Scholarship...'),

                                    Toggle::make('required')
                                        ->label('Mandatory Field')
                                        ->default(true),
                                ]),
                            ])
                            ->defaultItems(0)
                            ->reorderable()
                            ->collapsible(),
                    ]),
            ]);
    }
}
