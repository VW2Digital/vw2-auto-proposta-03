<?php

namespace App\Console\Commands;

use App\Models\Audience;
use App\Models\CaseStudy;
use App\Models\Media;
use App\Models\Project;
use App\Models\Proposal;
use App\Models\Service;
use App\Models\SiteGlobal;
use App\Models\Testimonial;
use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Database\Connection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

/**
 * Copia todo o conteúdo do Payload (SQLite + pasta media) para o CMS Laravel.
 * Uso: php artisan cms:import-payload [--db=...] [--media=...] [--fresh]
 */
class ImportPayload extends Command
{
    protected $signature = 'cms:import-payload
        {--db= : Caminho do nexo.db do Payload}
        {--media= : Pasta de uploads do Payload}
        {--fresh : Apaga o conteúdo atual do CMS antes de importar}';

    protected $description = 'Importa conteúdo, imagens e usuários do Payload CMS';

    protected Connection $src;

    /** @var array<int, string> id da mídia no Payload → caminho no disco público */
    protected array $media = [];

    protected const BLOCK_TYPES = ['text', 'heading', 'image', 'video', 'button', 'link', 'divider', 'module'];

    public function handle(): int
    {
        $dbPath = $this->option('db') ?: config('cms.payload_db');
        $mediaPath = $this->option('media') ?: config('cms.payload_media');

        if (! File::exists($dbPath)) {
            $this->error("Banco do Payload não encontrado em {$dbPath}");

            return self::FAILURE;
        }

        config(['database.connections.payload' => [
            'driver' => 'sqlite',
            'database' => $dbPath,
            'foreign_key_constraints' => false,
        ]]);
        $this->src = DB::connection('payload');

        $hasContent = Service::query()->exists() || Project::query()->exists() || Proposal::query()->exists();
        if ($hasContent && ! $this->option('fresh')) {
            $this->warn('O CMS já tem conteúdo. Rode com --fresh para substituir.');

            return self::FAILURE;
        }

        DB::transaction(function () use ($mediaPath) {
            if ($this->option('fresh')) {
                foreach ([Media::class, Service::class, Project::class, CaseStudy::class, Audience::class, Testimonial::class, Proposal::class, SiteGlobal::class] as $model) {
                    $model::query()->delete();
                }
            }

            $this->importMedia($mediaPath);
            $this->importUsers();
            $this->importServices();
            $this->importAudiences();
            $this->importTestimonials();
            $this->importCases();
            $this->importProjects();
            $this->importProposals();
            $this->importGlobals();
        });

        $this->newLine();
        $this->info('Importação concluída.');
        $this->table(['Conteúdo', 'Registros'], [
            ['Mídia', Media::query()->count()],
            ['Usuários', User::query()->count()],
            ['Serviços', Service::query()->count()],
            ['Projetos', Project::query()->count()],
            ['Cases', CaseStudy::query()->count()],
            ['Quem ajudamos', Audience::query()->count()],
            ['Depoimentos', Testimonial::query()->count()],
            ['Propostas', Proposal::query()->count()],
            ['Páginas (globals)', SiteGlobal::query()->count()],
        ]);

        return self::SUCCESS;
    }

    protected function importMedia(string $mediaPath): void
    {
        $disk = Storage::disk('public');

        foreach ($this->rows('media') as $row) {
            $source = rtrim($mediaPath, '/').'/'.$row->filename;
            $target = 'media/'.$row->filename;

            if (File::exists($source)) {
                $disk->put($target, File::get($source));
            } else {
                $this->warn("Arquivo não encontrado: {$row->filename}");
            }

            Media::query()->create([
                'path' => $target,
                'filename' => $row->filename,
                'alt' => $row->alt,
                'mime_type' => $row->mime_type,
                'size' => $row->filesize,
                'width' => $row->width,
                'height' => $row->height,
            ]);

            $this->media[(int) $row->id] = $target;
        }

        $this->line('• mídia: '.count($this->media));
    }

    protected function importUsers(): void
    {
        foreach ($this->rows('users') as $row) {
            User::query()->updateOrCreate(['email' => $row->email], [
                'name' => $row->name ?: Str::before($row->email, '@'),
                'legacy_salt' => $row->salt,
                'legacy_hash' => $row->hash,
            ]);
        }
        $this->line('• usuários (mantêm a senha do Payload)');
    }

