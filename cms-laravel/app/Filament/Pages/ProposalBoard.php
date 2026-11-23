<?php

namespace App\Filament\Pages;

use App\Filament\Resources\Proposals\ProposalResource;
use App\Models\Proposal;
use Filament\Actions\Action;
use Filament\Notifications\Notification;
use Filament\Pages\Page;
use Filament\Support\Enums\Width;
use Illuminate\Support\Collection;
use Livewire\Attributes\Url;

class ProposalBoard extends Page
{
    protected static ?string $slug = 'propostas/quadro';

    protected static ?string $title = 'Quadro de propostas';

    protected static ?string $navigationLabel = 'Quadro';

    protected static string | \BackedEnum | null $navigationIcon = 'heroicon-o-view-columns';

    protected static string | \UnitEnum | null $navigationGroup = 'Comercial';

    protected static ?int $navigationSort = 2;

    protected string $view = 'filament.pages.proposal-board';

    protected Width | string | null $maxContentWidth = Width::Full;

    #[Url]
    public string $search = '';

    public function getSubheading(): ?string
    {
        return 'Arraste os cards entre as colunas para mudar o status.';
    }

    /** @return array<string, Collection<int, Proposal>> */
    public function getColumns(): array
    {
        $proposals = Proposal::query()
            ->when($this->search, fn ($q) => $q->where(fn ($q) => $q
                ->where('company', 'like', "%{$this->search}%")
                ->orWhere('full_name', 'like', "%{$this->search}%")))
            ->latest()
            ->get()
            ->groupBy('status');

        return collect(Proposal::STATUSES)
            ->mapWithKeys(fn ($label, $status) => [$status => $proposals->get($status, collect())])
            ->all();
    }

    public function moveProposal(int $id, string $status): void
    {
        abort_unless(array_key_exists($status, Proposal::STATUSES), 422);

        $proposal = Proposal::query()->findOrFail($id);
        if ($proposal->status === $status) {
            return;
        }

        $proposal->update(['status' => $status]);

        Notification::make()
            ->success()
            ->title("{$proposal->company} → ".Proposal::STATUSES[$status])
            ->body($status === 'enviada' && $proposal->access_token ? 'Link do cliente gerado.' : null)
            ->send();
    }

    public function editUrl(Proposal $proposal): string
    {
        return ProposalResource::getUrl('edit', ['record' => $proposal]);
    }

    protected function getHeaderActions(): array
    {
        return [
            Action::make('list')->label('Ver lista')->icon('heroicon-m-list-bullet')->color('gray')
                ->url(ProposalResource::getUrl()),
            Action::make('create')->label('Nova proposta')->icon('heroicon-m-plus')
                ->url(ProposalResource::getUrl('create')),
        ];
    }
}
