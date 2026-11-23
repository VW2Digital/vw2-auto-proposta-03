<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

class Service extends Model
{
    protected $guarded = ['id'];

    protected $casts = ['active' => 'boolean', 'order' => 'integer'];

    public function scopeVisible(Builder $query): Builder
    {
        return $query->where('active', true)->orderBy('order');
    }
}
