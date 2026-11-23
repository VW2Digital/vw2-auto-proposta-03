<?php

namespace App\Filament\Resources\Proposals\Pages;

use App\Filament\Pages\ProposalBoard;
use App\Filament\Resources\Proposals\ProposalResource;
use App\Models\Proposal;
use Filament\Actions\Action;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;
use Filament\Schemas\Components\Tabs\Tab;
use Illuminate\Database\Eloquent\Builder;

class ListProposals extends ListRecords
{
    protected static string $resource = ProposalResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Action::make('board')->label('Ver quadro')->icon('heroicon-m-view-columns')->color('gray')
                ->url(ProposalBoard::getUrl()),
            CreateAction::make()->icon('heroicon-m-plus'),
        ];
    }

    public function getTabs(): array
    {
        $counts = Proposal::query()->selectRaw('status, count(*) as total')->groupBy('status')->pluck('total', 'status');

        $tabs = ['todas' => Tab::make('Todas')->badge($counts->sum() ?: null)];

        foreach (Proposal::STATUSES as $status => $label) {
            $tabs[$status] = Tab::make($label)
                ->icon(Proposal::STATUS_ICONS[$status])
                ->badge($counts[$status] ?? null)
                ->badgeColor(Proposal::STATUS_COLORS[$status])
                ->modifyQueryUsing(fn (Builder $query) => $query->where('status', $status));
        }

        return $tabs;
    }
}
