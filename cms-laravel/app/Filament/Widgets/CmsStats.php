<?php

namespace App\Filament\Widgets;

use App\Filament\Resources\Projects\ProjectResource;
use App\Filament\Resources\Proposals\ProposalResource;
use App\Models\CaseStudy;
use App\Models\Project;
use App\Models\Proposal;
use App\Models\Service;
use Filament\Widgets\StatsOverviewWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;
use Illuminate\Support\Carbon;

class CmsStats extends StatsOverviewWidget
{
    protected static ?int $sort = 1;

    protected ?string $pollingInterval = '30s';

    protected function getStats(): array
    {
        $new = Proposal::query()->where('status', 'nova')->count();
        $negotiating = Proposal::query()->where('status', 'negociacao')->count();
        $sent = Proposal::query()->whereIn('status', Proposal::VIEWABLE)->count();
        $won = Proposal::query()->whereIn('status', ['aceita', 'fechada'])->count();
        $rate = $sent ? round($won / $sent * 100) : 0;

        $last14 = collect(range(13, 0))->map(fn ($d) => Carbon::today()->subDays($d));
        $daily = Proposal::query()->where('created_at', '>=', Carbon::today()->subDays(13))
            ->get(['created_at'])->groupBy(fn ($p) => $p->created_at->toDateString());
        $spark = $last14->map(fn ($day) => $daily->get($day->toDateString())?->count() ?? 0)->all();
        $week = array_sum(array_slice($spark, -7));

        return [
            Stat::make('Propostas novas', $new)
                ->description($week ? "{$week} recebidas nos últimos 7 dias" : 'Nenhuma nos últimos 7 dias')
                ->descriptionIcon('heroicon-m-inbox-arrow-down')
                ->chart($spark)
                ->color('info')
                ->url(ProposalResource::getUrl('index', ['tab' => 'nova'])),
            Stat::make('Em negociação', $negotiating)
                ->description($negotiating ? 'Clientes esperando resposta' : 'Nada pendente')
                ->descriptionIcon('heroicon-m-chat-bubble-left-right')
                ->color($negotiating ? 'danger' : 'gray')
                ->url(ProposalResource::getUrl('index', ['tab' => 'negociacao'])),
            Stat::make('Taxa de aceite', "{$rate}%")
                ->description("{$won} de {$sent} propostas enviadas")
                ->descriptionIcon('heroicon-m-check-badge')
                ->color('success'),
            Stat::make('Conteúdo no ar', Project::query()->count() + CaseStudy::query()->where('published', true)->count())
                ->description(Project::query()->count().' projetos · '.CaseStudy::query()->where('published', true)->count().' cases · '.Service::query()->where('active', true)->count().' serviços')
                ->descriptionIcon('heroicon-m-globe-alt')
                ->color('primary')
                ->url(ProjectResource::getUrl()),
        ];
    }
}
