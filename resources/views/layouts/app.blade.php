<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="csrf-token" content="{{ csrf_token() }}">

        <title>{{ config('app.name', 'Laravel') }}</title>

        <!-- Dark Mode Initialization Script (Prevents FOUC) -->
        <script>
            if (localStorage.getItem('color-theme') === 'dark' || (!('color-theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                document.documentElement.classList.add('dark');
            } else {
                document.documentElement.classList.remove('dark');
            }
        </script>

        <!-- Scripts -->
        @vite(['resources/css/app.css', 'resources/js/app.js'])
    </head>
    <body class="font-sans antialiased text-gray-900 dark:text-gray-100 transition-colors duration-200">
        <div class="min-h-screen bg-gray-50 dark:bg-dark-bg transition-colors duration-200">
            @include('layouts.navigation')

            <!-- Page Heading -->
            @isset($header)
                <header class="bg-white dark:bg-dark-surface border-b border-gray-200 dark:border-dark-border transition-colors duration-200">
                    <div class="max-w-[1280px] mx-auto px-6 py-6 flex items-center">
                        <div class="flex-1 flex justify-between items-center w-full">
                            {{ $header }}
                        </div>
                    </div>
                </header>
            @endisset

            <!-- Page Content -->
            <main class="max-w-[1280px] mx-auto">
                {{ $slot }}
            </main>
        </div>
    </body>
</html>
