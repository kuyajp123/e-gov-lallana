<?php

namespace App\Enums;

enum CancellationReason: string
{
    case NoLongerNeeded = 'no_longer_needed';
    case WrongDocument = 'wrong_document';
    case DuplicateRequest = 'duplicate_request';
    case IncorrectInformation = 'incorrect_information';
    case Other = 'other';

    public function label(): string
    {
        return match ($this) {
            self::NoLongerNeeded => 'No longer needed',
            self::WrongDocument => 'Requested wrong document type',
            self::DuplicateRequest => 'Duplicate request submitted',
            self::IncorrectInformation => 'Incorrect information entered',
            self::Other => 'Other reason',
        };
    }
}
