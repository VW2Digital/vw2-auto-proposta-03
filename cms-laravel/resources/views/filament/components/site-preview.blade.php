<div x-data="{ src: @js($url), key: 0 }" class="flex h-[78vh] flex-col gap-3">
    <div class="flex items-center gap-2">
        <div class="flex min-w-0 flex-1 items-center gap-2 rounded-lg bg-gray-50 px-3 py-2 text-xs text-gray-500 ring-1 ring-gray-950/5 dark:bg-white/5 dark:ring-white/10">
            <x-filament::icon icon="heroicon-m-lock-closed" class="h-3.5 w-3.5 shrink-0" />
            <span class="truncate" x-text="src"></span>
        </div>
        <x-filament::button size="sm" color="gray" icon="heroicon-m-arrow-path" x-on:click="key++">Atualizar</x-filament::button>
        <x-filament::button size="sm" color="gray" icon="heroicon-m-arrow-top-right-on-square" tag="a" :href="$url" target="_blank">Abrir</x-filament::button>
    </div>
    <template x-for="k in [key]" :key="k">
        <iframe :src="src + (src.includes('?') ? '&' : '?') + '_refresh=' + Date.now()" class="w-full flex-1 rounded-lg bg-white ring-1 ring-gray-950/10 dark:ring-white/10"></iframe>
    </template>
</div>
