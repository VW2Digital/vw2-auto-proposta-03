<?php

namespace App\Filament\Resources\Media;

use App\Filament\Resources\Media\Pages\ManageMedia;
use App\Models\Media;
use Filament\Actions\Action;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteAction;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\TextInput;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Tables\Columns\ImageColumn;
use Filament\Tables\Columns\Layout\Panel;
use Filament\Tables\Columns\Layout\Split;
use Filament\Tables\Columns\Layout\Stack;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;
use Illuminate\Support\Number;

class MediaResource extends Resource
{
    protected static ?string $model = Media::class;

    protected static ?string $slug = 'media';

    protected static ?string $modelLabel = 'arquivo';

    protected static ?string $pluralModelLabel = 'mídia';

    protected static ?string $navigationLabel = 'Biblioteca de mídia';

    protected static ?string $recordTitleAttribute = 'filename';

    protected static string | \BackedEnum | null $navigationIcon = 'heroicon-o-photo';

    protected static string | \UnitEnum | null $navigationGroup = 'Sistema';

    protected static ?int $navigationSort = 1;

    public static function form(Schema $schema): Schema
    {
        return $schema->components([
            FileUpload::make('path')->label('Arquivo')->required()
                ->disk('public')->directory('media')->visibility('public')
                ->preserveFilenames()
                ->image()->imageEditor()
                ->acceptedFileTypes(['image/*', 'image/svg+xml', 'video/mp4', 'application/pdf'])
                ->maxSize(20480)
                ->columnSpanFull(),
            TextInput::make('alt')->label('Texto alternativo')->required()
                ->helperText('Descreve a imagem para leitores de tela e SEO.')
                ->columnSpanFull(),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->defaultSort('created_at', 'desc')
            ->contentGrid(['md' => 3, 'xl' => 4, '2xl' => 5])
            ->paginationPageOptions([20, 40, 80])
            ->columns([
                Stack::make([
                    ImageColumn::make('path')->disk('public')->label('')
                        ->imageHeight('10rem')->imageWidth('100%')
                        ->extraImgAttributes(['class' => 'w-full rounded-lg object-contain bg-gray-50 dark:bg-white/5 p-2', 'loading' => 'lazy']),
                    Stack::make([
                        TextColumn::make('filename')->label('Arquivo')->weight('semibold')->limit(28)->searchable()
                            ->tooltip(fn (Media $record) => $record->filename),
                        TextColumn::make('alt')->label('Alt')->color('gray')->size('xs')->limit(40)->searchable(),
                        TextColumn::make('meta')->label('')->color('gray')->size('xs')
                            ->state(fn (Media $record) => collect([
                                $record->width && $record->height ? "{$record->width}×{$record->height}" : null,
                                $record->size ? Number::fileSize($record->size) : null,
                            ])->filter()->join(' · ')),
                    ])->space(1)->extraAttributes(['class' => 'pt-3']),
                ]),
            ])
            ->recordActions([
                Action::make('copy')->label('Copiar URL')->icon('heroicon-m-clipboard-document')->color('gray')
                    ->alpineClickHandler(fn (Media $record) => 'window.navigator.clipboard.writeText('.json_encode($record->url).'); $tooltip(\'URL copiada!\', { timeout: 1500 })'),
                EditAction::make()->iconButton(),
                DeleteAction::make()->iconButton(),
            ])
            ->toolbarActions([BulkActionGroup::make([DeleteBulkAction::make()])])
            ->emptyStateIcon('heroicon-o-photo')
            ->emptyStateHeading('Nenhum arquivo ainda')
            ->emptyStateDescription('Envie logos, fotos e vídeos para reaproveitar pelo link.');
    }

    public static function getPages(): array
    {
        return ['index' => ManageMedia::route('/')];
    }
}
