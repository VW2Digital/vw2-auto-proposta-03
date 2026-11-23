<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Audience;
use App\Models\CaseStudy;
use App\Models\Project;
use App\Models\Service;
use App\Models\SiteGlobal;
use App\Models\Testimonial;
use App\Support\MediaUrl;
use App\Support\PageBlocks;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/** Entrega o conteúdo já no formato dos componentes do site (camelCase, URLs absolutas). */
class ContentController extends Controller
{
    public function services(): JsonResponse
    {
        return $this->ok(Service::query()->visible()->get()->map(fn (Service $s) => [
            'id' => $s->slug,
            'title' => $s->title,
            'description' => $s->description,
            'icon' => $s->icon,
        ]));
    }

    public function projects(Request $request): JsonResponse
    {
        $projects = Project::query()
            ->when(! $request->boolean('all'), fn ($q) => $q->where('featured', true))
            ->orderBy('order')
            ->get();

        return $this->ok($projects->map(fn (Project $p) => $this->project_($p)));
    }

    public function project(string $slug): JsonResponse
    {
        $project = Project::query()->where('slug', $slug)->first();

        return $project
            ? $this->ok($this->project_($project))
            : response()->json(['error' => 'Projeto não encontrado'], 404);
    }

    public function cases(): JsonResponse
    {
        return $this->ok(CaseStudy::query()->visible()->get()->map(fn (CaseStudy $c) => [
            'id' => $c->id,
            'client' => $c->client,
            'sector' => $c->sector,
            'result' => $c->result,
            'resultLabel' => $c->result_label,
            'description' => $c->description,
            'body' => $c->body ?? '',
            'image' => MediaUrl::pick($c->image, $c->image_url),
            'metrics' => array_values(array_filter($c->metrics ?? [], fn ($m) => filled($m['label'] ?? null))),
        ]));
    }

    public function audiences(): JsonResponse
    {
        return $this->ok(Audience::query()->visible()->get()->map(fn (Audience $a) => [
            'id' => $a->id,
            'title' => $a->title,
            'description' => $a->description,
            'icon' => $a->icon,
        ]));
    }

    public function testimonials(): JsonResponse
    {
        return $this->ok(Testimonial::query()->visible()->get()->map(fn (Testimonial $t) => [
            'id' => $t->id,
            'name' => $t->name,
            'role' => $t->role,
            'quote' => $t->quote,
            'rating' => $t->rating ?: 5,
        ]));
    }

    public function global(string $slug): JsonResponse
    {
        $data = SiteGlobal::get($slug);

        return $this->ok(match ($slug) {
            'hero' => [
                'tags' => array_values(array_filter(array_map(
                    fn ($t) => is_array($t) ? ($t['label'] ?? null) : $t,
                    $data['tags'] ?? [],
                ))),
                'title' => $data['title'] ?? '',
                'subtitle' => $data['subtitle'] ?? '',
                'ctaLabel' => $data['ctaLabel'] ?? '',
                'ctaLink' => $data['ctaLink'] ?? '#proposta',
                'image' => MediaUrl::pick($data['media']['image'] ?? null, $data['media']['image_url'] ?? null),
                'height' => (int) ($data['media']['height'] ?? 85),
                'objectPosition' => $data['media']['objectPosition'] ?? 'center',
            ],
            'trust-bar' => [
                'text' => $data['text'] ?? '',
                'logos' => collect($data['logos'] ?? [])
                    ->map(fn ($l) => [
                        'name' => $l['name'] ?? '',
                        'image' => MediaUrl::pick($l['image'] ?? null, $l['imageUrl'] ?? null),
                    ])
                    ->filter(fn ($l) => $l['name'] || $l['image'])
                    ->values(),
            ],
            'video-section' => ['videoUrl' => $data['videoUrl'] ?? ''],
            'home-page' => ['blocks' => PageBlocks::toApi($data['blocks'] ?? [])],
        });
    }

    protected function project_(Project $p): array
    {
        return [
            'id' => $p->id,
            'name' => $p->name,
            'slug' => $p->slug,
            'category' => $p->category,
            'client' => $p->client ?? '',
            'year' => $p->year ?? '',
            'tall' => $p->tall,
            'featured' => $p->featured,
            'image' => MediaUrl::pick($p->image, $p->image_url),
            'description' => $p->description ?? '',
            'blocks' => PageBlocks::toApi($p->blocks),
            'gallery' => collect($p->gallery ?? [])
                ->map(fn ($g) => [
                    'image' => MediaUrl::pick($g['image'] ?? null, $g['imageUrl'] ?? null),
                    'caption' => $g['caption'] ?? '',
                    'wide' => (bool) ($g['wide'] ?? false),
                ])
                ->filter(fn ($g) => $g['image'])
                ->values(),
        ];
    }

    protected function ok(mixed $data): JsonResponse
    {
        return response()->json(['data' => $data]);
    }
}
