<?php

namespace App\Filament\Widgets;

use App\Filament\Resources\Proposals\ProposalResource;
use App\Models\Proposal;
use Filament\Actions\Action;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;
use Filament\Widgets\TableWidget;

class LatestProposals extends TableWidget
{
    protected static ?int $sort = 4;

    protected int | string | array $columnSpan = 'full';

    protected static ?string $heading = 'Últimas propostas';

    public function table(Table $table): Table
    {
        return $table
            ->query(Proposal::query()->latest()->limit(6))
            ->paginated(false)
            ->recordUrl(fn (Proposal $record) => ProposalResource::getUrl('edit', ['record' => $record]))
            ->columns([
                TextColumn::make('company')->label('Empresa')->weight('semibold')
                    ->description(fn (Proposal $record) => $record->full_name),
                TextColumn::make('services')->label('Serviços')
                    ->state(fn (Proposal $record) => collect($record->services)->pluck('title')->filter()->all())
                    ->badge()->color('gray')->limitList(2),
                TextColumn::make('status')->label('Status')->badge()
                    ->formatStateUsing(fn (string $state) => Proposal::STATUSES[$state] ?? $state)
                    ->color(fn (string $state) => Proposal::STATUS_COLORS[$state] ?? 'gray')
                    ->icon(fn (string $state) => Proposal::STATUS_ICONS[$state] ?? null),
                TextColumn::make('created_at')->label('Recebida')->since(),
            ])
            ->headerActions([
                Action::make('all')->label('Ver todas')->link()->url(ProposalResource::getUrl()),
            ])
            ->emptyStateHeading('Nenhuma proposta ainda');
    }
}
