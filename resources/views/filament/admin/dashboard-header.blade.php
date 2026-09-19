@php
    $user = auth()->user();
    $roleName = $user->role?->name ?? ($user->is_admin ? 'Super Administrator' : 'Barangay Staff');

    $pendingDocs = \App\Models\DocumentRequest::whereIn('current_status', [
        \App\Enums\DocumentRequestStatus::Pending,
        \App\Enums\DocumentRequestStatus::Processing,
    ])->count();

    $pendingHouseholds = \App\Models\Household::whereIn('status', ['unverified', 'pending', 'returned'])->count();
@endphp

<div class="mb-6 bezel-outer">
    <div class="bezel-inner flex flex-col justify-between gap-6 p-6 sm:flex-row sm:items-center">
        <div class="flex items-center gap-4">
            <div class="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-violet-600/10 text-violet-700 ring-1 ring-violet-600/20 dark:bg-violet-400/10 dark:text-violet-300">
                <svg xmlns="http://www.w3.org/2000/svg" class="size-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/>
                    <path d="m9 12 2 2 4-4"/>
                </svg>
            </div>
            <div class="space-y-1">
                <div class="flex flex-wrap items-center gap-2">
                    <h1 class="text-xl font-bold tracking-tight text-gray-950 sm:text-2xl dark:text-white">
                        Mabuhay, {{ $user->name }}!
                    </h1>
                    <span class="inline-flex items-center rounded-md border border-violet-200/60 bg-violet-50 px-2.5 py-0.5 text-[11px] font-bold text-violet-800 dark:border-violet-800/60 dark:bg-violet-950/60 dark:text-violet-300">
                        {{ $roleName }}
                    </span>
                    @if ($pendingDocs > 0)
                        <span class="inline-flex items-center rounded-md border border-amber-200/60 bg-amber-50 px-2.5 py-0.5 text-[11px] font-bold text-amber-800 dark:border-amber-800/60 dark:bg-amber-950/60 dark:text-amber-300">
                            {{ $pendingDocs }} Active Requests
                        </span>
                    @endif
                    @if ($pendingHouseholds > 0)
                        <span class="inline-flex items-center rounded-md border border-blue-200/60 bg-blue-50 px-2.5 py-0.5 text-[11px] font-bold text-blue-800 dark:border-blue-800/60 dark:bg-blue-950/60 dark:text-blue-300">
                            {{ $pendingHouseholds }} Pending Households
                        </span>
                    @endif
                </div>
                <p class="text-xs text-gray-500 sm:text-sm dark:text-gray-400">
                    Barangay Lallana E-Government Portal • Official Administrative Console • Trece Martires City, Cavite
                </p>
            </div>
        </div>

        <div class="flex flex-wrap items-center gap-2.5">
            <a
                href="/dashboard"
                class="inline-flex items-center justify-center gap-1.5 rounded-xl border border-violet-300 bg-white px-3.5 py-2 text-xs font-semibold text-violet-700 shadow-xs transition hover:bg-violet-50 dark:border-violet-700 dark:bg-zinc-900 dark:text-violet-300 dark:hover:bg-violet-950/50"
            >
                <svg xmlns="http://www.w3.org/2000/svg" class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                    <polyline points="9 22 9 12 15 12 15 22"/>
                </svg>
                Resident Dashboard
            </a>
            <a
                href="/admin/document-requests"
                class="inline-flex items-center justify-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3.5 py-2 text-xs font-semibold text-gray-700 shadow-xs transition hover:bg-gray-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-gray-300 dark:hover:bg-zinc-800"
            >
                <svg xmlns="http://www.w3.org/2000/svg" class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
                    <polyline points="14 2 14 8 20 8"/>
                </svg>
                Document Queue
            </a>
        </div>
    </div>
</div>
