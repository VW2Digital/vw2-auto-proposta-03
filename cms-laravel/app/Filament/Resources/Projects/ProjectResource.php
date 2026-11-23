<?php

namespace App\Filament\Resources\Projects;

use App\Filament\Resources\BaseResource;
use App\Filament\Resources\Projects\Pages\CreateProject;
use App\Filament\Resources\Projects\Pages\EditProject;
use App\Filament\Resources\Projects\Pages\ListProjects;
use App\Filament\Support\Fields;
use App\Models\Project;
use App\Support\MediaUrl;
use Filament\Actions\Action;
use Filament\Actions\ActionGroup;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteAction;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Actions\ReplicateAction;
use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Components\Grid;
use Filament\Schemas\Components\Group;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Components\Tabs;
use Filament\Schemas\Components\Tabs\Tab;
use Filament\Schemas\Components\Utilities\Get;
use Filament\Schemas\Components\Utilities\Set;
use Filament\Schemas\Schema;
use Filament\Tables\Columns\ImageColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Columns\ToggleColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Filters\TernaryFilter;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class ProjectResource extends BaseResource
{
    protected static ?string $model = Project::class;

    protected static ?string $modelLabel = 'projeto';

    protected static ?string $pluralModelLabel = 'projetos';

    protected static ?string $recordTitleAttribute = 'name';

    protected static string | \BackedEnum | null $navigationIcon = 'heroicon-o-rectangle-group';

    protected static string | \UnitEnum | null $navigationGroup = 'Conteúdo do site';

    protected static ?int $navigationSort = 2;

    public static function getGloballySearchableAttributes(): array
    {
        return ['name', 'client', 'category', 'slug'];
    }

    public static function previewUrl(?Model $record = null): ?string
    {
        return $record?->slug ? static::frontend("projetos/{$record->slug}") : static::frontend('projetos');
    }

    public static function form(Schema $schema): Schema
    {
        return $schema->columns(3)->components([
            Group::make([
                Tabs::make('Projeto')
                    ->persistTabInQueryString()
                    ->tabs([
                        Tab::make('Informações')->icon('heroicon-m-information-circle')->schema([
                            Grid::make(2)->schema([
                                TextInput::make('name')->label('Nome do projeto')->required()->maxLength(160)
                                    ->live(onBlur: true)
                                    ->afterStateUpdated(fn (Set $set, ?string $state, string $operation) => $operation === 'create' ? $set('slug', Str::slug((string) $state)) : null),
                                TextInput::make('slug')->label('Slug (URL)')->required()->alphaDash()
                                    ->unique(ignoreRecord: true)->prefix('/projetos/')
                                    ->helperText('Ex.: clean-glow → /projetos/clean-glow'),
                                TextInput::make('category')->label('Categoria')->required()
                                    ->helperText('Ex.: Marca, Estratégia / Embalagem')
                                    ->datalist(fn () => Project::query()->distinct()->orderBy('category')->pluck('category')->all()),
                                Grid::make(2)->schema([
                                    TextInput::make('client')->label('Cliente'),
                                    TextInput::make('year')->label('Ano')->placeholder((string) now()->year)->maxLength(9),
                                ])->columnSpan(1),
                                Textarea::make('description')->label('Resumo curto')->rows(3)->columnSpanFull()
                                    ->helperText('1–2 frases na listagem e no topo da página.'),
                            ]),
                        ]),
                        Tab::make('Página')->icon('heroicon-m-squares-plus')
                            ->badge(fn (Get $get) => count($get('blocks') ?? []) ?: null)
                            ->schema([
                                Fields::blocks('blocks', 'Conteúdo da página', 'projects')
                                    ->helperText('Monte a página do projeto: texto, imagem, vídeo, botão, link… Arraste para organizar.'),
                            ]),
                        Tab::make('Galeria')->icon('heroicon-m-photo')
                            ->badge(fn (Get $get) => count($get('gallery') ?? []) ?: null)
                            ->schema([
                                Repeater::make('gallery')->hiddenLabel()
                                    ->addActionLabel('Adicionar foto')
                                    ->grid(2)
                                    ->collapsible()
                                    ->cloneable()
                                    ->reorderableWithButtons()
                                    ->itemLabel(fn (array $state) => $state['caption'] ?? 'Foto')
                                    ->default([])
                                    ->schema([
                                        Fields::upload('image', 'projects/gallery'),
                                        TextInput::make('imageUrl')->label('…ou URL da imagem')->maxLength(2048),
                                        TextInput::make('caption')->label('Legenda'),
                                        Toggle::make('wide')->label('Largura total'),
                                    ]),
                            ]),
                    ]),
            ])->columnSpan(['lg' => 2]),
            Group::make([
                Fields::image('projects', label: 'Capa', description: 'Imagem principal da listagem e do topo da página.', required: true),
                Section::make('Exibição')->icon('heroicon-o-adjustments-horizontal')->compact()->schema([
                    Toggle::make('featured')->label('Em destaque')->default(true)
                        ->helperText('Aparece em “Projetos em destaque” na home.'),
                    Toggle::make('tall')->label('Formato vertical (masonry)')->default(true),
                    TextInput::make('order')->label('Ordem')->numeric()->default(0)
                        ->helperText('Menor número aparece primeiro.'),
                ]),
            ])->columnSpan(['lg' => 1]),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->defaultSort('order')
            ->reorderable('order')
            ->columns([
                ImageColumn::make('cover')->label('')
                    ->state(fn (Project $record) => MediaUrl::pick($record->image, $record->image_url))
                    ->imageWidth(72)->imageHeight(48)->extraImgAttributes(['class' => 'rounded-md object-cover']),
                TextColumn::make('name')->label('Projeto')->searchable()->sortable()->weight('semibold')
                    ->description(fn (Project $record) => collect([$record->client, $record->year])->filter()->join(' · ') ?: null),
                TextColumn::make('category')->label('Categoria')->badge()->color('gray')->searchable(),
                TextColumn::make('slug')->label('URL')->prefix('/projetos/')->color('gray')->copyable()->toggleable(isToggledHiddenByDefault: true),
                ToggleColumn::make('featured')->label('Destaque'),
                TextColumn::make('updated_at')->label('Atualizado')->since()->sortable()->toggleable(),
            ])
            ->filters([
                TernaryFilter::make('featured')->label('Em destaque'),
                SelectFilter::make('category')->label('Categoria')
                    ->options(fn () => Project::query()->distinct()->orderBy('category')->pluck('category', 'category')->all()),
            ])
            ->recordActions([
                EditAction::make(),
                ActionGroup::make([
                    Action::make('open')->label('Ver no site')->icon('heroicon-m-arrow-top-right-on-square')
                        ->url(fn (Project $record) => static::previewUrl($record), shouldOpenInNewTab: true),
                    ReplicateAction::make()->label('Duplicar')
                        ->mutateRecordDataUsing(function (array $data) {
                            $data['name'] .= ' (cópia)';
                            $data['slug'] .= '-copia-'.Str::lower(Str::random(4));
                            $data['featured'] = false;

                            return $data;
                        }),
                    DeleteAction::make(),
                ]),
            ])
            ->toolbarActions([
                BulkActionGroup::make([
                    ...static::toggleBulkActions('featured', 'Destacar', 'Tirar do destaque'),
                    DeleteBulkAction::make(),
                ]),
            ]);
    }

    public static function getPages(): array
    {
        return [
            'index' => ListProjects::route('/'),
            'create' => CreateProject::route('/create'),
            'edit' => EditProject::route('/{record}/edit'),
        ];
    }
}
