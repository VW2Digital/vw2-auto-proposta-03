<?php

namespace App\Filament\Pages;

use App\Models\SiteGlobal;
use Filament\Actions\Action;
use Filament\Notifications\Notification;
use Filament\Pages\Page;
use Filament\Schemas\Components\Actions;
use Filament\Schemas\Components\EmbeddedSchema;
use Filament\Schemas\Components\Form;
use Filament\Schemas\Schema;
use Filament\Support\Enums\Width;

/**
 * Página de edição de um conteúdo único do site (Hero, Trust Bar, Vídeo, Home).
 *
 * @property-read Schema $form
 */
abstract class GlobalPage extends Page
{
    protected static string | \UnitEnum | null $navigationGroup = 'Páginas';

    /** Chave em site_globals. */
    abstract public static function globalSlug(): string;

    /** Valores usados quando ainda não há nada salvo. */
    public static function defaults(): array
    {
        return [];
    }

    public static function previewPath(): string
    {
        return '/';
    }

    /** @var array<string, mixed> | null */
    public ?array $data = [];

    public function mount(): void
    {
        $saved = SiteGlobal::get(static::globalSlug());
        $this->form->fill($saved ?: static::defaults());
    }

    abstract protected function fields(): array;

    public function form(Schema $schema): Schema
    {
        return $schema->components($this->fields())->statePath('data');
    }

    public function content(Schema $schema): Schema
    {
        return $schema->components([
            Form::make([EmbeddedSchema::make('form')])
                ->id('form')
                ->livewireSubmitHandler('save')
                ->footer([
                    Actions::make([
                        Action::make('save')->label('Salvar alterações')->submit('save')->keyBindings(['mod+s']),
                    ])->sticky()->key('form-actions'),
                ]),
        ]);
    }

    public function save(): void
    {
        $data = $this->form->getState();
        SiteGlobal::put(static::globalSlug(), $data);

        Notification::make()
            ->success()
            ->title('Salvo')
            ->body('O site já mostra a nova versão (recarregue a página do site).')
            ->send();
    }

    protected function previewUrl(): string
    {
        return rtrim(config('cms.frontend_url'), '/').static::previewPath();
    }

    protected function getHeaderActions(): array
    {
        return [
            Action::make('livePreview')
                ->label('Pré-visualizar')
                ->icon('heroicon-m-eye')
                ->color('gray')
                ->slideOver()
                ->modalWidth(Width::SevenExtraLarge)
                ->modalHeading('Pré-visualização do site')
                ->modalDescription('Salve para ver as mudanças. Use “Atualizar” para recarregar.')
                ->modalSubmitAction(false)
                ->modalCancelActionLabel('Fechar')
                ->modalContent(fn () => view('filament.components.site-preview', ['url' => $this->previewUrl()])),
            Action::make('open')
                ->label('Abrir site')
                ->icon('heroicon-m-arrow-top-right-on-square')
                ->color('gray')
                ->url(fn () => $this->previewUrl(), shouldOpenInNewTab: true),
        ];
    }
}
