<?php

namespace App\Filament\Pages;

use App\Filament\Forms\Components\MarkdownStudio;
use App\Filament\Support\Fields;
use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\Slider;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Components\Grid;
use Filament\Schemas\Components\Group;
use Filament\Schemas\Components\Section;

class EditHero extends GlobalPage
{
    protected static ?string $slug = 'paginas/hero';

    protected static ?string $title = 'Hero';

    protected static ?string $navigationLabel = 'Hero (topo)';

    protected static string | \BackedEnum | null $navigationIcon = 'heroicon-o-sparkles';

    protected static ?int $navigationSort = 2;

    public function getSubheading(): ?string
    {
        return 'Primeira seção da home — foto de fundo, altura, textos e CTA.';
    }

    public static function globalSlug(): string
    {
        return 'hero';
    }

    public static function defaults(): array
    {
        return [
            'media' => ['image_url' => '/hero-team.png', 'image' => null, 'height' => 85, 'objectPosition' => 'center'],
            'tags' => ['Design Inteligente', 'Experiências', 'Estratégia', 'Marca'],
            'title' => "<span style=\"color:#ffffff\">*Design criativo*</span>\n\n<span style=\"color:#ffffff\">**ESTRATÉGIA**</span>",
            'subtitle' => 'Monte sua proposta personalizada em minutos e impulsione o crescimento do seu negócio.',
            'ctaLabel' => 'Vamos conversar',
            'ctaLink' => '#proposta',
        ];
    }

    protected function fields(): array
    {
        return [
            Grid::make(['default' => 1, 'lg' => 3])->schema([
                Group::make([
                    Section::make('Textos')->icon('heroicon-o-language')->schema([
                        MarkdownStudio::make('title')->label('Título (Markdown)')->required()->rows(6)
                            ->defaultColor('#ffffff')->darkPreview()
                            ->helperText('O site renderiza este Markdown: *itálico*, **negrito**, # H1–### H3, cor e tamanho (px). Selecione o texto e use a barra.'),
                        Textarea::make('subtitle')->label('Subtítulo')->required()->rows(2),
                        Grid::make(2)->schema([
                            TextInput::make('ctaLabel')->label('Texto do botão')->required(),
                            TextInput::make('ctaLink')->label('Link do botão')
                                ->helperText('URL completa (ex.: https://wa.me/55...) ou âncora (ex.: #proposta).'),
                        ]),
                    ]),
                    Section::make('Tags')->icon('heroicon-o-tag')->collapsible()->schema([
                        Repeater::make('tags')->hiddenLabel()
                            ->simple(TextInput::make('label')->required()->placeholder('Ex.: Estratégia'))
                            ->addActionLabel('Adicionar tag')
                            ->reorderableWithButtons()
                            ->grid(2),
                    ]),
                ])->columnSpan(['lg' => 2]),
                Group::make([
                    Fields::image('hero', 'media.image', 'media.image_url', 'Foto de fundo', 'URL externa, caminho público (ex.: /hero-team.png) ou upload.'),
                    Section::make('Tamanho')->icon('heroicon-o-arrows-pointing-out')->compact()->schema([
                        Slider::make('media.height')->label('Altura do hero (vh)')->range(50, 100)->step(5)->default(85)
                            ->tooltips()->helperText('100 = tela cheia.'),
                        TextInput::make('media.objectPosition')->label('Posição da foto')->default('center')
                            ->datalist(['center', 'center top', 'center bottom', 'left center', 'right center', '70% center'])
                            ->helperText('Ex.: center, center top, 70% center'),
                    ]),
                ])->columnSpan(['lg' => 1]),
            ]),
        ];
    }
}
