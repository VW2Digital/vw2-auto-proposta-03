<?php

return [
    // Site React (Vite) — usado em links de preview e no link do cliente.
    'frontend_url' => env('FRONTEND_URL', 'http://localhost:5173'),

    // Senha que o cliente digita para abrir a proposta.
    'proposal_password' => env('PROPOSAL_ACCESS_PASSWORD', 'nexo2026'),
];
