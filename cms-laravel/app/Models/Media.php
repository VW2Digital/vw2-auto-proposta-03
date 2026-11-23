<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class Media extends Model
{
    protected $table = 'media';

    protected $guarded = ['id'];

    protected static function booted(): void
    {
        static::saving(function (Media $media) {
            if (! $media->path || ! $media->isDirty('path')) {
                return;
            }

            $disk = Storage::disk('public');
            if (! $disk->exists($media->path)) {
                return;
            }

            $media->filename ??= basename($media->path);
            $media->mime_type = $disk->mimeType($media->path) ?: null;
            $media->size = $disk->size($media->path);

            $info = @getimagesize($disk->path($media->path));
            $media->width = $info[0] ?? null;
            $media->height = $info[1] ?? null;
        });

        static::deleted(function (Media $media) {
            Storage::disk('public')->delete($media->path);
        });
    }

    public function getUrlAttribute(): string
    {
        return Storage::disk('public')->url($this->path);
    }

    public function isImage(): bool
    {
        return str_starts_with((string) $this->mime_type, 'image/');
    }
}
