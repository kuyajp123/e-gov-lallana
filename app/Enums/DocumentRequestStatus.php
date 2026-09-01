<?php

namespace App\Enums;

enum DocumentRequestStatus: string
{
    case Pending = 'pending';
    case Processing = 'processing';
    case OnHold = 'on_hold';
    case Returned = 'returned';
    case Rejected = 'rejected';
    case Completed = 'completed';
    case ReadyForPickup = 'ready_for_pickup';
    case Cancelled = 'cancelled';

    public function label(): string
    {
        return match ($this) {
            self::Pending => 'Pending Review',
            self::Processing => 'Processing',
            self::OnHold => 'On Hold',
            self::Returned => 'Returned for Correction',
            self::Rejected => 'Rejected',
            self::Completed => 'Completed',
            self::ReadyForPickup => 'Ready for Pickup',
            self::Cancelled => 'Cancelled',
        };
    }

    public function color(): string
    {
        return match ($this) {
            self::Pending => 'warning',
            self::Processing => 'info',
            self::OnHold => 'gray',
            self::Returned => 'warning',
            self::Rejected => 'danger',
            self::Completed, self::ReadyForPickup => 'success',
            self::Cancelled => 'gray',
        };
    }

    public function isActive(): bool
    {
        return in_array($this, [self::Pending, self::Processing, self::OnHold], true);
    }
}
