<?php

namespace App\Services\Files;

use App\Models\FileRecord;
use Illuminate\Http\UploadedFile;

class FileUploadService
{
    /**
     * Store an uploaded file and create its database record.
     */
    public function upload(
        UploadedFile $file,
        string $folder = '',
        ?int $userId = null,
        ?string $disk = null,
        ?string $bucket = null,
        bool $isPrivate = true
    ): FileRecord {
        $storageDisk = $disk ?? (string) config('filesystems.default', 'local');
        $path = $folder !== '' ? $file->store($folder, $storageDisk) : $file->store($storageDisk);

        return FileRecord::create([
            'user_id' => $userId,
            'file_name' => $file->getClientOriginalName(),
            'disk' => $storageDisk,
            'bucket' => $bucket,
            'path' => $path,
            'mime_type' => $file->getMimeType() ?: $file->getClientMimeType(),
            'size_bytes' => $file->getSize() ?: null,
            'is_private' => $isPrivate,
        ]);
    }

    /**
     * Upload a Government ID document.
     */
    public function uploadGovernmentId(UploadedFile $file, ?int $userId = null): FileRecord
    {
        return $this->upload(
            file: $file,
            folder: '',
            userId: $userId,
            disk: 'government-ids',
            bucket: 'government-ids',
            isPrivate: true
        );
    }

    /**
     * Upload a user profile avatar.
     */
    public function uploadAvatar(UploadedFile $file, ?int $userId = null): FileRecord
    {
        return $this->upload(
            file: $file,
            folder: '',
            userId: $userId,
            disk: 'avatars',
            bucket: 'avatars',
            isPrivate: false
        );
    }

    /**
     * Upload a supporting verification document.
     */
    public function uploadVerificationDocument(UploadedFile $file, ?int $userId = null): FileRecord
    {
        return $this->upload(
            file: $file,
            folder: '',
            userId: $userId,
            disk: 'verification-documents',
            bucket: 'verification-documents',
            isPrivate: true
        );
    }

    /**
     * Upload an announcement attachment.
     */
    public function uploadAnnouncementAttachment(UploadedFile $file, ?int $userId = null): FileRecord
    {
        return $this->upload(
            file: $file,
            folder: '',
            userId: $userId,
            disk: 'announcement-attachments',
            bucket: 'announcement-attachments',
            isPrivate: false
        );
    }
}
