<?php

namespace App\Filament\Widgets;

use App\Models\Proposal;
use Filament\Widgets\ChartWidget;
use Illuminate\Support\Carbon;

class ProposalsChart extends ChartWidget
{
    protected static ?int $sort = 2;

    protected ?string $heading = 'Propostas por mês';

    protected ?string $description = 'Recebidas pelo site × aceitas, últimos 6 meses';

    protected ?string $maxHeight = '260px';

    protected int | string | array $columnSpan = ['md' => 2, 'xl' => 2];

    protected function getData(): array
    {
        $months = collect(range(5, 0))->map(fn ($m) => Carbon::now()->startOfMonth()->subMonths($m));
        $all = Proposal::query()->where('created_at', '>=', $months->first())->get(['created_at', 'status']);

        $received = $months->map(fn ($m) => $all->filter(fn ($p) => $p->created_at->isSameMonth($m))->count());
        $accepted = $months->map(fn ($m) => $all->filter(fn ($p) => $p->created_at->isSameMonth($m) && in_array($p->status, ['aceita', 'fechada'], true))->count());

        return [
            'datasets' => [
                [
                    'label' => 'Recebidas',
                    'data' => $received->all(),
                    'borderColor' => '#8b5cf6',
                    'backgroundColor' => 'rgba(139, 92, 246, 0.12)',
                    'fill' => true,
                    'cubicInterpolationMode' => 'monotone',
                ],
                [
                    'label' => 'Aceitas',
                    'data' => $accepted->all(),
                    'borderColor' => '#22c55e',
                    'backgroundColor' => 'rgba(34, 197, 94, 0.08)',
                    'fill' => true,
                    'cubicInterpolationMode' => 'monotone',
                ],
            ],
            'labels' => $months->map(fn ($m) => ucfirst($m->translatedFormat('M/y')))->all(),
        ];
    }

    protected function getOptions(): array
    {
        return [
            'plugins' => ['legend' => ['position' => 'bottom']],
            'scales' => ['y' => ['beginAtZero' => true, 'ticks' => ['precision' => 0]]],
        ];
    }

    protected function getType(): string
    {
        return 'line';
    }
}
