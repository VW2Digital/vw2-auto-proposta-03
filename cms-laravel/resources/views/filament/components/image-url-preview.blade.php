@if (filled($url ?? null))
    <div class="overflow-hidden rounded-lg ring-1 ring-gray-950/10 dark:ring-white/10">
        <img src="{{ $url }}" alt="" class="max-h-48 w-full bg-gray-50 object-contain dark:bg-white/5" loading="lazy" />
    </div>
@endif
