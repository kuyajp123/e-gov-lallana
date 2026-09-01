<?php

namespace App\Http\Controllers\Resident;

use App\Http\Controllers\Controller;
use App\Http\Requests\Resident\StoreResidentProfileRequest;
use App\Http\Requests\Resident\UpdateResidentProfileRequest;
use App\Models\ResidentProfile;
use App\Models\User;
use App\Services\Files\FileUploadService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    public function show(Request $request): Response
    {
        /** @var User $user */
        $user = $request->user();
        /** @var ResidentProfile|null $profile */
        $profile = $user->residentProfile()->with(['avatar', 'governmentId'])->first();

        return Inertia::render('resident/profile/show', [
            'profile' => $profile ? [
                ...$profile->toArray(),
                'government_id_url' => $profile->governmentId?->getUrl(30),
                'avatar_url' => $profile->avatar?->getUrl(60),
            ] : null,
        ]);
    }

    public function edit(Request $request): Response
    {
        /** @var User $user */
        $user = $request->user();
        /** @var ResidentProfile|null $profile */
        $profile = $user->residentProfile()->with(['avatar', 'governmentId'])->first();

        return Inertia::render('resident/profile/edit', [
            'profile' => $profile ? [
                ...$profile->toArray(),
                'government_id_url' => $profile->governmentId?->getUrl(30),
                'avatar_url' => $profile->avatar?->getUrl(60),
            ] : null,
        ]);
    }

    public function store(StoreResidentProfileRequest $request, FileUploadService $fileUploadService): RedirectResponse
    {
        /** @var User $user */
        $user = $request->user();
        $validated = $request->validated();

        if ($request->hasFile('government_id')) {
            $fileRecord = $fileUploadService->uploadGovernmentId(
                $request->file('government_id'),
                $user->id
            );
            $validated['government_id_file_id'] = $fileRecord->id;
        }

        unset($validated['government_id']);

        ResidentProfile::updateOrCreate(
            ['user_id' => $user->id],
            $validated
        );

        return redirect()->route('resident.profile.show')->with('success', 'Resident profile saved successfully.');
    }

    public function update(UpdateResidentProfileRequest $request, FileUploadService $fileUploadService): RedirectResponse
    {
        return $this->store($request, $fileUploadService);
    }
}
