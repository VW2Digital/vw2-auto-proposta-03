<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/** Conteúdo único por seção do site (Hero, Trust Bar, Vídeo, Home). */
class SiteGlobal extends Model
{
    protected $guarded = ['id'];

    protected $casts = ['data' => 'array'];

    public static function get(string $slug): array
    {
        return static::query()->where('slug', $slug)->first()?->data ?? [];
    }

    public static function put(string $slug, array $data): void
    {
        static::query()->updateOrCreate(['slug' => $slug], ['data' => $data]);
    }
}
