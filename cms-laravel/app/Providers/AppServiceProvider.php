<?php

namespace App\Providers;

use Filament\Support\Assets\Js;
use Filament\Support\Facades\FilamentAsset;
use Filament\Support\Facades\FilamentTimezone;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        //
    }

    public function boot(): void
    {
        // Compatibilidade de índices UTF8MB4 em servidores MySQL/MariaDB (Hostinger).
        Schema::defaultStringLength(191);

        // Força HTTPS em produção quando APP_URL usa https:// (essencial para uploads do Filament/Livewire).
        if (config('app.env') === 'production' && str_starts_with((string) config('app.url'), 'https://')) {
            URL::forceScheme('https');
        }

        // Banco em UTC; o admin mostra no horário configurado (compatível com config:cache).
        FilamentTimezone::set((string) config('cms.display_timezone', 'America/Sao_Paulo'));

        FilamentAsset::register([
            Js::make('markdown-studio', resource_path('js/filament/markdown-studio.js')),
        ]);
    }
}
