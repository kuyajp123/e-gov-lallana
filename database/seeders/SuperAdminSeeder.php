<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Artisan;

class SuperAdminSeeder extends Seeder
{
    public function run(): void
    {
        Artisan::call('app:bootstrap-admins');
    }
}
