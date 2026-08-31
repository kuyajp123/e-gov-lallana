<?php

namespace App\Services\Household;

use App\Models\Household;
use Illuminate\Support\Facades\DB;

class HouseholdCodeGenerator
{
    /**
     * Generate the next unique sequential household code for the given year.
     * Format: HH-YYYY-0001
     */
    public function generate(?int $year = null): string
    {
        $targetYear = $year ?? (int) now()->format('Y');
        $prefix = "HH-{$targetYear}-";

        return DB::transaction(function () use ($prefix, $targetYear) {
            // Find the highest sequence number for this year
            $latestHousehold = Household::where('household_code', 'like', "{$prefix}%")
                ->lockForUpdate()
                ->orderByDesc('id')
                ->first();

            $nextSequence = 1;

            if ($latestHousehold && preg_match('/HH-\d{4}-(\d+)/', $latestHousehold->household_code, $matches)) {
                $nextSequence = ((int) $matches[1]) + 1;
            }

            return sprintf('HH-%d-%04d', $targetYear, $nextSequence);
        });
    }
}
