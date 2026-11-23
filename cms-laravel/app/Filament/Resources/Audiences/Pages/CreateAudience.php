<?php

namespace App\Filament\Resources\Audiences\Pages;

use App\Filament\Resources\Audiences\AudienceResource;
use Filament\Resources\Pages\CreateRecord;

class CreateAudience extends CreateRecord
{
    protected static string $resource = AudienceResource::class;

    protected function getRedirectUrl(): string
    {
        return static::getResource()::getUrl('edit', ['record' => $this->getRecord()]);
    }
}
