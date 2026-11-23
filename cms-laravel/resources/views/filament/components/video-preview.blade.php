@php
    $embed = null;
    $mp4 = null;
    if (filled($url ?? null)) {
        $parts = parse_url($url) ?: [];
        $host = $parts['host'] ?? '';
        parse_str($parts['query'] ?? '', $q);
        if (str_contains($host, 'youtu.be')) {
            $embed = 'https://www.youtube.com/embed/'.trim($parts['path'] ?? '', '/');
        } elseif (str_contains($host, 'youtube.com')) {
            $embed = isset($q['v']) ? 'https://www.youtube.com/embed/'.$q['v'] : $url;
        } elseif (str_contains($host, 'vimeo.com')) {
            $embed = 'https://player.vimeo.com/video/'.basename($parts['path'] ?? '');
        } elseif (preg_match('/\.(mp4|webm|mov)(\?|$)/i', $url)) {
            $mp4 = $url;
        }
    }
@endphp

@if ($embed)
    <div class="aspect-video overflow-hidden rounded-lg bg-black ring-1 ring-gray-950/10">
        <iframe src="{{ $embed }}" class="h-full w-full" allow="autoplay; encrypted-media" allowfullscreen></iframe>
    </div>
@elseif ($mp4)
    <video src="{{ $mp4 }}" class="aspect-video w-full rounded-lg bg-black" controls muted></video>
@elseif (filled($url ?? null))
    <p class="text-sm text-warning-600">Não reconheci este link como YouTube, Vimeo ou .mp4.</p>
@else
    <div class="flex aspect-video items-center justify-center rounded-lg border-2 border-dashed border-gray-200 text-sm text-gray-400 dark:border-white/10">
        A pré-visualização do vídeo aparece aqui.
    </div>
@endif
