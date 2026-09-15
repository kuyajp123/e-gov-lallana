<?php

namespace Database\Seeders;

use App\Models\Role;
use Illuminate\Database\Seeder;

class RoleSeeder extends Seeder
{
    public function run(): void
    {
        $roles = [
            [
                'name' => 'Super Administrator',
                'slug' => 'super_admin',
                'description' => 'Unrestricted authority including deletion of resident profiles and critical entities.',
            ],
            [
                'name' => 'Barangay Administrator',
                'slug' => 'admin',
                'description' => 'Full administrative access to all modules, records, and approvals.',
            ],
            [
                'name' => 'Barangay Sub-admin / Staff',
                'slug' => 'sub_admin',
                'description' => 'Staff level access for processing requests, managing announcements, and verification reviews.',
            ],
            [
                'name' => 'Resident / Family Head',
                'slug' => 'resident',
                'description' => 'Resident access for submitting household profiles and requesting barangay documents.',
            ],
        ];

        foreach ($roles as $role) {
            Role::firstOrCreate(['slug' => $role['slug']], $role);
        }
    }
}
