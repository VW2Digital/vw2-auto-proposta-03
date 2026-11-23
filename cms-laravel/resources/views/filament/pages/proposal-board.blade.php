@php
    use App\Models\Proposal;
    $columns = $this->getColumns();
@endphp

<x-filament-panels::page>
    <div class="flex flex-wrap items-center gap-3">
        <div class="w-full max-w-xs">
            <x-filament::input.wrapper prefix-icon="heroicon-m-magnifying-glass">
                <x-filament::input type="search" wire:model.live.debounce.300ms="search" placeholder="Buscar empresa ou contato…" />
            </x-filament::input.wrapper>
        </div>
        <span class="text-sm text-gray-500" wire:loading.remove>
            {{ collect($columns)->flatten()->count() }} propostas
        </span>
        <x-filament::loading-indicator class="h-5 w-5 text-gray-400" wire:loading />
    </div>

    <div
        class="nx-board"
        x-data="{
            dragging: null,
            over: null,
            drop(status) {
                const id = this.dragging
                this.dragging = null
                this.over = null
                if (id) $wire.moveProposal(id, status)
            },
        }"
    >
        @foreach ($columns as $status => $items)
            <section
                class="nx-col"
                x-bind:class="{ 'is-over': over === @js($status) }"
                x-on:dragover.prevent="over = @js($status)"
                x-on:dragleave.self="over = null"
                x-on:drop.prevent="drop(@js($status))"
                wire:key="col-{{ $status }}"
            >
                <header class="flex items-center justify-between gap-2 px-3 pb-2 pt-3">
                    <div class="flex items-center gap-2">
                        <x-filament::badge :color="Proposal::STATUS_COLORS[$status]" :icon="Proposal::STATUS_ICONS[$status]" size="sm">
                            {{ Proposal::STATUSES[$status] }}
                        </x-filament::badge>
                    </div>
                    <span class="rounded-full bg-white px-2 py-0.5 text-xs font-semibold text-gray-600 ring-1 ring-gray-950/5 dark:bg-white/10 dark:text-gray-300 dark:ring-white/10">
                        {{ $items->count() }}
                    </span>
                </header>

                <div class="flex min-h-40 flex-1 flex-col gap-2 px-2 pb-3">
                    @forelse ($items as $proposal)
                        <article
                            class="nx-card"
                            draggable="true"
                            wire:key="card-{{ $proposal->id }}"
                            x-on:dragstart="dragging = {{ $proposal->id }}; $event.dataTransfer.effectAllowed = 'move'"
                            x-on:dragend="dragging = null; over = null"
                            x-bind:class="{ 'is-dragging': dragging === {{ $proposal->id }} }"
                        >
                            <a href="{{ $this->editUrl($proposal) }}" wire:navigate class="block">
                                <div class="flex items-start justify-between gap-2">
                                    <h3 class="text-sm font-semibold text-gray-950 dark:text-white">{{ $proposal->company }}</h3>
                                    @if ($proposal->client_response)
                                        <x-filament::icon
                                            :icon="$proposal->client_response === 'accept' ? 'heroicon-s-check-circle' : 'heroicon-s-chat-bubble-left-ellipsis'"
                                            @class(['h-4 w-4 shrink-0', 'text-success-500' => $proposal->client_response === 'accept', 'text-danger-500' => $proposal->client_response !== 'accept'])
                                        />
                                    @endif
                                </div>
                                <p class="mt-0.5 text-xs text-gray-500">{{ $proposal->full_name }}</p>

                                @if (filled($proposal->services))
                                    <div class="mt-2 flex flex-wrap gap-1">
                                        @foreach (collect($proposal->services)->take(3) as $service)
                                            <span class="rounded-md bg-gray-100 px-1.5 py-0.5 text-[11px] font-medium text-gray-600 dark:bg-white/10 dark:text-gray-300">
                                                {{ $service['title'] ?? $service['serviceId'] ?? '' }}
                                            </span>
                                        @endforeach
                                        @if (count($proposal->services) > 3)
                                            <span class="px-1 py-0.5 text-[11px] text-gray-400">+{{ count($proposal->services) - 3 }}</span>
                                        @endif
                                    </div>
                                @endif

                                <div class="mt-3 flex items-center justify-between text-[11px] text-gray-400">
                                    <span>{{ $proposal->created_at?->diffForHumans() }}</span>
                                    @if ($proposal->formal_price)
                                        <span class="font-semibold text-gray-700 dark:text-gray-200">{{ $proposal->formal_price }}</span>
                                    @endif
                                </div>
                            </a>
                        </article>
                    @empty
                        <div class="flex flex-1 items-center justify-center rounded-lg border-2 border-dashed border-gray-200 p-4 text-center text-xs text-gray-400 dark:border-white/10">
                            Solte um card aqui
                        </div>
                    @endforelse
                </div>
            </section>
        @endforeach
    </div>
</x-filament-panels::page>
