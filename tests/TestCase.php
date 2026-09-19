<?php

namespace Tests;

use AllowDynamicProperties;
use App\Models\Household;
use App\Models\HouseholdMember;
use App\Models\ResidentProfile;
use App\Models\Role;
use App\Models\User;
use Illuminate\Foundation\Testing\TestCase as BaseTestCase;
use Laravel\Fortify\Features;

/**
 * @property Role|null $adminRole
 * @property Role|null $subAdminRole
 * @property Role|null $residentRole
 * @property User|null $admin
 * @property User|null $subAdmin
 * @property User|null $resident
 * @property User|null $residentUser
 * @property ResidentProfile|null $profile
 * @property Household|null $household
 * @property HouseholdMember|null $member
 */
#[AllowDynamicProperties]
abstract class TestCase extends BaseTestCase
{
    public ?Role $adminRole = null;

    public ?Role $subAdminRole = null;

    public ?Role $residentRole = null;

    public ?User $admin = null;

    public ?User $subAdmin = null;

    public ?User $resident = null;

    public ?User $residentUser = null;

    public ?ResidentProfile $profile = null;

    public ?Household $household = null;

    public ?HouseholdMember $member = null;

    protected function skipUnlessFortifyHas(string $feature, ?string $message = null): void
    {
        if (! Features::enabled($feature)) {
            $this->markTestSkipped($message ?? "Fortify feature [{$feature}] is not enabled.");
        }
    }
}
