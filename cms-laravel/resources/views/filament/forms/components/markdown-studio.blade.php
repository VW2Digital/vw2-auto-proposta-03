@php
    $statePath = $getStatePath();
    $rows = $getRows();
    $isDisabled = $isDisabled();
@endphp

<x-dynamic-component :component="$getFieldWrapperView()" :field="$field">
    <div
        x-data="markdownStudio({
            state: $wire.$entangle(@js($statePath)),
            color: @js($getDefaultColor()),
        })"
        class="nx-md"
        x-bind:class="{ 'nx-md--split': mode === 'split', 'nx-md--focus': focused }"
        {{ $getExtraAttributeBag() }}
    >
        <div class="nx-md__toolbar" role="toolbar" aria-label="Formatação">
            <div class="nx-md__group">
                <button type="button" class="nx-md__btn font-bold" x-on:click="run('bold')" title="Negrito (⌘B)" @disabled($isDisabled)>B</button>
                <button type="button" class="nx-md__btn italic font-serif text-base" x-on:click="run('italic')" title="Itálico (⌘I)" @disabled($isDisabled)>I</button>
                <button type="button" class="nx-md__btn font-mono text-[11px]" x-on:click="run('code')" title="Código" @disabled($isDisabled)>&lt;/&gt;</button>
                <button type="button" class="nx-md__btn" x-on:click="run('link')" title="Link (⌘K)" @disabled($isDisabled)>
                    <x-filament::icon icon="heroicon-m-link" class="h-4 w-4" />
                </button>
            </div>
            <span class="nx-md__sep"></span>
            <div class="nx-md__group">
                <button type="button" class="nx-md__btn text-xs font-bold" x-on:click="run('h1')" title="Título H1" @disabled($isDisabled)>H1</button>
                <button type="button" class="nx-md__btn text-xs font-bold" x-on:click="run('h2')" title="Título H2" @disabled($isDisabled)>H2</button>
                <button type="button" class="nx-md__btn text-xs font-bold" x-on:click="run('h3')" title="Título H3" @disabled($isDisabled)>H3</button>
            </div>
            <span class="nx-md__sep"></span>
            <div class="nx-md__group">
                <button type="button" class="nx-md__btn" x-on:click="run('list')" title="Lista" @disabled($isDisabled)>
                    <x-filament::icon icon="heroicon-m-list-bullet" class="h-4 w-4" />
                </button>
                <button type="button" class="nx-md__btn font-serif text-lg leading-none" x-on:click="run('quote')" title="Citação" @disabled($isDisabled)>“</button>
            </div>
            <span class="nx-md__sep"></span>
            <div class="nx-md__group">
                <label class="nx-md__color" title="Cor do texto selecionado">
                    <input type="color" x-model="color" x-on:change="applyColor()" @disabled($isDisabled) />
                    <span class="nx-md__swatch" x-bind:style="{ background: color }"></span>
                </label>
                <div class="nx-md__size" title="Tamanho do texto selecionado (px)">
                    <input type="number" min="8" max="200" x-model.number="size" x-on:keydown.enter.prevent="applySize()" @disabled($isDisabled) />
                    <span>px</span>
                    <button type="button" class="nx-md__btn text-xs" x-on:click="applySize()" @disabled($isDisabled)>Aplicar</button>
                </div>
            </div>

            <div class="nx-md__modes">
                <button type="button" x-on:click="mode = 'write'" x-bind:class="{ 'is-active': mode === 'write' }">Escrever</button>
                <button type="button" x-on:click="mode = 'split'" x-bind:class="{ 'is-active': mode === 'split' }">Lado a lado</button>
                <button type="button" x-on:click="mode = 'preview'" x-bind:class="{ 'is-active': mode === 'preview' }">Visualizar</button>
            </div>
        </div>

        <div class="nx-md__panes">
            <textarea
                x-ref="input"
                x-show="mode !== 'preview'"
                x-model="state"
                x-on:focus="focused = true"
                x-on:blur="focused = false"
                x-on:keydown.meta.b.prevent="run('bold')"
                x-on:keydown.ctrl.b.prevent="run('bold')"
                x-on:keydown.meta.i.prevent="run('italic')"
                x-on:keydown.ctrl.i.prevent="run('italic')"
                x-on:keydown.meta.k.prevent="run('link')"
                x-on:keydown.ctrl.k.prevent="run('link')"
                rows="{{ $rows }}"
                id="{{ $getId() }}"
                spellcheck="true"
                class="nx-md__input"
                placeholder="{{ $getPlaceholder() ?? 'Escreva em Markdown…' }}"
                @disabled($isDisabled)
            ></textarea>

            <div
                x-show="mode !== 'write'"
                class="nx-md__preview markdown-preview @if ($hasDarkPreview()) is-dark @endif"
                x-html="preview"
                style="min-height: {{ max(6, $rows) * 1.5 }}rem"
            ></div>
        </div>

        <div class="nx-md__footer">
            <span>Markdown · <b>**negrito**</b> · <i>*itálico*</i> · # título · - lista</span>
            <span x-text="stats"></span>
        </div>
    </div>
</x-dynamic-component>
