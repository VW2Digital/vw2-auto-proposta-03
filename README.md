# Nexo Studio — Site + CMS Laravel

Landing React + plataforma de propostas. Todo o conteúdo é gerido no **Nexo CMS** (Laravel + Filament).

## Stack

| Camada | Tecnologia |
|---|---|
| Site | React + Vite + Tailwind (`/`) |
| CMS / Admin / API | Laravel 13 + Filament 5 (`cms-laravel/`) |
| Banco (dev) | SQLite (`cms-laravel/database/database.sqlite`) |
| Textos-modelo | Markdown em `content/` |

## Como rodar

Requisitos: PHP 8.3+, Composer, Node 20+.

### CMS (primeira vez)
```bash
cd cms-laravel
composer install
npm install && npm run build
cp .env.example .env   # ajuste ADMIN_EMAIL / ADMIN_PASSWORD
php artisan key:generate
php artisan migrate
php artisan storage:link
php artisan filament:assets
php artisan db:seed      # cria o usuário admin (ADMIN_EMAIL / ADMIN_PASSWORD)
```

### Dia a dia
```bash
npm run dev:cms   # → http://localhost:8000/admin
npm run dev       # → http://localhost:5173
```

## O que tem no admin

| Menu | Uso |
|---|---|
| **Painel** | Indicadores de propostas, gráfico mensal, atalhos e últimas propostas |
| **Comercial → Propostas** | Lista com abas por status, filtros, ações rápidas, “Enviar ao cliente”, WhatsApp |
| **Comercial → Quadro** | Kanban: arraste o card entre colunas para mudar o status |
| **Páginas → Home** | Monta a home com seções prontas + blocos livres (texto, imagem, vídeo, botão, link) |
| **Páginas → Hero / Trust Bar / Vídeo** | Seções fixas da home, com pré-visualização do site |
| **Conteúdo do site** | Serviços, Projetos (page builder + galeria), Cases, Quem ajudamos, Depoimentos — reordenáveis por arrastar |
| **Sistema** | Biblioteca de mídia e usuários |

Extras: busca global (⌘K), modo escuro, editor Markdown com cor/tamanho e visualização lado a lado.

## API (consumida pelo site)

`VITE_API_URL=http://localhost:8000`

| Método | Rota |
|---|---|
| GET | `/api/services`, `/api/projects?all=1`, `/api/projects/{slug}`, `/api/cases`, `/api/audiences`, `/api/testimonials` |
| GET | `/api/globals/{hero\|trust-bar\|video-section\|home-page}` |
| POST | `/api/proposals` — proposta enviada pelo site |
| POST | `/api/public/proposals/{token}` — cliente abre/responde com a senha |

## Textos-modelo

Modelos em Markdown para cases, projetos e propostas ficam em [`content/`](content/README.md).

## Fluxo de propostas

1. Cliente monta e envia no site → chega em **Propostas** (status Nova)
2. Equipe formaliza no admin (preço + blocos de conteúdo)
3. **Enviar ao cliente** (ou status Enviada) gera o link
4. Cliente acessa `/proposta/{token}` com a senha (`PROPOSAL_ACCESS_PASSWORD`)
5. Aceite / negociação volta para o admin
