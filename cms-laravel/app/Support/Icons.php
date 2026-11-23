<?php

namespace App\Support;

/** Ícones lucide-react que o site sabe renderizar (src/lib/icons.js). */
class Icons
{
    public const SERVICES = [
        'Palette' => 'Paleta',
        'Share2' => 'Compartilhar',
        'Megaphone' => 'Megafone',
        'Layout' => 'Layout',
        'Lightbulb' => 'Lâmpada',
        'Database' => 'Database',
        'Users' => 'Usuários',
        'Clapperboard' => 'Claquete',
        'Bot' => 'Bot',
        'MapPin' => 'Mapa',
        'Compass' => 'Bússola',
        'Rocket' => 'Foguete',
        'Briefcase' => 'Pasta',
        'GraduationCap' => 'Formatura',
        'HeartPulse' => 'Saúde',
    ];

    public const AUDIENCES = [
        'Rocket' => 'Foguete',
        'Briefcase' => 'Pasta',
        'GraduationCap' => 'Formatura',
        'HeartPulse' => 'Saúde',
        'Users' => 'Usuários',
        'Lightbulb' => 'Lâmpada',
    ];

    /** Equivalente aproximado em Heroicons, para mostrar no admin. */
    public const HEROICON = [
        'Palette' => 'heroicon-o-swatch',
        'Share2' => 'heroicon-o-share',
        'Megaphone' => 'heroicon-o-megaphone',
        'Layout' => 'heroicon-o-squares-2x2',
        'Lightbulb' => 'heroicon-o-light-bulb',
        'Database' => 'heroicon-o-circle-stack',
        'Users' => 'heroicon-o-user-group',
        'Clapperboard' => 'heroicon-o-film',
        'Bot' => 'heroicon-o-cpu-chip',
        'MapPin' => 'heroicon-o-map-pin',
        'Compass' => 'heroicon-o-globe-americas',
        'Rocket' => 'heroicon-o-rocket-launch',
        'Briefcase' => 'heroicon-o-briefcase',
        'GraduationCap' => 'heroicon-o-academic-cap',
        'HeartPulse' => 'heroicon-o-heart',
    ];

    /** Opções com o ícone desenhado ao lado do nome. */
    public static function options(array $set): array
    {
        $out = [];
        foreach ($set as $value => $label) {
            $svg = svg(self::HEROICON[$value] ?? 'heroicon-o-question-mark-circle', 'h-4 w-4 shrink-0')->toHtml();
            $out[$value] = '<span class="flex items-center gap-2">'.$svg.'<span>'.e($label).'</span></span>';
        }

        return $out;
    }
}
