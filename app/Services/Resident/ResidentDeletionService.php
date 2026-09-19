<?php

namespace App\Services\Resident;

use App\Models\DocumentRequest;
use App\Models\FileRecord;
use App\Models\HouseholdMember;
use App\Models\ResidentProfile;
use App\Models\User;
use App\Services\Household\HouseholdSuccessionService;
use DomainException;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class ResidentDeletionService
{
    public function __construct(
        protected HouseholdSuccessionService $successionService,
    ) {}

    /**
     * Permanently delete a resident profile, user account, files from cloud storage,
     * and clean up or delete their household if they are the sole member.
     *
     * @throws DomainException
     */
    public function delete(ResidentProfile $residentProfile): void
    {
        $user = $residentProfile->user;

        if ($user->isAdmin() || $user->isSubAdmin() || $user->isSuperAdmin()) {
            throw new DomainException('Administrative and staff accounts cannot be deleted as resident profiles.');
        }

        DB::transaction(function () use ($residentProfile, $user) {
            // 1. Collect all file records associated with this resident
            $fileIds = collect();

            if ($residentProfile->avatar_file_id) {
                $fileIds->push($residentProfile->avatar_file_id);
            }

            if ($residentProfile->government_id_file_id) {
                $fileIds->push($residentProfile->government_id_file_id);
            }

            // User's own file uploads
            $userFileIds = FileRecord::where('user_id', $user->id)->pluck('id');
            $fileIds = $fileIds->merge($userFileIds);

            // Document request files
            $documentRequests = DocumentRequest::where('user_id', $user->id)->get();
            foreach ($documentRequests as $docReq) {
                if ($docReq->generated_pdf_file_id) {
                    $fileIds->push($docReq->generated_pdf_file_id);
                }
                $docFiles = $docReq->fileRecords()->pluck('files.id');
                $fileIds = $fileIds->merge($docFiles);
            }

            $uniqueFileIds = $fileIds->filter()->unique();

            // Purge physical files from storage and delete FileRecord models
            if ($uniqueFileIds->isNotEmpty()) {
                $files = FileRecord::whereIn('id', $uniqueFileIds)->get();
                foreach ($files as $file) {
                    try {
                        if ($file->disk && Storage::disk($file->disk)->exists($file->path)) {
                            Storage::disk($file->disk)->delete($file->path);
                        }
                    } catch (\Throwable $e) {
                        Log::warning("Failed to delete physical file {$file->path} on disk {$file->disk}: {$e->getMessage()}");
                    }

                    // Detach from document_request_files pivot if exists
                    DB::table('document_request_files')->where('file_id', $file->id)->delete();
                    $file->delete();
                }
            }

            // 2. Household cleanup
            $member = HouseholdMember::where('user_id', $user->id)->first();
            if ($member) {
                $household = $member->household;
                $remainingCount = $household->members()->where('id', '!=', $member->id)->count();

                if ($remainingCount === 0) {
                    // Sole occupant: delete member and the entire household
                    $member->delete();
                    $household->delete();
                } else {
                    // Multi-occupant: if family head, transfer succession; otherwise remove member
                    if ($member->is_family_head || $household->family_head_id === $user->id) {
                        $this->successionService->handleHeadDeletion(
                            $household,
                            deletedHeadUserId: $user->id,
                            deletedHeadMemberId: $member->id
                        );
                    } else {
                        $member->delete();
                    }
                }
            }

            // 3. Document requests cleanup
            foreach ($documentRequests as $docReq) {
                $docReq->statusHistory()->delete();
                $docReq->delete();
            }

            // 4. Delete ResidentProfile and User (cascades notifications, verification, etc.)
            $residentProfile->delete();
            $user->delete();
        });
    }
}
