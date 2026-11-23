<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Project extends Model
{
    protected $guarded = ['id'];

    protected $casts = [
        'tall' => 'boolean',
        'featured' => 'boolean',
        'order' => 'integer',
        'blocks' => 'array',
        'gallery' => 'array',
    ];
}
