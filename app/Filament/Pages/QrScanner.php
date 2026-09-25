<?php

namespace App\Filament\Pages;

use BackedEnum;
use Filament\Pages\Page;
use Filament\Pages\PageConfiguration;
use Filament\Panel;
use Filament\Support\Icons\Heroicon;
use Illuminate\Database\Eloquent\Model;
use UnitEnum;

class QrScanner extends Page
{
    protected static ?string $slug = 'qr-scanner';

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedQrCode;

    protected static string|UnitEnum|null $navigationGroup = 'Documents & Civil Registry';

    protected static ?string $navigationLabel = 'QR Document Scanner';

    protected static ?string $title = 'QR Document Scanner & Authenticator';

    protected static ?int $navigationSort = 5;

    protected string $view = 'filament.pages.qr-scanner';

    public static function getRouteName(?Panel $panel = null): string
    {
        return 'admin.qr-scanner';
    }

    public static function getNavigationUrl(): string
    {
        return route('admin.qr-scanner');
    }

    /**
     * @param  array<mixed>  $parameters
     */
    public static function getUrl(array $parameters = [], bool $isAbsolute = true, ?string $panel = null, ?Model $tenant = null, bool $shouldGuessMissingParameters = false, ?string $configuration = null): string
    {
        return route('admin.qr-scanner', $parameters, $isAbsolute);
    }

    public static function routes(Panel $panel, ?PageConfiguration $configuration = null): void
    {
        // Inertia route is registered in routes/web.php as admin.qr-scanner
    }
}
