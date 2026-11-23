<?php

namespace App\Filament\Pages;

use App\Filament\Support\Fields;
use App\Support\PageBlocks;

class EditHomePage extends GlobalPage
{
    protected static ?string $slug = 'paginas/home';

    protected static ?string $title = 'Home';

    protected static ?string $navigationLabel = 'Home (montagem)';

    protected static string | \BackedEnum | null $navigationIcon = 'heroicon-o-home-modern';

    protected static ?int $navigationSort = 1;

    public function getSubheading(): ?string
    {
        return 'Monte a home com blocos: seções prontas (serviços, cases…) + texto, imagem, vídeo, botão e link.';
    }

    public static function globalSlug(): string
    {
        return 'home-page';
    }

    public static function defaults(): array
    {
        return [
            'blocks' => collect(array_keys(PageBlocks::HOME_MODULES))
                ->map(fn ($module) => ['type' => 'module', 'data' => ['module' => $module]])->all(),
        ];
    }

    protected function fields(): array
    {
        return [
            Fields::blocks('blocks', 'Blocos da home', 'home', withModules: true)
                ->helperText('Arraste para reordenar. Use “Seção do site” para módulos prontos, ou adicione texto/imagem/vídeo/botão/link.'),
        ];
    }
}
