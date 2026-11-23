<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

class Audience extends Model
{
    protected $guarded = ['id'];

    protected $casts = ['published' => 'boolean', 'order' => 'integer'];

    public function scopeVisible(Builder $query): Builder
    {
        return $query->where('published', true)->orderBy('order');
    }
}
