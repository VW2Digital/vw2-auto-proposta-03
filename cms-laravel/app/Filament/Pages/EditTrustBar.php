<?php

namespace App\Filament\Pages;

use App\Filament\Forms\Components\MarkdownStudio;
use App\Filament\Support\Fields;
use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Components\Section;

class EditTrustBar extends GlobalPage
{
    protected static ?string $slug = 'paginas/trust-bar';

    protected static ?string $title = 'Trust Bar';

    protected static ?string $navigationLabel = 'Trust Bar (logos)';

    protected static string | \BackedEnum | null $navigationIcon = 'heroicon-o-check-badge';

    protected static ?int $navigationSort = 3;

    public function getSubheading(): ?string
    {
        return 'Segunda seção da home — prova social + logos.';
    }

    public static function globalSlug(): string
    {
        return 'trust-bar';
    }

    public static function defaults(): array
    {
        return [
            'text' => "Junte-se a **5.000+** membros satisfeitos.\nConfiado por **5.000+** times.",
            'logos' => collect(['Kerala', 'Dean Tadnai', 'Root Media', 'Altitude', 'Northline'])
                ->map(fn ($name) => ['name' => $name, 'image' => null, 'imageUrl' => null])->all(),
        ];
    }

    protected function fields(): array
    {
        return [
            Section::make('Texto')->icon('heroicon-o-language')->schema([
                MarkdownStudio::make('text')->hiddenLabel()->required()->rows(4)
                    ->helperText('Use **negrito** para destaques e quebras de linha.'),
            ]),
            Section::make('Logos / marcas')->icon('heroicon-o-building-office-2')
                ->description('Sem imagem, o nome aparece como texto.')
                ->schema([
                    Repeater::make('logos')->hiddenLabel()
                        ->addActionLabel('Adicionar logo')
                        ->grid(['md' => 2, 'xl' => 3])
                        ->collapsible()
                        ->reorderableWithButtons()
                        ->cloneable()
                        ->itemLabel(fn (array $state) => $state['name'] ?? 'Logo')
                        ->schema([
                            TextInput::make('name')->label('Nome')->required()
                                ->helperText('Alt da imagem ou texto se não houver logo.'),
                            Fields::upload('image', 'logos', 'Upload do logo'),
                            TextInput::make('imageUrl')->label('…ou URL do logo'),
                        ]),
                ]),
        ];
    }
}
