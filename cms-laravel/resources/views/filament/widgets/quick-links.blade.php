<x-filament-widgets::widget>
    <x-filament::section heading="Atalhos" icon="heroicon-o-bolt">
        <div class="grid grid-cols-2 gap-2">
            @foreach ($this->getLinks() as $link)
                <a
                    href="{{ $link['url'] }}"
                    @if ($link['external'] ?? false) target="_blank" rel="noopener" @else wire:navigate @endif
                    class="group flex flex-col gap-2 rounded-lg p-3 ring-1 ring-gray-950/5 transition hover:bg-primary-50 hover:ring-primary-200 dark:ring-white/10 dark:hover:bg-primary-500/10 dark:hover:ring-primary-500/30"
                >
                    <x-filament::icon :icon="$link['icon']" class="h-5 w-5 text-gray-400 transition group-hover:text-primary-600 dark:group-hover:text-primary-400" />
                    <span class="text-sm font-medium text-gray-700 group-hover:text-gray-950 dark:text-gray-300 dark:group-hover:text-white">{{ $link['label'] }}</span>
                </a>
            @endforeach
        </div>
    </x-filament::section>
</x-filament-widgets::widget>
