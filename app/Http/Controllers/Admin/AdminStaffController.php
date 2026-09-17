<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\DesignateStaffRequest;
use App\Http\Requests\Admin\StoreStaffRequest;
use App\Http\Requests\Admin\UpdateStaffRequest;
use App\Models\Role;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Inertia\Response;

class AdminStaffController extends Controller implements HasMiddleware
{
    /**
     * Get the middleware that should be assigned to the controller.
     */
    public static function middleware(): array
    {
        return [
            function (Request $request, \Closure $next) {
                /** @var User|null $user */
                $user = $request->user();

                if (! $user || ! $user->isAdmin()) {
                    abort(403, 'Unauthorized access to staff management.');
                }

                return $next($request);
            },
        ];
    }

    /**
     * Display a listing of administrative staff members.
     */
    public function index(Request $request): Response
    {
        $search = $request->string('search')->trim()->toString();
        $roleFilter = $request->string('role')->trim()->toString();
        $statusFilter = $request->string('status')->trim()->toString();

        $staffRoleIds = Role::whereIn('slug', ['admin', 'sub_admin'])->pluck('id');

        $query = User::query()
            ->with(['role', 'residentProfile.avatar'])
            ->whereIn('role_id', $staffRoleIds)
            ->orderBy('name');

        if ($search !== '') {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhere('phone_number', 'like', "%{$search}%");
            });
        }

        if ($roleFilter !== '' && $roleFilter !== 'all') {
            $query->whereHas('role', function ($q) use ($roleFilter) {
                $q->where('slug', $roleFilter);
            });
        }

        if ($statusFilter !== '' && $statusFilter !== 'all') {
            $query->where('status', $statusFilter);
        }

        $paginated = $query->paginate(15)->withQueryString();

        /** @var User $currentUser */
        $currentUser = Auth::user();

        $staff = $paginated->through(function (User $user) use ($currentUser) {
            $isSelf = $user->id === $currentUser->id;
            $isTargetSuperAdmin = $user->isSuperAdmin();
            $isTargetAdmin = $user->isAdmin();

            // Permissions logic
            $canEdit = $isSelf || ($currentUser->isSuperAdmin() || (! $isTargetAdmin && ! $isTargetSuperAdmin));
            $canToggle = ! $isSelf && ! $isTargetSuperAdmin && ($currentUser->isSuperAdmin() || ! $isTargetAdmin);
            $canRevoke = $user->isSubAdmin();

            return [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'phone_number' => $user->phone_number,
                'avatar_url' => $user->residentProfile?->avatar?->getUrl(),
                'role' => [
                    'id' => $user->role?->id,
                    'name' => $user->role->name ?? 'Staff',
                    'slug' => $user->role->slug ?? 'sub_admin',
                ],
                'status' => $user->status,
                'is_active' => $user->status === 'active',
                'is_admin' => $user->isAdmin(),
                'is_sub_admin' => $user->isSubAdmin(),
                'is_super_admin' => $isTargetSuperAdmin,
                'is_self' => $isSelf,
                'can_edit' => $canEdit,
                'can_toggle' => $canToggle,
                'can_revoke' => $canRevoke,
                'created_at_formatted' => $user->created_at?->format('M d, Y') ?? '—',
            ];
        });

        $adminRole = Role::where('slug', 'admin')->first();
        $subAdminRole = Role::where('slug', 'sub_admin')->first();

        $stats = [
            'total' => User::whereIn('role_id', $staffRoleIds)->count(),
            'active' => User::whereIn('role_id', $staffRoleIds)->where('status', 'active')->count(),
            'admins' => $adminRole ? User::where('role_id', $adminRole->id)->count() : 0,
            'sub_admins' => $subAdminRole ? User::where('role_id', $subAdminRole->id)->count() : 0,
        ];

        // Eligible residents that can be designated as sub-admin
        $residentRole = Role::where('slug', 'resident')->first();
        $residentCandidates = $residentRole
            ? User::where('role_id', $residentRole->id)
                ->where('status', 'active')
                ->select(['id', 'name', 'email'])
                ->orderBy('name')
                ->limit(100)
                ->get()
            : collect();

        return Inertia::render('admin/staff/index', [
            'staff' => $staff,
            'stats' => $stats,
            'residentCandidates' => $residentCandidates,
            'currentUserId' => $currentUser->id,
            'isSuperAdmin' => $currentUser->isSuperAdmin(),
            'filters' => [
                'search' => $search,
                'role' => $roleFilter ?: 'all',
                'status' => $statusFilter ?: 'all',
            ],
        ]);
    }

    /**
     * Store a newly created staff account.
     */
    public function store(StoreStaffRequest $request): RedirectResponse
    {
        $validated = $request->validated();

        $role = Role::where('slug', $validated['role_slug'])->firstOrFail();

        $user = User::create([
            'name' => $validated['name'],
            'email' => strtolower(trim((string) $validated['email'])),
            'phone_number' => $validated['phone_number'] ?? null,
            'role_id' => $role->id,
            'password' => Hash::make((string) $validated['password']),
            'status' => $validated['status'] ?? 'active',
            'email_verified_at' => now(),
        ]);

        return back()->with('success', "Staff account for {$user->name} has been provisioned as {$role->name}.");
    }

    /**
     * Designate an existing registered resident as sub-admin staff.
     */
    public function designate(DesignateStaffRequest $request): RedirectResponse
    {
        $user = User::query()->findOrFail((int) $request->validated('user_id'));

        $subAdminRole = Role::firstOrCreate(
            ['slug' => 'sub_admin'],
            ['name' => 'Barangay Sub-admin / Staff']
        );

        $user->update([
            'role_id' => $subAdminRole->id,
        ]);

        return back()->with('success', "{$user->name} has been designated as Barangay Sub-admin / Staff.");
    }

    /**
     * Update an existing staff account.
     */
    public function update(UpdateStaffRequest $request, User $user): RedirectResponse
    {
        $validated = $request->validated();
        /** @var User $currentUser */
        $currentUser = Auth::user();

        $updateData = [
            'name' => $validated['name'],
            'email' => strtolower(trim((string) $validated['email'])),
            'phone_number' => $validated['phone_number'] ?? null,
        ];

        // Only update role and status if not editing own profile
        if ($user->id !== $currentUser->id) {
            if (! empty($validated['role_slug'])) {
                $role = Role::where('slug', $validated['role_slug'])->first();
                if ($role) {
                    $updateData['role_id'] = $role->id;
                }
            }

            if (! empty($validated['status'])) {
                $updateData['status'] = $validated['status'];
            }
        }

        if (! empty($validated['password'])) {
            $updateData['password'] = Hash::make((string) $validated['password']);
        }

        $user->update($updateData);

        return back()->with('success', "Staff member {$user->name}'s account details have been updated.");
    }

    /**
     * Toggle active/inactive status for a staff account.
     */
    public function toggleStatus(Request $request, User $user): RedirectResponse
    {
        /** @var User $currentUser */
        $currentUser = Auth::user();

        if ($user->id === $currentUser->id) {
            return back()->withErrors(['status' => 'You cannot deactivate your own administrative account.']);
        }

        if ($user->isSuperAdmin()) {
            return back()->withErrors(['status' => 'The Super Administrator account cannot be deactivated.']);
        }

        if ($user->isAdmin() && ! $currentUser->isSuperAdmin()) {
            return back()->withErrors(['status' => 'You do not have permission to deactivate another Barangay Administrator.']);
        }

        $newStatus = $user->status === 'active' ? 'inactive' : 'active';
        $user->update(['status' => $newStatus]);

        $label = $newStatus === 'active' ? 'activated' : 'deactivated';

        return back()->with('success', "Account for {$user->name} has been {$label}.");
    }

    /**
     * Revoke sub-admin staff privileges, reverting user to resident.
     */
    public function revoke(Request $request, User $user): RedirectResponse
    {
        if (! $user->isSubAdmin()) {
            return back()->withErrors(['revoke' => 'Only sub-admin / staff privileges can be revoked.']);
        }

        $residentRole = Role::firstOrCreate(
            ['slug' => 'resident'],
            ['name' => 'Resident']
        );

        $user->update([
            'role_id' => $residentRole->id,
        ]);

        return back()->with('success', "Staff privileges for {$user->name} have been revoked. Account reverted to resident.");
    }
}
