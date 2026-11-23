<?php

namespace App\Filament\Resources\CaseStudies;

use App\Filament\Forms\Components\MarkdownStudio;
use App\Filament\Resources\BaseResource;
use App\Filament\Resources\CaseStudies\Pages\CreateCaseStudy;
use App\Filament\Resources\CaseStudies\Pages\EditCaseStudy;
use App\Filament\Resources\CaseStudies\Pages\ListCaseStudies;
use App\Filament\Support\Fields;
use App\Models\CaseStudy;
use App\Support\MediaUrl;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\Repeater\TableColumn;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Components\Grid;
use Filament\Schemas\Components\Group;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;
use Filament\Tables\Columns\ImageColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Columns\ToggleColumn;
use Filament\Tables\Filters\TernaryFilter;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Model;

class CaseStudyResource extends BaseResource
{
    protected static ?string $model = CaseStudy::class;

    protected static ?string $slug = 'cases';

    protected static ?string $modelLabel = 'case';

    protected static ?string $pluralModelLabel = 'cases';

    protected static ?string $navigationLabel = 'Cases';

    protected static ?string $recordTitleAttribute = 'client';

    protected static string | \BackedEnum | null $navigationIcon = 'heroicon-o-trophy';

    protected static string | \UnitEnum | null $navigationGroup = 'Conteúdo do site';

    protected static ?int $navigationSort = 3;

    public static function previewUrl(?Model $record = null): ?string
    {
        return static::frontend('preview?section=cases');
    }

    public static function form(Schema $schema): Schema
    {
        return $schema->columns(3)->components([
            Group::make([
                Section::make('Card do site')
                    ->description('Cases de sucesso exibidos na landing.')
                    ->icon('heroicon-o-identification')
                    ->columns(2)
                    ->schema([
                        TextInput::make('client')->label('Cliente')->required(),
                        TextInput::make('sector')->label('Setor')->required(),
                        TextInput::make('result')->label('Resultado principal')->required()->placeholder('+187%'),
                        TextInput::make('result_label')->label('Legenda do resultado')->required()
                            ->placeholder('em contatos qualificados'),
                        Textarea::make('description')->label('Descrição curta (card do site)')->required()->rows(3)
                            ->helperText('1–2 frases exibidas no card da landing.')->columnSpanFull(),
                    ]),
                Section::make('Métricas')
                    ->icon('heroicon-o-chart-bar')
                    ->description('De 1 a 3 números de destaque.')
                    ->schema([
                        Repeater::make('metrics')->hiddenLabel()
                            ->schema([
                                TextInput::make('label')->label('Label')->required(),
                                TextInput::make('value')->label('Valor')->required(),
                            ])
                            ->table([
                                TableColumn::make('Label')->markAsRequired(),
                                TableColumn::make('Valor')->markAsRequired(),
                            ])
                            ->minItems(1)
                            ->maxItems(3)
                            ->default([['label' => '', 'value' => '']])
                            ->addActionLabel('Adicionar métrica')
                            ->reorderableWithButtons()
                            ->compact(),
                    ]),
                Section::make('Texto completo')
                    ->icon('heroicon-o-document-text')
                    ->collapsible()
                    ->schema([
                        MarkdownStudio::make('body')->hiddenLabel()->rows(18)
                            ->helperText('Use o template em content/templates/case.md. Markdown: títulos, listas, negrito.'),
                    ]),
            ])->columnSpan(['lg' => 2]),
            Group::make([
                Fields::image('cases', label: 'Imagem do case', description: 'Preferir proporção 16:9.'),
                Fields::visibility(),
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
                    ->state(fn (CaseStudy $record) => MediaUrl::pick($record->image, $record->image_url))
                    ->imageWidth(72)->imageHeight(40)->extraImgAttributes(['class' => 'rounded-md object-cover']),
                TextColumn::make('client')->label('Cliente')->searchable()->sortable()->weight('semibold')
                    ->description(fn (CaseStudy $record) => $record->sector),
                TextColumn::make('result')->label('Resultado')->badge()->color('success')
                    ->description(fn (CaseStudy $record) => $record->result_label),
                ToggleColumn::make('published')->label('Publicado'),
                TextColumn::make('updated_at')->label('Atualizado')->since()->sortable()->toggleable(),
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
            'index' => ListCaseStudies::route('/'),
            'create' => CreateCaseStudy::route('/create'),
            'edit' => EditCaseStudy::route('/{record}/edit'),
        ];
    }
}
