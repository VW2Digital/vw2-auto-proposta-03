<?php

namespace App\Support;

/** Converte os blocos salvos pelo Builder do admin no formato que o site lê. */
class PageBlocks
{
    public const HOME_MODULES = [
        'trustBar' => 'Trust Bar',
        'video' => 'Vídeo',
        'whoWeHelp' => 'Quem ajudamos',
        'selectedProjects' => 'Projetos em destaque',
        'services' => 'Serviços',
        'cases' => 'Cases',
        'howItWorks' => 'Como funciona',
        'proposal' => 'Montar proposta',
        'testimonials' => 'Depoimentos',
        'finalCta' => 'CTA final',
    ];

    public static function toApi(?array $blocks): array
    {
        $out = [];

        foreach (array_values($blocks ?? []) as $index => $block) {
            $type = $block['type'] ?? null;
            $data = $block['data'] ?? [];
            if (! $type) {
                continue;
            }

            $item = ['id' => $data['_id'] ?? "{$type}-{$index}", 'blockType' => $type];

            $out[] = $item + match ($type) {
                'text' => ['content' => $data['content'] ?? ''],
                'heading' => ['text' => $data['text'] ?? '', 'level' => $data['level'] ?? 'h2'],
                'image' => (function () use ($data) {
                    $url = MediaUrl::pick($data['image'] ?? null, $data['imageUrl'] ?? null);

                    return [
                        'image' => $url,
                        'imageUrl' => $url,
                        'alt' => $data['alt'] ?? '',
                        'caption' => $data['caption'] ?? '',
                        'wide' => (bool) ($data['wide'] ?? false),
                    ];
                })(),
                'video' => ['videoUrl' => $data['videoUrl'] ?? '', 'caption' => $data['caption'] ?? ''],
                'button' => [
                    'label' => $data['label'] ?? '',
                    'url' => $data['url'] ?? '#',
                    'style' => $data['style'] ?? 'primary',
                ],
                'link' => ['label' => $data['label'] ?? '', 'url' => $data['url'] ?? '#'],
                'divider' => [],
                'module' => ['module' => $data['module'] ?? null],
                default => $data,
            };
        }

        return $out;
    }
}
