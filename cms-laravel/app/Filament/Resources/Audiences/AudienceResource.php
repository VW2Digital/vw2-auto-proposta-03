<?php

namespace App\Filament\Resources\Audiences;

use App\Filament\Resources\Audiences\Pages\CreateAudience;
use App\Filament\Resources\Audiences\Pages\EditAudience;
use App\Filament\Resources\Audiences\Pages\ListAudiences;
use App\Filament\Resources\BaseResource;
use App\Filament\Support\Fields;
use App\Models\Audience;
use App\Support\Icons;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Components\Group;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Columns\ToggleColumn;
use Filament\Tables\Filters\TernaryFilter;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class AudienceResource extends BaseResource
{
    protected static ?string $model = Audience::class;

    protected static ?string $modelLabel = 'público';

    protected static ?string $pluralModelLabel = 'quem ajudamos';

    protected static ?string $navigationLabel = 'Quem ajudamos';

    protected static ?string $recordTitleAttribute = 'title';

    protected static string | \BackedEnum | null $navigationIcon = 'heroicon-o-user-group';

    protected static string | \UnitEnum | null $navigationGroup = 'Conteúdo do site';

    protected static ?int $navigationSort = 4;

    public static function previewUrl(?Model $record = null): ?string
    {
        return static::frontend('preview?section=quem-ajudamos');
    }

    public static function form(Schema $schema): Schema
    {
        return $schema->columns(3)->components([
            Group::make([
                Section::make('Público')
                    ->description('Cards da seção “Quem ajudamos” — iguais ao site.')
                    ->schema([
                        TextInput::make('title')->label('Título')->required()->maxLength(120),
                        Textarea::make('description')->label('Descrição')->required()->rows(4),
                        Select::make('icon')->label('Ícone')->required()->allowHtml()
                            ->options(Icons::options(Icons::AUDIENCES)),
                    ]),
            ])->columnSpan(['lg' => 2]),
            Group::make([Fields::visibility()])->columnSpan(['lg' => 1]),
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
                TextColumn::make('title')->label('Título')->searchable()->weight('semibold')
                    ->description(fn (Audience $record) => Str::limit($record->description, 90)),
                ToggleColumn::make('published')->label('Publicado'),
                TextColumn::make('updated_at')->label('Atualizado')->since()->toggleable(),
            ])
            ->filters([TernaryFilter::make('published')->label('Publicado')])
            ->recordActions([EditAction::make()])
            ->toolbarActions([
                BulkActionGroup::make([...static::toggleBulkActions('published'), DeleteBulkAction::make()]),
            ]);
    }

    public static function getPages(): array
    {
        return [
            'index' => ListAudiences::route('/'),
            'create' => CreateAudience::route('/create'),
            'edit' => EditAudience::route('/{record}/edit'),
        ];
    }
}
