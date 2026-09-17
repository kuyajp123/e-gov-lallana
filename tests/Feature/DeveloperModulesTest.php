<?php

use App\Filament\Pages\DeveloperModules;
use App\Models\Role;
use App\Models\User;
use App\Services\Sms\Providers\FakeSmsService;
use Illuminate\Foundation\Http\Middleware\PreventRequestForgery;
use Illuminate\Support\Facades\Cache;
use Livewire\Livewire;

beforeEach(function () {
    Cache::flush();

    $this->adminRole = Role::firstOrCreate(['slug' => 'admin'], ['name' => 'Barangay Administrator']);
    $this->admin = User::factory()->create(['role_id' => $this->adminRole->id]);
});

test('admin can access developer modules page in local environment', function () {
    $this->app['env'] = 'local';

    $response = $this->actingAs($this->admin)->get('/admin/developer-modules');

    $response->assertOk();
    $response->assertSee('SMS Simulator');
    $response->assertSee('Carrier Response Simulation Mode');
});

test('admin can access developer modules page in staging environment', function () {
    $this->app['env'] = 'staging';

    $response = $this->actingAs($this->admin)->get('/admin/developer-modules');

    $response->assertOk();
    $response->assertSee('SMS Simulator');
});

test('admin receives 404 not found when accessing developer modules in production', function () {
    $this->app['env'] = 'production';

    $response = $this->actingAs($this->admin)->get('/admin/developer-modules');

    $response->assertNotFound();
});

test('dev sms inbox is accessible in local and staging environments', function () {
    $this->app['env'] = 'local';
    $this->get('/dev/sms')->assertOk();

    $this->app['env'] = 'staging';
    $this->get('/dev/sms')->assertOk();
});

test('dev sms inbox returns 404 not found in production environment', function () {
    $this->withoutMiddleware(PreventRequestForgery::class);
    $this->app['env'] = 'production';

    $this->get('/dev/sms')->assertNotFound();
    $this->post('/dev/sms/mode', ['mode' => 'FAILURE'])->assertNotFound();
    $this->post('/dev/sms/send', ['recipient' => '09171234567', 'message' => 'test'])->assertNotFound();
    $this->delete('/dev/sms/clear')->assertNotFound();
});

test('admin can switch sms simulation mode and clear messages via livewire component', function () {
    app()->detectEnvironment(fn () => 'local');
    $fakeService = app(FakeSmsService::class);

    $this->actingAs($this->admin);

    Livewire::test(DeveloperModules::class)
        ->call('setSmsMode', 'FAILURE')
        ->assertSuccessful();

    expect($fakeService->getMode())->toBe('FAILURE');

    $fakeService->send('09171234567', 'Test SMS');
    expect($fakeService->getMessages())->toHaveCount(1);

    Livewire::test(DeveloperModules::class)
        ->call('clearSmsMessages')
        ->assertSuccessful();

    expect($fakeService->getMessages())->toBeEmpty();
});

test('admin can dispatch test sms and apply presets directly from the admin page', function () {
    app()->detectEnvironment(fn () => 'local');
    $fakeService = app(FakeSmsService::class);

    $this->actingAs($this->admin);

    Livewire::test(DeveloperModules::class)
        ->call('setPresetMessage', 'otp')
        ->set('recipient', '09189999999')
        ->call('sendTestSms')
        ->assertSuccessful();

    $messages = $fakeService->getMessages();
    expect($messages)->toHaveCount(1)
        ->and($messages[0]['recipient'])->toBe('09189999999')
        ->and($messages[0]['message'])->toContain('Your Barangay Lallana OTP is');
});
