<?php

use App\Http\Controllers\Api\ContentController;
use App\Http\Controllers\Api\ProposalController;
use Illuminate\Support\Facades\Route;

// Conteúdo público do site (React).
Route::get('services', [ContentController::class, 'services']);
Route::get('projects', [ContentController::class, 'projects']);
Route::get('projects/{slug}', [ContentController::class, 'project']);
Route::get('cases', [ContentController::class, 'cases']);
Route::get('audiences', [ContentController::class, 'audiences']);
Route::get('testimonials', [ContentController::class, 'testimonials']);
Route::get('globals/{slug}', [ContentController::class, 'global'])
    ->whereIn('slug', ['hero', 'trust-bar', 'video-section', 'home-page']);

// Propostas: o site cria, o cliente abre/responde pelo link com senha.
Route::post('proposals', [ProposalController::class, 'store'])->middleware('throttle:10,1');
Route::post('public/proposals/{token}', [ProposalController::class, 'client'])->middleware('throttle:30,1');
