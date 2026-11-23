<?php

namespace App\Providers;

use Filament\Support\Assets\Js;
use Filament\Support\Facades\FilamentAsset;
use Filament\Support\Facades\FilamentTimezone;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        //
    }

    public function boot(): void
    {
        // Banco em UTC; o admin mostra no horário de Brasília.
        FilamentTimezone::set(env('CMS_DISPLAY_TIMEZONE', 'America/Sao_Paulo'));

        FilamentAsset::register([
            Js::make('markdown-studio', resource_path('js/filament/markdown-studio.js')),
        ]);
    }
}
