<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

class Testimonial extends Model
{
    protected $guarded = ['id'];

    protected $casts = ['published' => 'boolean', 'order' => 'integer', 'rating' => 'integer'];

    public function scopeVisible(Builder $query): Builder
    {
        return $query->where('published', true)->orderBy('order');
    }
}
