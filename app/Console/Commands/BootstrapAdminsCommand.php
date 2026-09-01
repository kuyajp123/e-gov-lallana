<?php

namespace App\Console\Commands;

use App\Services\Auth\SuperAdminSyncService;
use Illuminate\Console\Command;

class BootstrapAdminsCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:bootstrap-admins';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Authoritatively synchronize Super Administrators from environment configuration';

    /**
     * Execute the console command.
     */
    public function handle(SuperAdminSyncService $syncService): int
    {
        $count = $syncService->sync();

        $this->info("Authoritatively synchronized {$count} Super Administrator(s) from environment configuration.");

        return self::SUCCESS;
    }
}
