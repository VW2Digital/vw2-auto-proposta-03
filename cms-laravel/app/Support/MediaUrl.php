<?php

namespace App\Support;

use Illuminate\Support\Facades\Storage;

class MediaUrl
{
    /** Caminho no disco público (upload) ou URL externa → URL absoluta. */
    public static function from(?string $path): string
    {
        if (! $path) {
            return '';
        }

        if (preg_match('#^(https?:)?//#i', $path)) {
            return $path;
        }

        // Caminho público do site React (ex.: /hero-team.png) fica como está.
        if (str_starts_with($path, '/')) {
            return $path;
        }

        $encoded = implode('/', array_map('rawurlencode', explode('/', $path)));

        return Storage::disk('public')->url($encoded);
    }

    /** Upload tem prioridade sobre a URL digitada. */
    public static function pick(?string $upload, ?string $url): string
    {
        return self::from($upload) ?: self::from($url);
    }
}
