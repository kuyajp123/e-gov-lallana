<?php

namespace App\Filament\Pages;

use App\Services\Sms\Providers\FakeSmsService;
use BackedEnum;
use Filament\Notifications\Notification;
use Filament\Pages\Page;
use Filament\Pages\PageConfiguration;
use Filament\Panel;
use Filament\Support\Icons\Heroicon;
use UnitEnum;

class DeveloperModules extends Page
{
    protected static ?string $slug = 'developer-modules';

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedDevicePhoneMobile;

    protected static string|UnitEnum|null $navigationGroup = 'Developer Modules';

    protected static ?string $navigationLabel = 'SMS Dev Simulator';

    protected static ?string $title = 'SMS Dev Simulator & Developer Modules';

    protected static ?int $navigationSort = 1;

    protected string $view = 'filament.pages.developer-modules';

    public string $recipient = '09171234567';

    public string $testMessage = 'Your Barangay Lallana OTP is 483921.';

    public static function canAccess(): bool
    {
        return app()->environment(['local', 'staging', 'testing']);
    }

    public static function routes(Panel $panel, ?PageConfiguration $configuration = null): void
    {
        if (! static::canAccess()) {
            return;
        }

        parent::routes($panel, $configuration);
    }

    public function mountCanAuthorizeAccess(): void
    {
        abort_unless(static::canAccess(), 404);
    }

    public function hydrateCanAuthorizeAccess(): void
    {
        abort_unless(static::canAccess(), 404);
    }

    public function getFakeSmsService(): FakeSmsService
    {
        return app(FakeSmsService::class);
    }

    public function setSmsMode(string $mode): void
    {
        $this->getFakeSmsService()->setMode($mode);

        Notification::make()
            ->title("SMS Simulation mode set to {$mode}")
            ->success()
            ->send();
    }

    public function setPresetMessage(string $preset): void
    {
        match ($preset) {
            'otp' => $this->testMessage = 'Your Barangay Lallana OTP is '.random_int(100000, 999999).'.',
            'ready' => $this->testMessage = 'Good day! Your requested Barangay Clearance (DOC-2026-001) is now ready for pickup at Barangay Hall.',
            'verified' => $this->testMessage = 'Congratulations! Your household registration for Barangay Lallana has been verified and approved.',
            default => null,
        };
    }

    public function sendTestSms(): void
    {
        $this->validate([
            'recipient' => ['required', 'string', 'min:7'],
            'testMessage' => ['required', 'string', 'min:1'],
        ]);

        $fakeService = $this->getFakeSmsService();
        $result = $fakeService->send($this->recipient, $this->testMessage);

        if ($result->success) {
            Notification::make()
                ->title('Test SMS Dispatched Successfully')
                ->body("Message sent to {$this->recipient}")
                ->success()
                ->send();
        } else {
            Notification::make()
                ->title('Test SMS Simulated Failure')
                ->body("[{$result->errorCode}] {$result->errorMessage}")
                ->danger()
                ->send();
        }
    }

    public function clearSmsMessages(): void
    {
        $this->getFakeSmsService()->clearMessages();

        Notification::make()
            ->title('SMS Simulator inbox cleared')
            ->success()
            ->send();
    }
}
