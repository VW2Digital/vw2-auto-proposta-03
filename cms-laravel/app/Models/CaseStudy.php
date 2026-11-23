<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

class CaseStudy extends Model
{
    protected $table = 'case_studies';

    protected $guarded = ['id'];

    protected $casts = [
        'published' => 'boolean',
        'order' => 'integer',
        'metrics' => 'array',
    ];

    public function scopeVisible(Builder $query): Builder
    {
        return $query->where('published', true)->orderBy('order');
    }
}
