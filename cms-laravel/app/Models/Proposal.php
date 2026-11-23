<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Proposal extends Model
{
    public const STATUSES = [
        'nova' => 'Nova',
        'em_analise' => 'Em análise',
        'enviada' => 'Enviada',
        'aceita' => 'Aceita',
        'negociacao' => 'Em negociação',
        'fechada' => 'Fechada',
    ];

    public const STATUS_COLORS = [
        'nova' => 'info',
        'em_analise' => 'warning',
        'enviada' => 'primary',
        'aceita' => 'success',
        'negociacao' => 'danger',
        'fechada' => 'gray',
    ];

    public const STATUS_ICONS = [
        'nova' => 'heroicon-m-sparkles',
        'em_analise' => 'heroicon-m-magnifying-glass',
        'enviada' => 'heroicon-m-paper-airplane',
        'aceita' => 'heroicon-m-check-badge',
        'negociacao' => 'heroicon-m-chat-bubble-left-right',
        'fechada' => 'heroicon-m-archive-box',
    ];

    /** Status em que o cliente consegue abrir a página da proposta. */
    public const VIEWABLE = ['enviada', 'aceita', 'negociacao', 'fechada'];

    protected $guarded = ['id'];

    protected $casts = [
        'services' => 'array',
        'content_blocks' => 'array',
        'client_responded_at' => 'datetime',
        'sent_at' => 'datetime',
    ];

    protected static function booted(): void
    {
        // Ao virar "enviada", gera o link do cliente.
        static::saving(function (Proposal $proposal) {
            if ($proposal->status === 'enviada' && ! $proposal->access_token) {
                $proposal->access_token = (string) Str::uuid();
                $proposal->sent_at ??= now();
            }
        });
    }

    public function clientUrl(): ?string
    {
        if (! $this->access_token) {
            return null;
        }

        return rtrim(config('cms.frontend_url'), '/').'/proposta/'.$this->access_token;
    }

    public function statusLabel(): string
    {
        return self::STATUSES[$this->status] ?? $this->status;
    }
}