    protected function importServices(): void
    {
        foreach ($this->rows('services') as $r) {
            Service::query()->create([
                'slug' => $r->slug, 'title' => $r->title, 'description' => $r->description,
                'icon' => $r->icon, 'active' => (bool) $r->active, 'order' => (int) $r->order,
                'created_at' => $r->created_at, 'updated_at' => $r->updated_at,
            ]);
        }
        $this->line('• serviços');
    }

    protected function importAudiences(): void
    {
        foreach ($this->rows('audiences') as $r) {
            Audience::query()->create([
                'title' => $r->title, 'description' => $r->description, 'icon' => $r->icon,
                'published' => (bool) $r->published, 'order' => (int) $r->order,
                'created_at' => $r->created_at, 'updated_at' => $r->updated_at,
            ]);
        }
        $this->line('• quem ajudamos');
    }

    protected function importTestimonials(): void
    {
        foreach ($this->rows('testimonials') as $r) {
            Testimonial::query()->create([
                'name' => $r->name, 'role' => $r->role, 'quote' => $r->quote, 'rating' => (int) ($r->rating ?: 5),
                'published' => (bool) $r->published, 'order' => (int) $r->order,
                'created_at' => $r->created_at, 'updated_at' => $r->updated_at,
            ]);
        }
        $this->line('• depoimentos');
    }

    protected function importCases(): void
    {
        foreach ($this->rows('cases') as $r) {
            CaseStudy::query()->create([
                'client' => $r->client, 'sector' => $r->sector, 'result' => $r->result,
                'result_label' => $r->result_label, 'description' => $r->description, 'body' => $r->body,
                'image_url' => $r->image_url ?? null,
                'image' => $this->mediaPath($r->image_id ?? null),
                'metrics' => $this->children('cases_metrics', $r->id, ['label', 'value']),
                'published' => (bool) $r->published, 'order' => (int) $r->order,
                'created_at' => $r->created_at, 'updated_at' => $r->updated_at,
            ]);
        }
        $this->line('• cases');
    }

    protected function importProjects(): void
    {
        foreach ($this->rows('projects') as $r) {
            $blocks = $this->blocks(['projects_blocks'], $r->id, 'blocks');

            // Texto antigo em Markdown (antes do page builder) vira um bloco de texto.
            if (! $blocks && filled($r->body ?? null)) {
                $blocks = [['type' => 'text', 'data' => ['content' => $r->body]]];
            }

            Project::query()->create([
                'name' => $r->name, 'slug' => $r->slug, 'category' => $r->category,
                'client' => $r->client, 'year' => $r->year, 'description' => $r->description,
                'image_url' => $r->image_url, 'image' => $this->mediaPath($r->image_id),
                'blocks' => $blocks,
                'gallery' => array_map(fn ($g) => [
                    'image' => $this->mediaPath($g->image_id),
                    'imageUrl' => $g->image_url,
                    'caption' => $g->caption,
                    'wide' => (bool) $g->wide,
                ], $this->childRows('projects_gallery', $r->id)),
                'tall' => (bool) $r->tall, 'featured' => (bool) $r->featured, 'order' => (int) $r->order,
                'created_at' => $r->created_at, 'updated_at' => $r->updated_at,
            ]);
        }
        $this->line('• projetos');
    }

    protected function importProposals(): void
    {
        foreach ($this->rows('proposals') as $r) {
            $blocks = $this->blocks(['proposals_content_blocks', 'proposals_blocks'], $r->id, 'contentBlocks');
            if (! $blocks && filled($r->formal_message ?? null)) {
                $blocks = [['type' => 'text', 'data' => ['content' => $r->formal_message]]];
            }

            $proposal = new Proposal([
                'full_name' => $r->full_name, 'email' => $r->email, 'whatsapp' => $r->whatsapp,
                'company' => $r->company, 'website' => $r->website, 'message' => $r->message,
                'services' => $this->children('proposals_services', $r->id, ['service_id' => 'serviceId', 'title', 'notes']),
                'formal_price' => $r->formal_price, 'content_blocks' => $blocks, 'formal_notes' => $r->formal_notes,
                'client_response' => $r->client_response, 'negotiate_message' => $r->negotiate_message,
                'client_responded_at' => $r->client_responded_at, 'status' => $r->status,
                'sent_at' => $r->sent_at, 'access_token' => $r->access_token,
            ]);
            $proposal->created_at = $r->created_at;
            $proposal->updated_at = $r->updated_at;
            $proposal->save();
        }
        $this->line('• propostas (links dos clientes preservados)');
    }

