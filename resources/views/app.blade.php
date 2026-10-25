<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        {{-- Force light theme styling --}}
        <style>
            html {
                background-color: oklch(1 0 0);
                color-scheme: light;
            }
        </style>

        <link rel="icon" href="/lallana-icon.png" type="image/png">
        <link rel="apple-touch-icon" href="/lallana-icon.png">

        @fonts

        @viteReactRefresh
        @vite(['resources/css/app.css', 'resources/js/app.tsx'])
        <x-inertia::head>
            <title>{{ config('app.name', 'Laravel') }}</title>
        </x-inertia::head>
    </head>
    <body class="font-sans antialiased">
        <x-inertia::app />
    </body>
</html>
