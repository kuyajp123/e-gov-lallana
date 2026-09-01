<?php

namespace App\Services\Document;

use App\Models\DocumentRequest;
use Illuminate\Support\Facades\DB;

class ReferenceCodeGenerator
{
    /**
     * Generate the next unique sequential document request reference code for the given year.
     * Format: REQ-YYYY-0001
     */
    public function generate(?int $year = null): string
    {
        $targetYear = $year ?? (int) now()->format('Y');
        $prefix = "REQ-{$targetYear}-";

        return DB::transaction(function () use ($prefix, $targetYear) {
            $latestRequest = DocumentRequest::where('reference_code', 'like', "{$prefix}%")
                ->lockForUpdate()
                ->orderByDesc('id')
                ->first();

            $nextSequence = 1;

            if ($latestRequest && preg_match('/REQ-\d{4}-(\d+)/', $latestRequest->reference_code, $matches)) {
                $nextSequence = ((int) $matches[1]) + 1;
            }

            return sprintf('REQ-%d-%04d', $targetYear, $nextSequence);
        });
    }
}
