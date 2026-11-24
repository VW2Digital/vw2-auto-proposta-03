<?php

use Illuminate\Support\Facades\Route;

$serveSpa = function () {
    $spa = public_path('spa.html');

    if (is_file($spa)) {
        return response()->file($spa, [
            'Content-Type' => 'text/html; charset=UTF-8',
            'Cache-Control' => 'no-cache, must-revalidate',
        ]);
    }

    return response(
        '<h1>Site ainda não compilado</h1><p>Rode <code>npm run build</code> na raiz do projeto para gerar o SPA em <code>cms-laravel/public/spa.html</code>. O painel está disponível em <a href="/admin">/admin</a>.</p>',
        200,
        ['Content-Type' => 'text/html; charset=UTF-8'],
    );
};

Route::get('/', $serveSpa);

// Fallback do React Router (/projetos, /projetos/:slug, /cases, /preview, /proposta/:token)
// sem interceptar rotas do Laravel, Filament, API, uploads ou arquivos estáticos.
Route::get('/{any}', $serveSpa)
    ->where('any', '^(?!admin(?:/|$)|api(?:/|$)|livewire|filament(?:/|$)|storage(?:/|$)|up$|assets(?:/|$)|build(?:/|$)|css(?:/|$)|js(?:/|$)|fonts(?:/|$)|brand(?:/|$)).*$');
