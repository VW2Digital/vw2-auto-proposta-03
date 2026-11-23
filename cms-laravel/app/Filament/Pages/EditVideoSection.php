<?php

namespace App\Filament\Pages;

use Filament\Forms\Components\TextInput;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Components\Utilities\Get;
use Filament\Schemas\Components\View;

class EditVideoSection extends GlobalPage
{
    protected static ?string $slug = 'paginas/video';

    protected static ?string $title = 'Seção de vídeo';

    protected static ?string $navigationLabel = 'Seção de vídeo';

    protected static string | \BackedEnum | null $navigationIcon = 'heroicon-o-play-circle';

    protected static ?int $navigationSort = 4;

    public function getSubheading(): ?string
    {
        return 'Terceira seção da home — o vídeo toca em autoplay, sem som.';
    }

    public static function globalSlug(): string
    {
        return 'video-section';
    }

    protected function fields(): array
    {
        return [
            Section::make('Vídeo')->icon('heroicon-o-film')->schema([
                TextInput::make('videoUrl')->label('URL do vídeo')->url()->live(onBlur: true)
                    ->helperText('YouTube, Vimeo ou arquivo .mp4.'),
                View::make('filament.components.video-preview')
                    ->viewData(fn (Get $get) => ['url' => $get('videoUrl')]),
            ]),
        ];
    }
}
