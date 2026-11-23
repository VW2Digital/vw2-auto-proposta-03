<?php

namespace App\Providers;

use App\Auth\LegacyAwareUserProvider;
use Filament\Support\Assets\Js;
use Filament\Support\Facades\FilamentAsset;
use Filament\Support\Facades\FilamentTimezone;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        //
    }

    public function boot(): void
    {
        // Banco em UTC (como no Payload); o admin mostra no horário de Brasília.
        FilamentTimezone::set(env('CMS_DISPLAY_TIMEZONE', 'America/Sao_Paulo'));

        FilamentAsset::register([
            Js::make('markdown-studio', resource_path('js/filament/markdown-studio.js')),
        ]);

        // Aceita as senhas antigas do Payload e converte para bcrypt no 1º login.
        Auth::provider('legacy-eloquent', fn ($app, array $config) => new LegacyAwareUserProvider(
            $app['hash'],
            $config['model'],
        ));
    }
}
