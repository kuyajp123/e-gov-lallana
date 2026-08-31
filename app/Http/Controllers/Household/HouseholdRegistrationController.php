<?php

namespace App\Http\Controllers\Household;

use App\Http\Controllers\Controller;
use App\Http\Requests\Household\RegisterHouseholdRequest;
use App\Models\Household;
use App\Models\HouseholdMember;
use App\Models\ResidentProfile;
use App\Models\User;
use App\Services\Auth\OtpService;
use App\Services\Household\HouseholdCodeGenerator;
use App\Services\Sms\SmsManager;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class HouseholdRegistrationController extends Controller
{
    public function create(Request $request): Response|RedirectResponse
    {
        /** @var User $user */
        $user = $request->user();

        // Check if user already has an associated household
        $existingHousehold = Household::where('family_head_id', $user->id)->first()
            ?? HouseholdMember::where('user_id', $user->id)->first()?->household;

        if ($existingHousehold) {
            return redirect()->route('household.index');
        }

        /** @var ResidentProfile|null $profile */
        $profile = $user->residentProfile()->with(['governmentId'])->first();

        return Inertia::render('household/register', [
            'profile' => $profile ? [
                ...$profile->toArray(),
                'government_id_url' => $profile->governmentId?->getUrl(30),
            ] : null,
            'purokOptions' => [
                'Purok 1',
                'Purok 2',
                'Purok 3',
                'Purok 4',
                'Purok 5',
                'Purok 6',
                'Purok 7',
                'Sitio Pag-Asa',
                'Sitio Maharlika',
            ],
        ]);
    }

    public function sendOtp(Request $request, OtpService $otpService): JsonResponse
    {
        $request->validate([
            'channel' => ['required', 'string', 'in:sms,email'],
        ]);

        /** @var User $user */
        $user = $request->user();
        $channel = (string) $request->input('channel');

        $identifier = $channel === 'sms'
            ? ($user->phone_number ?? (string) $request->input('phone_number'))
            : $user->email;

        if (empty($identifier)) {
            return response()->json([
                'success' => false,
                'message' => 'No contact information found for the selected channel.',
            ], 422);
        }

        if (! $otpService->canResend($identifier, 'household_registration')) {
            $cooldown = $otpService->getRemainingCooldown($identifier, 'household_registration');

            return response()->json([
                'success' => false,
                'message' => "Please wait {$cooldown} seconds before requesting a new OTP.",
                'cooldown' => $cooldown,
            ], 429);
        }

        $otp = $otpService->generate($identifier, 'household_registration');

        if ($channel === 'sms') {
            SmsManager::createDriver()->send(
                $identifier,
                "Your Barangay Lallana household registration OTP code is: {$otp}. Valid for 5 minutes."
            );
        }

        return response()->json([
            'success' => true,
            'message' => "OTP code dispatched via {$channel}.",
            'channel' => $channel,
            'cooldown' => OtpService::COOLDOWN_SECONDS,
        ]);
    }

    public function verifyOtp(Request $request, OtpService $otpService): JsonResponse
    {
        $request->validate([
            'channel' => ['required', 'string', 'in:sms,email'],
            'otp_code' => ['required', 'string', 'size:6'],
        ]);

        /** @var User $user */
        $user = $request->user();
        $channel = (string) $request->input('channel');
        $identifier = $channel === 'sms' ? ($user->phone_number ?? '') : $user->email;

        $isValid = $otpService->verify($identifier, (string) $request->input('otp_code'), 'household_registration');

        return response()->json([
            'valid' => $isValid,
            'message' => $isValid ? 'OTP verified successfully.' : 'Invalid or expired OTP code.',
        ]);
    }

    public function store(
        RegisterHouseholdRequest $request,
        OtpService $otpService,
        HouseholdCodeGenerator $codeGenerator
    ): RedirectResponse {
        /** @var User $user */
        $user = $request->user();
        $validated = $request->validated();

        $identifier = $validated['verification_channel'] === 'sms'
            ? ($user->phone_number ?? '')
            : $user->email;

        // Verify OTP code
        if (! $otpService->verify($identifier, $validated['otp_code'], 'household_registration')) {
            throw ValidationException::withMessages([
                'otp_code' => ['The provided OTP code is invalid or has expired.'],
            ]);
        }

        $household = DB::transaction(function () use ($user, $validated, $codeGenerator): Household {
            $code = $codeGenerator->generate();

            $household = Household::create([
                'household_code' => $code,
                'family_head_id' => $user->id,
                'address' => $validated['address'],
                'purok_sitio' => $validated['purok_sitio'],
                'status' => 'unverified',
                'notes' => $validated['notes'] ?? null,
                'submitted_at' => now(),
            ]);

            /** @var ResidentProfile|null $profile */
            $profile = $user->residentProfile;

            HouseholdMember::create([
                'household_id' => $household->id,
                'user_id' => $user->id,
                'first_name' => $profile !== null ? $profile->first_name : $user->name,
                'middle_name' => $profile !== null ? $profile->middle_name : null,
                'last_name' => $profile !== null ? $profile->last_name : '',
                'suffix' => $profile !== null ? $profile->suffix : null,
                'relationship_to_head' => 'head',
                'is_family_head' => true,
                'birthdate' => $profile !== null ? $profile->birthdate : null,
                'gender' => $profile !== null ? $profile->gender : null,
                'civil_status' => $profile !== null ? $profile->civil_status : null,
                'occupation' => $profile !== null ? $profile->occupation : null,
                'residency_status' => $profile !== null ? $profile->residency_status : 'resident',
            ]);

            $household->verification()->create([
                'status' => 'pending',
            ]);

            return $household;
        });

        return redirect()->route('household.index')
            ->with('success', "Household registration submitted successfully! Your household reference code is {$household->household_code}.");
    }
}
