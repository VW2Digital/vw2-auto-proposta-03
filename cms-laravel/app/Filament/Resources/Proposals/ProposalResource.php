<?php

namespace App\Filament\Resources\Proposals;

use App\Filament\Resources\BaseResource;
use App\Filament\Resources\Proposals\Pages\CreateProposal;
use App\Filament\Resources\Proposals\Pages\EditProposal;
use App\Filament\Resources\Proposals\Pages\ListProposals;
use App\Filament\Support\Fields;
use App\Models\Proposal;
use App\Models\Service;
use Filament\Actions\Action;
use Filament\Actions\ActionGroup;
use Filament\Actions\BulkAction;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteAction;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Infolists\Components\TextEntry;
use Filament\Notifications\Notification;
use Filament\Schemas\Components\Grid;
use Filament\Schemas\Components\Group;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Components\Tabs;
use Filament\Schemas\Components\Tabs\Tab;
use Filament\Schemas\Components\Utilities\Get;
use Filament\Schemas\Components\Utilities\Set;
use Filament\Schemas\Schema;
use Filament\Support\Enums\FontWeight;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\Filter;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class ProposalResource extends BaseResource
{
    protected static ?string $model = Proposal::class;

    protected static ?string $modelLabel = 'proposta';

    protected static ?string $pluralModelLabel = 'propostas';

    protected static ?string $recordTitleAttribute = 'company';

    protected static string | \BackedEnum | null $navigationIcon = 'heroicon-o-document-currency-dollar';

    protected static string | \UnitEnum | null $navigationGroup = 'Comercial';

    protected static ?int $navigationSort = 1;

    public static function getNavigationBadge(): ?string
    {
        $count = Proposal::query()->where('status', 'nova')->count();

        return $count ? (string) $count : null;
    }

    public static function getNavigationBadgeColor(): ?string
    {
        return 'info';
    }

    public static function getNavigationBadgeTooltip(): ?string
    {
        return 'Propostas novas';
    }

    public static function getGloballySearchableAttributes(): array
    {
        return ['company', 'full_name', 'email', 'whatsapp'];
    }

    public static function getGlobalSearchResultDetails(Model $record): array
    {
        return ['Contato' => $record->full_name, 'Status' => $record->statusLabel()];
    }

    public static function previewUrl(?Model $record = null): ?string
    {
        return $record?->clientUrl();
    }

    public static function form(Schema $schema): Schema
    {
        return $schema->columns(3)->components([
            Group::make([
                Tabs::make('Proposta')
                    ->persistTabInQueryString()
                    ->tabs([
                        Tab::make('Solicitação')->icon('heroicon-m-inbox-arrow-down')->schema([
                            Grid::make(2)->schema([
                                TextInput::make('full_name')->label('Nome completo')->required(),
                                TextInput::make('company')->label('Empresa')->required(),
                                TextInput::make('email')->label('E-mail')->email()->required()
                                    ->suffixAction(Action::make('mail')->icon('heroicon-m-envelope')->tooltip('Enviar e-mail')
                                        ->visible(fn (?Proposal $record) => filled($record?->email))
                                        ->url(fn (?Proposal $record) => 'mailto:'.$record?->email)),
                                TextInput::make('whatsapp')->label('WhatsApp')->tel()->required()
                                    ->suffixAction(Action::make('wa')->icon('heroicon-m-chat-bubble-oval-left')->tooltip('Abrir WhatsApp')
                                        ->visible(fn (?Proposal $record) => filled($record?->whatsapp))
                                        ->url(fn (?Proposal $record) => static::whatsappUrl($record?->whatsapp, $record), shouldOpenInNewTab: true)),
                                TextInput::make('website')->label('Site')->columnSpanFull()
                                    ->suffixAction(Action::make('site')->icon('heroicon-m-globe-alt')->tooltip('Abrir site')
                                        ->visible(fn (?Proposal $record) => filled($record?->website))
                                        ->url(fn (?Proposal $record) => preg_match('#^https?://#i', (string) $record?->website) ? $record?->website : 'https://'.$record?->website, shouldOpenInNewTab: true)),
                                Textarea::make('message')->label('Mensagem do cliente')->rows(4)->columnSpanFull(),
                            ]),
                            Repeater::make('services')->label('Serviços selecionados')
                                ->addActionLabel('Adicionar serviço')
                                ->itemLabel(fn (array $state) => $state['title'] ?? 'Serviço')
                                ->collapsible()
                                ->reorderableWithButtons()
                                ->default([])
                                ->columns(2)
                                ->schema([
                                    Select::make('serviceId')->label('Serviço')->required()->searchable()
                                        ->options(fn () => Service::query()->orderBy('order')->pluck('title', 'slug')->all())
                                        ->getOptionLabelUsing(fn ($value) => Service::query()->where('slug', $value)->value('title') ?? $value)
                                        ->live()
                                        ->afterStateUpdated(fn (Set $set, ?string $state) => $set('title', Service::query()->where('slug', $state)->value('title') ?? $state)),
                                    TextInput::make('title')->label('Título')->required(),
                                    Textarea::make('notes')->label('Observações')->rows(2)->columnSpanFull(),
                                ]),
                        ]),
                        Tab::make('Proposta formal')->icon('heroicon-m-document-text')->schema([
                            TextInput::make('formal_price')->label('Investimento proposto')
                                ->placeholder('R$ 8.500 / mês')->prefixIcon('heroicon-m-banknotes'),
                            Fields::blocks('content_blocks', 'Conteúdo da página do cliente', 'proposals')
                                ->helperText('Monte a proposta com texto, imagem, vídeo, botão e link. Arraste para organizar.'),
                            Textarea::make('formal_notes')->label('Notas internas')->rows(3)
                                ->helperText('Só para a equipe — não aparece para o cliente.'),
                        ]),
                        Tab::make('Resposta do cliente')->icon('heroicon-m-chat-bubble-left-right')
                            ->badge(fn (?Proposal $record) => $record?->client_response ? '1' : null)
                            ->badgeColor(fn (?Proposal $record) => $record?->client_response === 'accept' ? 'success' : 'danger')
                            ->schema([
                                TextEntry::make('client_response')->label('Resposta')
                                    ->badge()
                                    ->formatStateUsing(fn (?string $state) => match ($state) {
                                        'accept' => 'Aceitou',
                                        'negotiate' => 'Quer negociar',
                                        default => $state,
                                    })
                                    ->color(fn (?string $state) => $state === 'accept' ? 'success' : 'danger')
                                    ->placeholder('O cliente ainda não respondeu.'),
                                TextEntry::make('negotiate_message')->label('Mensagem de negociação')
                                    ->placeholder('—')->prose(),
                                TextEntry::make('client_responded_at')->label('Cliente respondeu em')
                                    ->dateTime('d/m/Y H:i')->placeholder('—'),
                            ]),
                    ]),
            ])->columnSpan(['lg' => 2]),

            Group::make([
                Section::make('Status')->icon('heroicon-o-flag')->compact()->schema([
                    Select::make('status')->hiddenLabel()->required()->default('nova')->native(false)->selectablePlaceholder(false)
                        ->options(Proposal::STATUSES)
                        ->helperText('“Enviada” gera o link do cliente.'),
                ]),
                Section::make('Link do cliente')->icon('heroicon-o-link')->compact()
                    ->visible(fn (?Proposal $record) => filled($record?->access_token))
                    ->schema([
                        TextEntry::make('client_link')->hiddenLabel()
                            ->state(fn (?Proposal $record) => $record?->clientUrl())
                            ->copyable()->copyMessage('Link copiado!')
                            ->icon('heroicon-m-clipboard-document')
                            ->color('primary')
                            ->size('sm')
                            ->helperText('O cliente abre com a senha de acesso das propostas.'),
                        DateTimePicker::make('sent_at')->label('Enviada em')->seconds(false)->native(false),
                    ]),
                Section::make('Linha do tempo')->icon('heroicon-o-clock')->compact()
                    ->hidden(fn (string $operation) => $operation === 'create')
                    ->schema([
                        TextEntry::make('created_at')->label('Recebida')->dateTime('d/m/Y H:i')->size('sm'),
                        TextEntry::make('sent_at')->label('Enviada ao cliente')->dateTime('d/m/Y H:i')->placeholder('Ainda não enviada')->size('sm'),
                        TextEntry::make('client_responded_at')->label('Resposta do cliente')->dateTime('d/m/Y H:i')->placeholder('Aguardando')->size('sm'),
                        TextEntry::make('updated_at')->label('Última edição')->since()->size('sm'),
                    ]),
            ])->columnSpan(['lg' => 1]),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->defaultSort('created_at', 'desc')
            ->columns([
                TextColumn::make('company')->label('Empresa')->searchable()->sortable()->weight(FontWeight::SemiBold)
                    ->description(fn (Proposal $record) => $record->full_name),
                TextColumn::make('services')->label('Serviços')
                    ->state(fn (Proposal $record) => collect($record->services)->pluck('title')->filter()->all())
                    ->badge()->color('gray')->limitList(2)->expandableLimitedList(),
                TextColumn::make('formal_price')->label('Investimento')->placeholder('—')->toggleable(),
                TextColumn::make('status')->label('Status')->badge()->sortable()
                    ->formatStateUsing(fn (string $state) => Proposal::STATUSES[$state] ?? $state)
                    ->color(fn (string $state) => Proposal::STATUS_COLORS[$state] ?? 'gray')
                    ->icon(fn (string $state) => Proposal::STATUS_ICONS[$state] ?? null),
                TextColumn::make('created_at')->label('Recebida')->since()->sortable()
                    ->dateTimeTooltip('d/m/Y H:i'),
                TextColumn::make('email')->label('E-mail')->copyable()->toggleable(isToggledHiddenByDefault: true),
                TextColumn::make('whatsapp')->label('WhatsApp')->copyable()->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                SelectFilter::make('services')->label('Serviço')
                    ->options(fn () => Service::query()->orderBy('order')->pluck('title', 'slug')->all())
                    ->query(fn (Builder $query, array $data) => $query->when($data['value'] ?? null,
                        fn (Builder $q, string $slug) => $q->where('services', 'like', '%"'.$slug.'"%'))),
                Filter::make('responded')->label('Cliente já respondeu')
                    ->query(fn (Builder $query) => $query->whereNotNull('client_response'))
                    ->toggle(),
            ])
            ->recordActions([
                EditAction::make(),
                ActionGroup::make([
                    ...static::statusActions(),
                    Action::make('whatsapp')->label('Chamar no WhatsApp')->icon('heroicon-m-chat-bubble-oval-left')->color('success')
                        ->url(fn (Proposal $record) => static::whatsappUrl($record->whatsapp, $record), shouldOpenInNewTab: true),
                    Action::make('client')->label('Abrir página do cliente')->icon('heroicon-m-arrow-top-right-on-square')
                        ->visible(fn (Proposal $record) => filled($record->access_token))
                        ->url(fn (Proposal $record) => $record->clientUrl(), shouldOpenInNewTab: true),
                    DeleteAction::make(),
                ])->tooltip('Mais ações'),
            ])
            ->toolbarActions([
                BulkActionGroup::make([
                    BulkAction::make('status')->label('Mudar status')->icon('heroicon-m-flag')
                        ->schema([Select::make('status')->label('Novo status')->options(Proposal::STATUSES)->required()])
                        ->action(function (Collection $records, array $data) {
                            $records->each(fn (Proposal $p) => $p->update(['status' => $data['status']]));
                            Notification::make()->success()->title('Status atualizado')->send();
                        })
                        ->deselectRecordsAfterCompletion(),
                    DeleteBulkAction::make(),
                ]),
            ])
            ->emptyStateIcon('heroicon-o-inbox')
            ->emptyStateHeading('Nenhuma proposta por aqui')
            ->emptyStateDescription('Quando um cliente montar uma proposta no site, ela aparece nesta lista.');
    }

    /** Ações “Mover para …” — uma por status. */
    public static function statusActions(): array
    {
        return collect(Proposal::STATUSES)->map(fn (string $label, string $status) => Action::make("status_{$status}")
            ->label("Mover para {$label}")
            ->icon(Proposal::STATUS_ICONS[$status])
            ->color(Proposal::STATUS_COLORS[$status])
            ->hidden(fn (Proposal $record) => $record->status === $status)
            ->action(function (Proposal $record) use ($status, $label) {
                $record->update(['status' => $status]);
                Notification::make()->success()->title("{$record->company} → {$label}")->send();
            }))->values()->all();
    }

    public static function whatsappUrl(?string $phone, ?Proposal $proposal = null): string
    {
        $digits = preg_replace('/\D+/', '', (string) $phone);
        if (strlen($digits) <= 11) {
            $digits = '55'.$digits;
        }

        $text = $proposal
            ? "Olá, {$proposal->full_name}! Aqui é da Nexo Studio, sobre a proposta da {$proposal->company}."
                .($proposal->clientUrl() ? "\n\nSeu link: ".$proposal->clientUrl() : '')
            : '';

        return "https://wa.me/{$digits}".($text ? '?text='.rawurlencode($text) : '');
    }

    public static function getPages(): array
    {
        return [
            'index' => ListProposals::route('/'),
            'create' => CreateProposal::route('/create'),
            'edit' => EditProposal::route('/{record}/edit'),
        ];
    }
}