    protected function importGlobals(): void
    {
        if ($hero = $this->src->table('hero')->first()) {
            $title = $hero->title ?? null;
            if (blank($title) && ($hero->headline_serif || $hero->headline_bold)) {
                $title = trim("*{$hero->headline_serif}*\n\n**{$hero->headline_bold}**");
            }

            SiteGlobal::put('hero', [
                'media' => [
                    'image' => $this->mediaPath($hero->media_image_id),
                    'image_url' => $hero->media_image_url,
                    'height' => (int) ($hero->media_height ?: 85),
                    'objectPosition' => $hero->media_object_position ?: 'center',
                ],
                'tags' => array_column($this->children('hero_tags', $hero->id, ['label']), 'label'),
                'title' => $title,
                'subtitle' => $hero->subtitle,
                'ctaLabel' => $hero->cta_label,
                'ctaLink' => $hero->cta_link ?: $hero->cta_target ?: '#proposta',
            ]);
        }

        if ($trust = $this->src->table('trust_bar')->first()) {
            $text = $trust->text ?? null;
            if (blank($text)) {
                $text = trim("{$trust->line1_prefix} **{$trust->line1_stat}** {$trust->line1_suffix}\n{$trust->line2_prefix} **{$trust->line2_stat}** {$trust->line2_suffix}");
            }

            SiteGlobal::put('trust-bar', [
                'text' => $text,
                'logos' => array_map(fn ($l) => [
                    'name' => $l->name,
                    'image' => $this->mediaPath($l->image_id ?? null),
                    'imageUrl' => $l->image_url ?? null,
                ], $this->childRows('trust_bar_logos', $trust->id)),
            ]);
        }

        if ($video = $this->src->table('video_section')->first()) {
            SiteGlobal::put('video-section', ['videoUrl' => $video->video_url]);
        }

        if ($home = $this->src->table('home_page')->first()) {
            SiteGlobal::put('home-page', ['blocks' => $this->blocks(['home_page_blocks'], $home->id, 'blocks')]);
        }

        $this->line('• hero, trust bar, vídeo e home');
    }

    /* ----------------------------- helpers ----------------------------- */

    protected function rows(string $table): array
    {
        return $this->hasTable($table) ? $this->src->table($table)->orderBy('id')->get()->all() : [];
    }

    protected function childRows(string $table, int $parentId): array
    {
        if (! $this->hasTable($table)) {
            return [];
        }

        return $this->src->table($table)->where('_parent_id', $parentId)->orderBy('_order')->get()->all();
    }

    /** Linhas filhas → arrays com colunas renomeadas (['coluna' => 'chave'] ou ['coluna']). */
    protected function children(string $table, int $parentId, array $columns): array
    {
        return array_map(function ($row) use ($columns) {
            $out = [];
            foreach ($columns as $from => $to) {
                $from = is_int($from) ? $to : $from;
                $out[$to] = $row->{$from} ?? null;
            }

            return $out;
        }, $this->childRows($table, $parentId));
    }

    /** Junta as tabelas de blocos do Payload ({prefixo}_{tipo}) no formato do Builder. */
    protected function blocks(array $prefixes, int $parentId, string $path): array
    {
        $found = [];

        foreach ($prefixes as $prefix) {
            foreach (self::BLOCK_TYPES as $type) {
                $table = "{$prefix}_{$type}";
                if (! $this->hasTable($table)) {
                    continue;
                }

                $rows = $this->src->table($table)->where('_parent_id', $parentId)->where('_path', $path)->get();
                foreach ($rows as $row) {
                    $data = [];
                    foreach ((array) $row as $col => $value) {
                        if (in_array($col, ['_order', '_parent_id', '_path', 'id', 'block_name'], true)) {
                            continue;
                        }
                        if ($col === 'image_id') {
                            $data['image'] = $this->mediaPath($value);

                            continue;
                        }
                        $data[Str::camel($col)] = in_array($col, ['wide'], true) ? (bool) $value : $value;
                    }
                    $found[$row->id] = ['order' => (int) $row->_order, 'type' => $type, 'data' => $data];
                }
            }
        }

        usort($found, fn ($a, $b) => $a['order'] <=> $b['order']);

        return array_map(fn ($b) => ['type' => $b['type'], 'data' => $b['data']], array_values($found));
    }

    protected function mediaPath(mixed $id): ?string
    {
        return $id ? ($this->media[(int) $id] ?? null) : null;
    }

    protected function hasTable(string $table): bool
    {
        static $tables;
        $tables ??= collect($this->src->select("select name from sqlite_master where type = 'table'"))->pluck('name')->all();

        return in_array($table, $tables, true);
    }
}
