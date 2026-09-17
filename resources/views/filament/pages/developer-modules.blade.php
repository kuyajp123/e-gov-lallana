<x-filament-panels::page>
    <div class="space-y-6">
        {{-- Environment Banner --}}
        <div class="rounded-xl border border-violet-200 bg-violet-50/60 p-4 dark:border-violet-900/50 dark:bg-violet-950/20">
            <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div class="flex items-center gap-3">
                    <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-violet-600 text-white shadow-xs">
                        <x-filament::icon icon="heroicon-o-device-phone-mobile" class="h-6 w-6" />
                    </div>
                    <div>
                        <div class="flex items-center gap-2">
                            <h3 class="text-sm font-semibold text-gray-950 dark:text-white">Developer SMS Simulator & Diagnostics</h3>
                            <x-filament::badge color="info">
                                APP_ENV: {{ strtoupper(app()->environment()) }}
                            </x-filament::badge>
                            <x-filament::badge color="{{ config('sms.default') === 'fake' ? 'warning' : 'success' }}">
                                Provider: {{ config('sms.default') }}
                            </x-filament::badge>
                        </div>
                        <p class="mt-0.5 text-xs text-gray-600 dark:text-gray-400">
                            Simulates and visualizes all outbound SMS, OTP codes, and document status alerts right here in the admin panel with zero telco charges. Strictly hidden in production.
                        </p>
                    </div>
                </div>

                <div class="flex items-center gap-2">
                    <x-filament::badge color="success" icon="heroicon-o-shield-check">
                        Production 404 Guard Active
                    </x-filament::badge>
                </div>
            </div>
        </div>

        @php
            $fakeSms = $this->getFakeSmsService();
            $currentMode = $fakeSms->getMode();
            $messages = array_reverse($fakeSms->getMessages());
            $messageCount = count($messages);
        @endphp

        {{-- Controls & Dispatcher Grid --}}
        <div class="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {{-- Column 1 & 2: Interactive Simulator Controls & Test Sender --}}
            <div class="space-y-6 lg:col-span-2">
                <x-filament::section>
                    <x-slot name="heading">
                        <div class="flex items-center gap-2.5">
                            <x-filament::icon icon="heroicon-o-adjustments-horizontal" class="h-5 w-5 text-violet-600 dark:text-violet-400" />
                            <span>Carrier Response Simulation Mode</span>
                        </div>
                    </x-slot>

                    <x-slot name="description">
                        Force the simulator to mimic different cellular carrier outcomes to test application resilience and error handling.
                    </x-slot>

                    <div class="space-y-4">
                        <div class="grid grid-cols-2 gap-2 sm:grid-cols-4">
                            @foreach (['SUCCESS' => 'success', 'FAILURE' => 'danger', 'TIMEOUT' => 'warning', 'RATE_LIMITED' => 'gray'] as $mode => $color)
                                <button
                                    type="button"
                                    wire:click="setSmsMode('{{ $mode }}')"
                                    class="flex flex-col items-center justify-center rounded-lg border p-3 text-xs font-semibold transition-all {{ $currentMode === $mode ? 'border-violet-600 bg-violet-600 text-white shadow-xs' : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700' }}"
                                >
                                    <span class="text-sm font-bold">{{ $mode }}</span>
                                    <span class="text-[10px] opacity-80 mt-0.5">
                                        @if ($mode === 'SUCCESS') Normal 200 OK
                                        @elseif ($mode === 'FAILURE') Provider Error
                                        @elseif ($mode === 'TIMEOUT') Gateway Timeout
                                        @else 429 Too Many Req @endif
                                    </span>
                                </button>
                            @endforeach
                        </div>
                    </div>
                </x-filament::section>

                <x-filament::section>
                    <x-slot name="heading">
                        <div class="flex items-center gap-2.5">
                            <x-filament::icon icon="heroicon-o-paper-airplane" class="h-5 w-5 text-violet-600 dark:text-violet-400" />
                            <span>Dispatch Test SMS Message</span>
                        </div>
                    </x-slot>

                    <x-slot name="description">
                        Send a test SMS through the configured SMS service pipeline to observe simulated reception and audit logs.
                    </x-slot>

                    <div class="space-y-4">
                        {{-- Presets --}}
                        <div class="flex flex-wrap items-center gap-2">
                            <span class="text-xs font-medium text-gray-500">Quick Presets:</span>
                            <button
                                type="button"
                                wire:click="setPresetMessage('otp')"
                                class="rounded-md border border-gray-200 bg-gray-50 px-2 py-1 text-xs font-medium text-gray-700 hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                            >
                                🔢 OTP Verification
                            </button>
                            <button
                                type="button"
                                wire:click="setPresetMessage('ready')"
                                class="rounded-md border border-gray-200 bg-gray-50 px-2 py-1 text-xs font-medium text-gray-700 hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                            >
                                📄 Document Ready
                            </button>
                            <button
                                type="button"
                                wire:click="setPresetMessage('verified')"
                                class="rounded-md border border-gray-200 bg-gray-50 px-2 py-1 text-xs font-medium text-gray-700 hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                            >
                                🏠 Household Verified
                            </button>
                        </div>

                        {{-- Recipient --}}
                        <div>
                            <label class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Recipient Mobile Number (PH Format)
                            </label>
                            <input
                                type="text"
                                wire:model="recipient"
                                class="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-xs focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                                placeholder="09171234567"
                            />
                        </div>

                        {{-- Message --}}
                        <div>
                            <label class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                                SMS Message Body
                            </label>
                            <textarea
                                wire:model="testMessage"
                                rows="3"
                                class="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-xs focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                                placeholder="Enter SMS message text..."
                            ></textarea>
                        </div>

                        <div class="flex items-center justify-between pt-2">
                            <x-filament::button
                                wire:click="sendTestSms"
                                wire:loading.attr="disabled"
                                icon="heroicon-o-paper-airplane"
                                color="primary"
                            >
                                <span wire:loading.remove wire:target="sendTestSms">Send Simulated Message</span>
                                <span wire:loading wire:target="sendTestSms">Sending...</span>
                            </x-filament::button>

                            <span class="text-xs text-gray-500">
                                Active mode: <strong class="font-mono text-violet-600 dark:text-violet-400">{{ $currentMode }}</strong>
                            </span>
                        </div>
                    </div>
                </x-filament::section>
            </div>

            {{-- Column 3: Diagnostics & Environment Overview --}}
            <div class="space-y-6">
                <x-filament::section>
                    <x-slot name="heading">
                        <div class="flex items-center gap-2.5">
                            <x-filament::icon icon="heroicon-o-cpu-chip" class="h-5 w-5 text-gray-600 dark:text-gray-400" />
                            <span>System Diagnostics</span>
                        </div>
                    </x-slot>

                    <div class="space-y-3 divide-y divide-gray-100 dark:divide-gray-800 text-sm">
                        <div class="flex items-center justify-between py-2">
                            <span class="text-gray-600 dark:text-gray-400">Environment (`APP_ENV`)</span>
                            <x-filament::badge color="info">{{ app()->environment() }}</x-filament::badge>
                        </div>

                        <div class="flex items-center justify-between py-2">
                            <span class="text-gray-600 dark:text-gray-400">Debug Mode (`APP_DEBUG`)</span>
                            <x-filament::badge color="{{ config('app.debug') ? 'warning' : 'success' }}">
                                {{ config('app.debug') ? 'Enabled' : 'Disabled' }}
                            </x-filament::badge>
                        </div>

                        <div class="flex items-center justify-between py-2">
                            <span class="text-gray-600 dark:text-gray-400">Default SMS Provider</span>
                            <span class="font-mono font-semibold text-violet-600 dark:text-violet-400">{{ config('sms.default') }}</span>
                        </div>

                        <div class="flex items-center justify-between py-2">
                            <span class="text-gray-600 dark:text-gray-400">Cached Messages</span>
                            <span class="font-mono font-medium text-gray-900 dark:text-gray-100">{{ $messageCount }}</span>
                        </div>

                        <div class="flex items-center justify-between py-2">
                            <span class="text-gray-600 dark:text-gray-400">PHP Version</span>
                            <span class="font-mono font-medium text-gray-900 dark:text-gray-100">{{ PHP_VERSION }}</span>
                        </div>

                        <div class="flex items-center justify-between py-2">
                            <span class="text-gray-600 dark:text-gray-400">Laravel Framework</span>
                            <span class="font-mono font-medium text-gray-900 dark:text-gray-100">v{{ app()->version() }}</span>
                        </div>
                    </div>
                </x-filament::section>
            </div>
        </div>

        {{-- Live Intercepted SMS Messages Inbox (Full Width) --}}
        <x-filament::section>
            <x-slot name="heading">
                <div class="flex items-center justify-between gap-3 w-full">
                    <div class="flex items-center gap-2.5">
                        <x-filament::icon icon="heroicon-o-inbox-stack" class="h-5 w-5 text-violet-600 dark:text-violet-400" />
                        <span>Intercepted SMS Messages Feed</span>
                        <x-filament::badge color="gray">
                            {{ $messageCount }} {{ Str::plural('message', $messageCount) }}
                        </x-filament::badge>
                    </div>

                    @if ($messageCount > 0)
                        <x-filament::button
                            color="danger"
                            outlined
                            size="sm"
                            icon="heroicon-o-trash"
                            wire:click="clearSmsMessages"
                            wire:confirm="Are you sure you want to clear all intercepted SMS messages?"
                        >
                            Clear Inbox
                        </x-filament::button>
                    @endif
                </div>
            </x-slot>

            <x-slot name="description">
                Real-time log of all outbound SMS notifications, OTP codes, and document status messages captured during development.
            </x-slot>

            @if ($messageCount === 0)
                <div class="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 py-12 text-center dark:border-gray-800">
                    <div class="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-gray-400 dark:bg-gray-800">
                        <x-filament::icon icon="heroicon-o-chat-bubble-left-right" class="h-6 w-6" />
                    </div>
                    <h3 class="mt-3 text-sm font-semibold text-gray-900 dark:text-gray-100">No intercepted SMS messages yet</h3>
                    <p class="mt-1 text-xs text-gray-500 max-w-sm">
                        Trigger a household OTP, document status change, or use the test message dispatcher above to simulate an outbound SMS.
                    </p>
                </div>
            @else
                <div class="space-y-4 divide-y divide-gray-100 dark:divide-gray-800">
                    @foreach ($messages as $msg)
                        <div class="pt-4 first:pt-0">
                            <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                                <div class="flex items-center gap-2.5">
                                    <div class="flex h-8 w-8 items-center justify-center rounded-full bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-300">
                                        <x-filament::icon icon="heroicon-o-phone" class="h-4 w-4" />
                                    </div>
                                    <div>
                                        <span class="font-mono text-sm font-bold text-gray-950 dark:text-white">
                                            {{ $msg['recipient'] ?? 'Unknown' }}
                                        </span>
                                        <span class="ml-2 text-xs text-gray-500">
                                            {{ $msg['sent_at'] ?? 'Just now' }}
                                        </span>
                                    </div>
                                </div>

                                <div class="flex items-center gap-2">
                                    <span class="text-xs text-gray-500 font-mono">
                                        Mode: {{ $msg['mode'] ?? 'SUCCESS' }}
                                    </span>
                                    @php
                                        $status = $msg['status'] ?? 'SENT';
                                        $statusColor = match ($status) {
                                            'SENT' => 'success',
                                            'TIMEOUT' => 'warning',
                                            'RATE_LIMITED' => 'gray',
                                            default => 'danger',
                                        };
                                    @endphp
                                    <x-filament::badge :color="$statusColor">
                                        {{ $status }}
                                    </x-filament::badge>
                                </div>
                            </div>

                            {{-- Message Content Box --}}
                            <div class="mt-2.5 rounded-lg border border-gray-200 bg-gray-50/80 p-3 text-sm text-gray-800 font-sans dark:border-gray-800 dark:bg-gray-900/80 dark:text-gray-200">
                                <p class="whitespace-pre-wrap leading-relaxed">{{ $msg['message'] ?? '' }}</p>

                                @if (!empty($msg['error']))
                                    <div class="mt-2 rounded border border-rose-200 bg-rose-50 px-2.5 py-1.5 text-xs text-rose-700 dark:border-rose-900/50 dark:bg-rose-950/40 dark:text-rose-300">
                                        <strong>Simulation Error:</strong> {{ $msg['error'] }}
                                    </div>
                                @endif
                            </div>
                        </div>
                    @endforeach
                </div>
            @endif
        </x-filament::section>
    </div>
</x-filament-panels::page>
