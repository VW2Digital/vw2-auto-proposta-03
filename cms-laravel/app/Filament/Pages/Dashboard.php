<?php

namespace App\Filament\Pages;

use Filament\Pages\Dashboard as BaseDashboard;
use Illuminate\Support\Facades\Auth;

class Dashboard extends BaseDashboard
{
    protected static ?string $title = 'Painel';

    public function getHeading(): string
    {
        $hour = (int) now()->format('H');
        $greeting = $hour < 12 ? 'Bom dia' : ($hour < 18 ? 'Boa tarde' : 'Boa noite');
        $name = strtok((string) Auth::user()?->name, ' ') ?: '';

        return trim("{$greeting}, {$name}").'!';
    }

    public function getSubheading(): ?string
    {
        return 'Resumo do site e das propostas da Nexo Studio.';
    }

    public function getColumns(): int | array
    {
        return ['md' => 3];
    }
}
