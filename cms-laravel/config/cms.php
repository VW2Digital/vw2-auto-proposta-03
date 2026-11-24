<?php

return [
    // Site React (Vite) — usado em links de preview e no link do cliente.
    'frontend_url' => env('FRONTEND_URL', 'http://localhost:5173'),

    // Senha que o cliente digita para abrir a proposta.
    'proposal_password' => env('PROPOSAL_ACCESS_PASSWORD', 'nexo2026'),

    // Fuso exibido no painel admin (banco permanece em UTC).
    'display_timezone' => env('CMS_DISPLAY_TIMEZONE', 'America/Sao_Paulo'),

    // Credenciais do admin inicial criadas pelo DatabaseSeeder.
    'admin_email' => env('ADMIN_EMAIL'),
    'admin_password' => env('ADMIN_PASSWORD'),
];
