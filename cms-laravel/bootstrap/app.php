<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Request;

$app = Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        // Confia nos proxies reversos (Hostinger / LiteSpeed / Cloudflare) para detectar HTTPS corretamente.
        $middleware->trustProxies(at: '*');
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        $exceptions->shouldRenderJsonWhen(
            fn (Request $request) => $request->is('api/*') || $request->expectsJson(),
        );
    })->create();

// Suporte automático à estrutura da Hostinger compartilhada:
// 1) nexo-cms/ ao lado de public_html/ (../public_html)
// 2) nexo-cms/ dentro de public_html/ (..)
if (! is_dir(dirname(__DIR__).'/public')) {
    if (is_dir(dirname(__DIR__).'/../public_html')) {
        $app->usePublicPath(realpath(dirname(__DIR__).'/../public_html') ?: dirname(__DIR__).'/../public_html');
    } elseif (is_file(dirname(__DIR__).'/../index.php') && is_file(dirname(__DIR__).'/../spa.html')) {
        $app->usePublicPath(realpath(dirname(__DIR__).'/..') ?: dirname(__DIR__).'/..');
    }
}

return $app;
