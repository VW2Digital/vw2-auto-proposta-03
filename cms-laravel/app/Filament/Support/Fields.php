<?php

namespace App\Filament\Support;

use App\Filament\Forms\Components\MarkdownStudio;
use App\Support\MediaUrl;
use App\Support\PageBlocks;
use Filament\Forms\Components\Builder;
use Filament\Forms\Components\Builder\Block;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Components\Grid;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Components\Utilities\Get;
use Illuminate\Support\Str;

/** Campos reaproveitados por várias telas do admin. */
class Fields
{
    /** Upload de imagem no disco público, com editor de recorte. */
    public static function upload(string $name, string $directory, string $label = 'Upload'): FileUpload
    {
        return FileUpload::make($name)
            ->label($label)
            ->image()
            ->imageEditor()
            ->disk('public')
            ->directory("uploads/{$directory}")
            ->visibility('public')
            ->maxSize(10240)
            ->openable()
            ->downloadable();
    }

    /**
     * Imagem por upload OU URL externa (o upload tem prioridade),
     * com miniatura da URL quando não há upload.
     */
    public static function image(
        string $directory,
        string $upload = 'image',
        string $url = 'image_url',
        string $label = 'Imagem',
        ?string $description = null,
        bool $required = false,
    ): Section {
        return Section::make($label)
            ->description($description)
            ->icon('heroicon-o-photo')
            ->compact()
            ->schema([
                self::upload($upload, $directory)
                    ->required(fn (Get $get) => $required && blank($get($url)))
                    ->validationMessages(['required' => 'Informe uma URL ou faça upload.']),
                TextInput::make($url)
                    ->label('…ou URL da imagem')
                    ->placeholder('https://… ou /arquivo-publico.png')
                    ->maxLength(2048)
                    ->live(onBlur: true)
                    ->required(fn (Get $get) => $required && blank($get($upload)))
                    ->validationMessages(['required' => 'Informe uma URL ou faça upload.'])
                    ->helperText(fn (Get $get) => filled($get($upload)) ? 'O upload acima tem prioridade sobre esta URL.' : null),
                \Filament\Schemas\Components\View::make('filament.components.image-url-preview')
                    ->viewData(fn (Get $get) => ['url' => blank($get($upload)) ? MediaUrl::from($get($url)) : null]),
            ]);
    }

    /** Lateral padrão: publicado + ordem. */
    public static function visibility(string $toggle = 'published', string $toggleLabel = 'Publicado', ?string $hint = 'Aparece no site.'): Section
    {
        return Section::make('Publicação')
            ->icon('heroicon-o-eye')
            ->compact()
            ->schema([
                Toggle::make($toggle)->label($toggleLabel)->helperText($hint)->default(true)->inline(false),
                TextInput::make('order')
                    ->label('Ordem')
                    ->numeric()
                    ->default(0)
                    ->helperText('Menor número aparece primeiro. Também dá para arrastar na listagem.'),
            ]);
    }

