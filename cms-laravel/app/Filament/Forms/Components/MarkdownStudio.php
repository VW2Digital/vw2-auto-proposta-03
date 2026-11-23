<?php

namespace App\Filament\Forms\Components;

use Closure;
use Filament\Forms\Components\Concerns\HasPlaceholder;
use Filament\Forms\Components\Field;

/**
 * Markdown com barra de formatação (negrito, títulos, listas, cor e tamanho)
 * e pré-visualização ao lado. Mesmo formato que o site renderiza
 * (src/components/Markdown.jsx), incluindo <span style="color;font-size">.
 */
class MarkdownStudio extends Field
{
    use HasPlaceholder;

    protected string $view = 'filament.forms.components.markdown-studio';

    protected int | Closure $rows = 8;

    protected string | Closure $defaultColor = '#0a0a0a';

    protected bool | Closure $darkPreview = false;

    public function rows(int | Closure $rows): static
    {
        $this->rows = $rows;

        return $this;
    }

    public function getRows(): int
    {
        return (int) $this->evaluate($this->rows);
    }

    public function defaultColor(string | Closure $color): static
    {
        $this->defaultColor = $color;

        return $this;
    }

    public function getDefaultColor(): string
    {
        return (string) $this->evaluate($this->defaultColor);
    }

    /** Pré-visualiza sobre fundo escuro (ex.: título do Hero, texto branco). */
    public function darkPreview(bool | Closure $condition = true): static
    {
        $this->darkPreview = $condition;

        return $this;
    }

    public function hasDarkPreview(): bool
    {
        return (bool) $this->evaluate($this->darkPreview);
    }
}
