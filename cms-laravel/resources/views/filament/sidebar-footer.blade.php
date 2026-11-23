@php
    $siteUrl = config('cms.frontend_url');
    $host = parse_url($siteUrl, PHP_URL_HOST).(parse_url($siteUrl, PHP_URL_PORT) ? ':'.parse_url($siteUrl, PHP_URL_PORT) : '');
@endphp

{{-- Aberta: cartão do site em uma linha. Recolhida: só o ícone. --}}
<div class="nx-sidebar-foot" x-bind:class="{ 'is-collapsed': ! $store.sidebar.isOpen }">
    <div x-show="$store.sidebar.isOpen" class="nx-sidebar-card">
        <span class="nx-sidebar-card__dot shrink-0"></span>
        <div class="min-w-0 flex-1 leading-tight">
            <p class="text-xs font-medium text-gray-700 dark:text-gray-200">Site no ar</p>
            <p class="truncate text-[11px] text-gray-500 dark:text-gray-400">{{ $host }}</p>
        </div>
        <a
            href="{{ $siteUrl }}"
            target="_blank"
            rel="noopener"
            title="Abrir o site"
            class="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-white text-gray-500 shadow-sm ring-1 ring-gray-950/10 transition hover:text-primary-700 hover:ring-primary-300 dark:bg-white/10 dark:text-gray-300 dark:ring-white/10 dark:hover:text-white"
        >
            <span class="sr-only">Abrir o site</span>
            <x-filament::icon icon="heroicon-m-arrow-top-right-on-square" class="h-4 w-4" />
        </a>
    </div>

    <a
        x-show="! $store.sidebar.isOpen"
        x-cloak
        href="{{ $siteUrl }}"
        target="_blank"
        rel="noopener"
        class="nx-sidebar-mini"
        x-tooltip="{ content: 'Abrir o site', placement: 'right', theme: $store.theme }"
    >
        <span class="sr-only">Abrir o site</span>
        <x-filament::icon icon="heroicon-o-globe-alt" class="h-5 w-5" />
    </a>
</div>
