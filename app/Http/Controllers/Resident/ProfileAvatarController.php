<?php

namespace App\Http\Controllers\Resident;

use App\Http\Controllers\Controller;
use App\Models\ResidentProfile;
use App\Models\User;
use App\Services\Files\FileUploadService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class ProfileAvatarController extends Controller
{
    public function update(Request $request, FileUploadService $fileUploadService): RedirectResponse
    {
        $request->validate([
            'avatar' => ['required', 'image', 'mimes:jpg,jpeg,png,webp', 'max:2048'],
        ]);

        /** @var User $user */
        $user = $request->user();
        $fileRecord = $fileUploadService->uploadAvatar($request->file('avatar'), $user->id);

        /** @var ResidentProfile|null $profile */
        $profile = $user->residentProfile;

        ResidentProfile::updateOrCreate(
            ['user_id' => $user->id],
            [
                'avatar_file_id' => $fileRecord->id,
                'first_name' => $profile !== null ? $profile->first_name : $user->name,
                'last_name' => $profile !== null ? $profile->last_name : '',
            ]
        );

        return back()->with('success', 'Profile photo updated successfully.');
    }
}
