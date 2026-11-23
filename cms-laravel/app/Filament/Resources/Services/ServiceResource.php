<?php

namespace App\Filament\Resources\Services;

use App\Filament\Resources\BaseResource;
use App\Filament\Resources\Services\Pages\CreateService;
use App\Filament\Resources\Services\Pages\EditService;
use App\Filament\Resources\Services\Pages\ListServices;
use App\Filament\Support\Fields;
use App\Models\Service;
use App\Support\Icons;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Components\Group;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Components\Utilities\Set;
use Filament\Schemas\Schema;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Columns\ToggleColumn;
use Filament\Tables\Filters\TernaryFilter;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class ServiceResource extends BaseResource
{
    protected static ?string $model = Service::class;

    protected static ?string $modelLabel = 'serviço';

    protected static ?string $pluralModelLabel = 'serviços';

    protected static ?string $recordTitleAttribute = 'title';

    protected static string | \BackedEnum | null $navigationIcon = 'heroicon-o-squares-2x2';

    protected static string | \UnitEnum | null $navigationGroup = 'Conteúdo do site';

    protected static ?int $navigationSort = 1;

    public static function previewUrl(?Model $record = null): ?string
    {
        return static::frontend('preview?section=servicos');
    }

    public static function form(Schema $schema): Schema
    {
        return $schema->columns(3)->components([
            Group::make([
                Section::make('Serviço')
                    ->description('Serviços do site e da montagem de proposta (iguais à landing).')
                    ->columns(2)
                    ->schema([
                        TextInput::make('title')->label('Título')->required()->maxLength(120)
                            ->live(onBlur: true)
                            ->afterStateUpdated(fn (Set $set, ?string $state, string $operation) => $operation === 'create' ? $set('slug', Str::slug((string) $state)) : null),
                        TextInput::make('slug')->label('Slug (ID)')->required()->unique(ignoreRecord: true)
                            ->alphaDash()->maxLength(120)
                            ->helperText('Ex.: identidade-visual — usado na seleção da proposta.'),
                        Textarea::make('description')->label('Descrição')->required()->rows(4)->columnSpanFull(),
                        Select::make('icon')->label('Ícone')->required()->allowHtml()->searchable()
                            ->options(Icons::options(Icons::SERVICES)),
                    ]),
            ])->columnSpan(['lg' => 2]),
            Group::make([
                Fields::visibility('active', 'Ativo', 'Aparece no site e na montagem de proposta.'),
            ])->columnSpan(['lg' => 1]),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->defaultSort('order')
            ->reorderable('order')
            ->columns([
                IconColumn::make('icon')->label('')->icon(fn (string $state) => Icons::HEROICON[$state] ?? 'heroicon-o-question-mark-circle')
                    ->color('primary')->width('1%'),
                TextColumn::make('title')->label('Título')->searchable()->sortable()->weight('semibold')
                    ->description(fn (Service $record) => Str::limit($record->description, 80)),
                TextColumn::make('slug')->label('Slug')->badge()->color('gray')->copyable()->searchable(),
                ToggleColumn::make('active')->label('Ativo'),
                TextColumn::make('updated_at')->label('Atualizado')->since()->sortable()->toggleable(),
            ])
            ->filters([
                TernaryFilter::make('active')->label('Ativo'),
            ])
            ->recordActions([EditAction::make()])
            ->toolbarActions([
                BulkActionGroup::make([
                    ...static::toggleBulkActions('active', 'Ativar', 'Desativar'),
                    DeleteBulkAction::make(),
                ]),
            ]);
    }

    public static function getPages(): array
    {
        return [
            'index' => ListServices::route('/'),
            'create' => CreateService::route('/create'),
            'edit' => EditService::route('/{record}/edit'),
        ];
    }
}
