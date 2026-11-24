<?php

return [
    // URL pública do site React — no modo domínio único usa o próprio APP_URL.
    'frontend_url' => env('FRONTEND_URL') ?: env('APP_URL', 'http://localhost:8000'),

    // Senha que o cliente digita para abrir a proposta.
    'proposal_password' => env('PROPOSAL_ACCESS_PASSWORD', 'nexo2026'),

    // Fuso exibido no painel admin (banco permanece em UTC).
    'display_timezone' => env('CMS_DISPLAY_TIMEZONE', 'America/Sao_Paulo'),

    // Credenciais do admin inicial criadas pelo DatabaseSeeder.
    'admin_email' => env('ADMIN_EMAIL'),
    'admin_password' => env('ADMIN_PASSWORD'),
];
