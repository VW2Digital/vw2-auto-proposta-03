<?php

namespace App\Filament\Resources\Testimonials;

use App\Filament\Resources\BaseResource;
use App\Filament\Resources\Testimonials\Pages\CreateTestimonial;
use App\Filament\Resources\Testimonials\Pages\EditTestimonial;
use App\Filament\Resources\Testimonials\Pages\ListTestimonials;
use App\Filament\Support\Fields;
use App\Models\Testimonial;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\ToggleButtons;
use Filament\Schemas\Components\Group;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Columns\ToggleColumn;
use Filament\Tables\Filters\TernaryFilter;
use Filament\Tables\Table;
use Illuminate\Support\Str;

class TestimonialResource extends BaseResource
{
    protected static ?string $model = Testimonial::class;

    protected static ?string $modelLabel = 'depoimento';

    protected static ?string $pluralModelLabel = 'depoimentos';

    protected static ?string $recordTitleAttribute = 'name';

    protected static string | \BackedEnum | null $navigationIcon = 'heroicon-o-chat-bubble-bottom-center-text';

    protected static string | \UnitEnum | null $navigationGroup = 'Conteúdo do site';

    protected static ?int $navigationSort = 5;

    public static function form(Schema $schema): Schema
    {
        return $schema->columns(3)->components([
            Group::make([
                Section::make('Depoimento')
                    ->description('Depoimentos da landing — iguais ao site.')
                    ->columns(2)
                    ->schema([
                        TextInput::make('name')->label('Nome')->required()->maxLength(120),
                        TextInput::make('role')->label('Cargo / empresa')->required()->maxLength(160)
                            ->helperText('Ex.: CEO, NovaTech Solutions'),
                        Textarea::make('quote')->label('Depoimento')->required()->rows(5)->columnSpanFull(),
                        ToggleButtons::make('rating')->label('Nota (estrelas)')->required()->default(5)->inline()
                            ->options([1 => '1 ★', 2 => '2 ★', 3 => '3 ★', 4 => '4 ★', 5 => '5 ★'])
                            ->colors([1 => 'danger', 2 => 'warning', 3 => 'warning', 4 => 'success', 5 => 'success'])
                            ->columnSpanFull(),
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
                TextColumn::make('name')->label('Nome')->searchable()->weight('semibold')
                    ->description(fn (Testimonial $record) => $record->role),
                TextColumn::make('quote')->label('Depoimento')->formatStateUsing(fn (string $state) => '“'.Str::limit($state, 90).'”')
                    ->wrap()->color('gray'),
                TextColumn::make('rating')->label('Nota')->formatStateUsing(fn (int $state) => str_repeat('★', $state).str_repeat('☆', 5 - $state))
                    ->color('warning'),
                ToggleColumn::make('published')->label('Publicado'),
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
            'index' => ListTestimonials::route('/'),
            'create' => CreateTestimonial::route('/create'),
            'edit' => EditTestimonial::route('/{record}/edit'),
        ];
    }
}
