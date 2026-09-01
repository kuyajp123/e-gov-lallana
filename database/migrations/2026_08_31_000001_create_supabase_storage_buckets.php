<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * The Supabase Storage buckets to create.
     *
     * @var list<array{id: string, name: string, public: bool, file_size_limit: int, allowed_mime_types: list<string>}>
     */
    protected array $buckets = [
        [
            'id' => 'government-ids',
            'name' => 'government-ids',
            'public' => false,
            'file_size_limit' => 5242880, // 5 MB
            'allowed_mime_types' => ['image/jpeg', 'image/png', 'application/pdf'],
        ],
        [
            'id' => 'avatars',
            'name' => 'avatars',
            'public' => true,
            'file_size_limit' => 2097152, // 2 MB
            'allowed_mime_types' => ['image/jpeg', 'image/png', 'image/webp'],
        ],
        [
            'id' => 'verification-documents',
            'name' => 'verification-documents',
            'public' => false,
            'file_size_limit' => 10485760, // 10 MB
            'allowed_mime_types' => ['image/jpeg', 'image/png', 'application/pdf'],
        ],
        [
            'id' => 'announcement-attachments',
            'name' => 'announcement-attachments',
            'public' => true,
            'file_size_limit' => 10485760, // 10 MB
            'allowed_mime_types' => ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'],
        ],
    ];

    /**
     * Run the migrations.
     */
    public function up(): void
    {
        if (DB::getDriverName() !== 'pgsql') {
            return;
        }

        $hasStorageSchema = (bool) (DB::select("
            SELECT EXISTS (
                SELECT FROM information_schema.tables 
                WHERE table_schema = 'storage' 
                AND table_name = 'buckets'
            ) AS exists;
        ")[0]->exists ?? false);

        if (! $hasStorageSchema) {
            return;
        }

        foreach ($this->buckets as $bucket) {
            $mimeTypesArray = "'{".implode(',', $bucket['allowed_mime_types'])."}'";
            $isPublic = $bucket['public'] ? 'true' : 'false';

            DB::statement("
                INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types, created_at, updated_at)
                VALUES (
                    '{$bucket['id']}',
                    '{$bucket['name']}',
                    {$isPublic},
                    {$bucket['file_size_limit']},
                    {$mimeTypesArray}::text[],
                    NOW(),
                    NOW()
                )
                ON CONFLICT (id) DO UPDATE SET
                    public = EXCLUDED.public,
                    file_size_limit = EXCLUDED.file_size_limit,
                    allowed_mime_types = EXCLUDED.allowed_mime_types,
                    updated_at = NOW();
            ");
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (DB::getDriverName() !== 'pgsql') {
            return;
        }

        $hasStorageSchema = (bool) (DB::select("
            SELECT EXISTS (
                SELECT FROM information_schema.tables 
                WHERE table_schema = 'storage' 
                AND table_name = 'buckets'
            ) AS exists;
        ")[0]->exists ?? false);

        if (! $hasStorageSchema) {
            return;
        }

        $bucketIds = implode("','", array_column($this->buckets, 'id'));
        DB::statement("DELETE FROM storage.buckets WHERE id IN ('{$bucketIds}');");
    }
};
