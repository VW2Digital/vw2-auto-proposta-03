<?php

return [
    // Site React (Vite) — usado em links de preview e no link do cliente.
    'frontend_url' => env('FRONTEND_URL', 'http://localhost:5173'),

    // Senha que o cliente digita para abrir a proposta.
    'proposal_password' => env('PROPOSAL_ACCESS_PASSWORD', 'nexo2026'),

    // Banco do Payload para o comando cms:import-payload.
    'payload_db' => env('PAYLOAD_DB_PATH', base_path('../cms/data/nexo.db')),
    'payload_media' => env('PAYLOAD_MEDIA_PATH', base_path('../cms/media')),
];
