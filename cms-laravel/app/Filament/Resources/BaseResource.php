<?php

namespace App\Filament\Resources;

use Filament\Actions\Action;
use Filament\Actions\BulkAction;
use Filament\Resources\Resource;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

abstract class BaseResource extends Resource
{
    /** URL do site para pré-visualizar (null = sem botão). */
    public static function previewUrl(?Model $record = null): ?string
    {
        return null;
    }

    public static function frontend(string $path = ''): string
    {
        return rtrim(config('cms.frontend_url'), '/').'/'.ltrim($path, '/');
    }

    /** @return array<Action> */
    public static function previewActions(?Model $record = null): array
    {
        $url = static::previewUrl($record);

        if (! $url) {
            return [];
        }

        return [
            Action::make('preview')
                ->label('Ver no site')
                ->icon('heroicon-m-arrow-top-right-on-square')
                ->color('gray')
                ->url($url, shouldOpenInNewTab: true),
        ];
    }

    /** Ações em massa de publicar/ocultar para um campo booleano. */
    public static function toggleBulkActions(string $column, string $on = 'Publicar', string $off = 'Ocultar'): array
    {
        return [
            BulkAction::make("{$column}_on")
                ->label($on)
                ->icon('heroicon-m-eye')
                ->action(fn (Collection $records) => $records->each->update([$column => true]))
                ->deselectRecordsAfterCompletion(),
            BulkAction::make("{$column}_off")
                ->label($off)
                ->icon('heroicon-m-eye-slash')
                ->color('gray')
                ->action(fn (Collection $records) => $records->each->update([$column => false]))
                ->deselectRecordsAfterCompletion(),
        ];
    }
}
