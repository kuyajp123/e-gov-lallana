<?php

namespace App\Actions\Fortify;

use App\Concerns\PasswordValidationRules;
use App\Concerns\ProfileValidationRules;
use App\Models\User;
use App\Services\Files\FileUploadService;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Laravel\Fortify\Contracts\CreatesNewUsers;

class CreateNewUser implements CreatesNewUsers
{
    use PasswordValidationRules, ProfileValidationRules;

    /**
     * Validate and create a newly registered user.
     *
     * @param  array<string, mixed>  $input
     */
    public function create(array $input): User
    {
        // Fallback: If legacy 'name' was supplied without 'first_name', split it
        if (empty($input['first_name']) && ! empty($input['name'])) {
            $parts = explode(' ', trim((string) $input['name']), 2);
            $input['first_name'] = $parts[0];
            $input['last_name'] = $parts[1] ?? $parts[0];
        }

        Validator::make($input, [
            ...$this->profileRules(),
            'password' => $this->passwordRules(),
            'birthdate' => ['nullable', 'date', 'before:today'],
            'gender' => ['nullable', 'string', 'in:male,female,other'],
            'civil_status' => ['nullable', 'string', 'in:single,married,widowed,separated,divorced'],
            'citizenship' => ['nullable', 'string', 'max:100'],
            'religion' => ['nullable', 'string', 'max:100'],
            'residency_status' => ['nullable', 'string', 'in:official,resident,new_resident,tenant,boarder,student,temporary'],
            'date_of_residency' => ['nullable', 'date'],
            'occupation' => ['nullable', 'string', 'max:150'],
            'educational_attainment' => ['nullable', 'string', 'in:elementary,high_school,vocational,college,post_graduate,none'],
            'employment_status' => ['nullable', 'string', 'in:employed,unemployed,self_employed,student,retired'],
            'is_voter' => ['nullable', 'boolean'],
            'voter_id_number' => ['nullable', 'string', 'max:50'],
            'senior_citizen_status' => ['nullable', 'boolean'],
            'pwd_status' => ['nullable', 'boolean'],
            'pwd_id_number' => ['nullable', 'string', 'max:50'],
            'solo_parent_status' => ['nullable', 'boolean'],
            'solo_parent_id_number' => ['nullable', 'string', 'max:50'],
            'government_id' => ['nullable', 'file', 'mimes:jpg,jpeg,png,webp,pdf', 'max:5120'],
        ])->validate();

        $fullName = trim(implode(' ', array_filter([
            $input['first_name'] ?? null,
            $input['middle_name'] ?? null,
            $input['last_name'] ?? null,
            $input['suffix'] ?? null,
        ])));

        return DB::transaction(function () use ($input, $fullName): User {
            $user = User::create([
                'name' => $fullName,
                'email' => $input['email'],
                'phone_number' => $input['phone_number'] ?? null,
                'password' => $input['password'],
            ]);

            $governmentIdFileId = null;
            if (isset($input['government_id']) && $input['government_id'] instanceof UploadedFile) {
                $fileRecord = app(FileUploadService::class)->uploadGovernmentId(
                    $input['government_id'],
                    $user->id
                );
                $governmentIdFileId = $fileRecord->id;
            }

            $user->residentProfile()->create([
                'first_name' => $input['first_name'],
                'middle_name' => $input['middle_name'] ?? null,
                'last_name' => $input['last_name'],
                'suffix' => $input['suffix'] ?? null,
                'birthdate' => $input['birthdate'] ?? null,
                'gender' => $input['gender'] ?? null,
                'civil_status' => $input['civil_status'] ?? null,
                'citizenship' => $input['citizenship'] ?? 'Filipino',
                'religion' => $input['religion'] ?? null,
                'residency_status' => $input['residency_status'] ?? 'resident',
                'date_of_residency' => $input['date_of_residency'] ?? null,
                'occupation' => $input['occupation'] ?? null,
                'educational_attainment' => $input['educational_attainment'] ?? null,
                'employment_status' => $input['employment_status'] ?? null,
                'is_voter' => filter_var($input['is_voter'] ?? false, FILTER_VALIDATE_BOOLEAN),
                'voter_id_number' => $input['voter_id_number'] ?? null,
                'senior_citizen_status' => filter_var($input['senior_citizen_status'] ?? false, FILTER_VALIDATE_BOOLEAN),
                'pwd_status' => filter_var($input['pwd_status'] ?? false, FILTER_VALIDATE_BOOLEAN),
                'pwd_id_number' => $input['pwd_id_number'] ?? null,
                'solo_parent_status' => filter_var($input['solo_parent_status'] ?? false, FILTER_VALIDATE_BOOLEAN),
                'solo_parent_id_number' => $input['solo_parent_id_number'] ?? null,
                'government_id_file_id' => $governmentIdFileId,
            ]);

            return $user;
        });
    }
}