    /** Page builder: texto, título, imagem, vídeo, botão, link, divisor (+ seções da home). */
    public static function blocks(string $name, string $label, string $directory, bool $withModules = false): Builder
    {
        $blocks = [
            Block::make('text')
                ->label(fn (?array $state) => self::blockLabel('Texto', preg_replace('/[#*`>_\[\]]+|\s+/', ' ', strip_tags($state['content'] ?? ''))))
                ->icon('heroicon-o-bars-3-bottom-left')
                ->schema([
                    MarkdownStudio::make('content')->label('Conteúdo (Markdown)')->rows(10)->required()
                        ->helperText('Títulos, listas, negrito, cor e tamanho.'),
                ]),
            Block::make('heading')
                ->label(fn (?array $state) => self::blockLabel('Título', $state['text'] ?? null))
                ->icon('heroicon-o-h1')
                ->columns(4)
                ->schema([
                    TextInput::make('text')->label('Texto')->required()->columnSpan(3),
                    Select::make('level')->label('Nível')->options(['h1' => 'H1', 'h2' => 'H2', 'h3' => 'H3'])
                        ->default('h2')->selectablePlaceholder(false),
                ]),
            Block::make('image')
                ->label(fn (?array $state) => self::blockLabel('Imagem', $state['caption'] ?? $state['alt'] ?? null))
                ->icon('heroicon-o-photo')
                ->schema([
                    Grid::make(2)->schema([
                        self::upload('image', $directory),
                        Grid::make(1)->schema([
                            TextInput::make('imageUrl')->label('…ou URL da imagem')->maxLength(2048),
                            TextInput::make('alt')->label('Texto alternativo'),
                            TextInput::make('caption')->label('Legenda'),
                            Toggle::make('wide')->label('Largura total'),
                        ])->columnSpan(1),
                    ]),
                ]),
            Block::make('video')
                ->label(fn (?array $state) => self::blockLabel('Vídeo', $state['caption'] ?? $state['videoUrl'] ?? null))
                ->icon('heroicon-o-play-circle')
                ->columns(2)
                ->schema([
                    TextInput::make('videoUrl')->label('URL do vídeo')->required()->url()
                        ->helperText('YouTube, Vimeo ou arquivo .mp4'),
                    TextInput::make('caption')->label('Legenda'),
                ]),
            Block::make('button')
                ->label(fn (?array $state) => self::blockLabel('Botão', $state['label'] ?? null))
                ->icon('heroicon-o-cursor-arrow-rays')
                ->columns(3)
                ->schema([
                    TextInput::make('label')->label('Texto do botão')->required()->default('Saiba mais'),
                    TextInput::make('url')->label('Link')->required()->default('#')
                        ->helperText('URL completa ou âncora (ex.: #proposta).'),
                    Select::make('style')->label('Estilo')->default('primary')->selectablePlaceholder(false)
                        ->options(['primary' => 'Principal', 'secondary' => 'Secundário', 'whatsapp' => 'WhatsApp']),
                ]),
            Block::make('link')
                ->label(fn (?array $state) => self::blockLabel('Link', $state['label'] ?? null))
                ->icon('heroicon-o-link')
                ->columns(2)
                ->schema([
                    TextInput::make('label')->label('Texto do link')->required(),
                    TextInput::make('url')->label('URL')->required(),
                ]),
            Block::make('divider')
                ->label(fn (?array $state) => self::blockLabel('Divisor', $state['note'] ?? null))
                ->icon('heroicon-o-minus')
                ->schema([
                    TextInput::make('note')->label('Nota interna (opcional)')
                        ->helperText('Só para organização no admin — não aparece no site.'),
                ]),
        ];

        if ($withModules) {
            array_unshift($blocks, Block::make('module')
                ->label(fn (?array $state) => self::blockLabel('Seção do site', PageBlocks::HOME_MODULES[$state['module'] ?? ''] ?? null))
                ->icon('heroicon-o-squares-plus')
                ->schema([
                    Select::make('module')->label('Seção')->required()->options(PageBlocks::HOME_MODULES)
                        ->helperText('Insere uma seção pronta da home (arraste para reordenar).'),
                ]));
        }

        return Builder::make($name)
            ->label($label)
            ->blocks($blocks)
            ->addActionLabel('Adicionar bloco')
            ->blockPickerColumns(2)
            ->blockPickerWidth('2xl')
            ->collapsible()
            // Na home a lista de seções fica recolhida: lê-se como a ordem da página.
            ->collapsed($withModules)
            ->cloneable()
            ->reorderableWithButtons()
            ->blockNumbers(false)
            ->default([])
            ->columnSpanFull();
    }

    protected static function blockLabel(string $type, ?string $detail): string
    {
        $detail = trim(preg_replace('/\s+/', ' ', (string) $detail));

        return $detail !== '' ? "{$type} · ".Str::limit($detail, 60) : $type;
    }
}
