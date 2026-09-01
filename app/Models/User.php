<?php

namespace App\Models;

use Database\Factories\UserFactory;
use Filament\Models\Contracts\FilamentUser;
use Filament\Panel;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property int|null $role_id
 * @property string $name
 * @property string $email
 * @property string|null $phone_number
 * @property Carbon|null $email_verified_at
 * @property Carbon|null $phone_verified_at
 * @property string $password
 * @property string $status
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property-read Role|null $role
 * @property-read ResidentProfile|null $residentProfile
 */
class User extends Authenticatable implements FilamentUser
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable;

    protected $fillable = [
        'role_id',
        'name',
        'email',
        'email_verified_at',
        'phone_number',
        'phone_verified_at',
        'password',
        'status',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'phone_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    /**
     * Determine whether the user can access the given Filament panel.
     */
    public function canAccessPanel(Panel $panel): bool
    {
        return $this->isAdmin() || $this->isSubAdmin();
    }

    /**
     * @return BelongsTo<Role, $this>
     */
    public function role(): BelongsTo
    {
        return $this->belongsTo(Role::class);
    }

    /**
     * @return HasOne<ResidentProfile, $this>
     */
    public function residentProfile(): HasOne
    {
        return $this->hasOne(ResidentProfile::class);
    }

    /**
     * @return HasMany<Household, $this>
     */
    public function households(): HasMany
    {
        return $this->hasMany(Household::class, 'family_head_id');
    }

    /**
     * @return HasMany<DocumentRequest, $this>
     */
    public function documentRequests(): HasMany
    {
        return $this->hasMany(DocumentRequest::class);
    }

    public function isAdmin(): bool
    {
        return $this->role?->slug === 'admin';
    }

    public function isSubAdmin(): bool
    {
        return $this->role?->slug === 'sub_admin';
    }

    public function isResident(): bool
    {
        return $this->role?->slug === 'resident' || $this->role === null;
    }

    /**
     * Get the user's primary household (either as family head or registered member).
     */
    public function household(): ?Household
    {
        return Household::where('family_head_id', $this->id)
            ->orWhereHas('members', fn ($query) => $query->where('user_id', $this->id))
            ->first();
    }

    /**
     * Check if the user belongs to a verified household.
     */
    public function belongsToVerifiedHousehold(): bool
    {
        if ($this->isAdmin() || $this->isSubAdmin()) {
            return true;
        }

        return Household::where('status', 'verified')
            ->where(function ($query) {
                $query->where('family_head_id', $this->id)
                    ->orWhereHas('members', fn ($q) => $q->where('user_id', $this->id));
            })
            ->exists();
    }
}
