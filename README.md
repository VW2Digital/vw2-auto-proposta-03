# Nexo Studio — Site + CMS

Landing em React com montagem de proposta pelo cliente, e um CMS próprio em Laravel que gerencia todo o conteúdo do site e o fluxo comercial das propostas.

## Stack

| Camada | Tecnologia | Pasta |
|---|---|---|
| Site | React 19 + Vite + Tailwind 4 | `/` (`src/`) |
| CMS, admin e API | Laravel 13 + Filament 5 | `cms-laravel/` |
| Banco (dev) | SQLite | `cms-laravel/database/database.sqlite` |
| Uploads | Disco `public` do Laravel | `cms-laravel/storage/app/public` |
| Textos-modelo | Markdown | `content/` |

## Estrutura

```
.
├── src/                  # site React (páginas, componentes, cliente da API em src/lib/cms.js)
├── public/               # arquivos estáticos do site
├── content/              # modelos em Markdown para cases, projetos e propostas
└── cms-laravel/
    ├── app/Filament/     # telas do admin (resources, páginas, widgets, campos)
    ├── app/Http/Controllers/Api/   # API pública consumida pelo site
    ├── app/Models/       # Service, Project, CaseStudy, Audience, Testimonial, Proposal, Media, SiteGlobal
    ├── app/Support/      # blocos de página, ícones e URLs de mídia
    └── resources/        # tema do admin (CSS), views e o editor Markdown
```

## Como rodar

Requisitos: PHP 8.3+ (com `pdo_sqlite`, `intl`, `gd`), Composer e Node 20+.

### 1. CMS (primeira vez)

```bash
cd cms-laravel
composer install
npm install && npm run build
cp .env.example .env
php artisan key:generate
touch database/database.sqlite
php artisan migrate
php artisan storage:link
php artisan filament:assets
php artisan db:seed
```

Antes do `db:seed`, preencha `ADMIN_EMAIL` e `ADMIN_PASSWORD` no `cms-laravel/.env`: o seeder cria esse usuário admin. Depois dá para criar outros em **Sistema → Usuários**.

### 2. Site (primeira vez)

Na raiz do projeto:

```bash
npm install
echo "VITE_API_URL=http://localhost:8000" > .env
```

### 3. Dia a dia

Em dois terminais, a partir da raiz:

```bash
npm run dev:cms
```

```bash
npm run dev
```

| Endereço | O quê |
|---|---|
| http://localhost:8000/admin | Admin do CMS |
| http://localhost:5173 | Site |

Depois de mexer no tema do admin (`cms-laravel/resources/css/filament/admin/theme.css`) ou nas views do Filament, rode `npm run build:cms`. Depois de mexer no editor Markdown (`cms-laravel/resources/js/filament/markdown-studio.js`), rode `php artisan filament:assets` dentro de `cms-laravel/`.

## Scripts (raiz)

| Script | O que faz |
|---|---|
| `npm run dev` | Site em modo desenvolvimento (Vite) |
| `npm run dev:cms` | Servidor do Laravel na porta 8000 |
| `npm run build` | Build de produção do site em `dist/` |
| `npm run build:cms` | Build do tema do admin |
| `npm run lint` | Lint do site (oxlint) |

## O admin

Sem header: logo, busca (⌘K) e o menu do usuário ficam na sidebar, que pode ser recolhida para mostrar só os ícones.

| Menu | Uso |
|---|---|
| **Painel** | Propostas novas, em negociação, taxa de aceite, conteúdo no ar, gráfico mensal, atalhos e últimas propostas |
| **Comercial → Propostas** | Lista com abas por status, filtros, troca rápida de status, “Enviar ao cliente”, link do cliente e WhatsApp |
| **Comercial → Quadro** | Kanban: arraste o card entre as colunas para mudar o status |
| **Páginas → Home** | Monta a home com seções prontas e blocos livres (texto, título, imagem, vídeo, botão, link, divisor) |
| **Páginas → Hero / Trust Bar / Vídeo** | Seções fixas da home, com pré-visualização do site |
| **Conteúdo do site** | Serviços, Projetos (page builder + galeria), Cases, Quem ajudamos e Depoimentos, reordenáveis arrastando na lista |
| **Sistema** | Biblioteca de mídia e usuários |

Também tem modo escuro (no menu do usuário) e um editor Markdown com negrito, títulos, listas, cor e tamanho do texto, e visualização lado a lado.

## API (consumida pelo site)

O site lê `VITE_API_URL` (padrão `http://localhost:8000`). As respostas já vêm no formato dos componentes: camelCase, URLs de imagem absolutas e blocos com `blockType`.

| Método | Rota | Uso |
|---|---|---|
| GET | `/api/services` | Serviços ativos |
| GET | `/api/projects` · `?all=1` | Projetos em destaque · todos |
| GET | `/api/projects/{slug}` | Página de um projeto |
| GET | `/api/cases` · `/api/audiences` · `/api/testimonials` | Conteúdo publicado |
| GET | `/api/globals/{hero\|trust-bar\|video-section\|home-page}` | Seções da home |
| POST | `/api/proposals` | Proposta enviada pelo site (limite de 10/min) |
| POST | `/api/public/proposals/{token}` | Cliente abre ou responde a proposta com a senha |

## Fluxo de propostas

1. O cliente monta e envia a proposta no site, e ela chega em **Propostas** com status *Nova*.
2. A equipe formaliza no admin: investimento e blocos de conteúdo na aba **Proposta formal**.
3. **Enviar ao cliente** (ou mudar o status para *Enviada*) gera o link `/proposta/{token}`.
4. O cliente abre o link com a senha `PROPOSAL_ACCESS_PASSWORD` e aceita ou pede negociação.
5. A resposta aparece no admin (aba **Resposta do cliente**) e o status muda sozinho para *Aceita* ou *Em negociação*.

## Variáveis de ambiente

**Site (`.env` na raiz)**

| Variável | Padrão | Uso |
|---|---|---|
| `VITE_API_URL` | `http://localhost:8000` | Endereço do CMS |

**CMS (`cms-laravel/.env`)**, além das padrão do Laravel:

| Variável | Padrão | Uso |
|---|---|---|
| `APP_URL` | `http://localhost:8000` | Base das URLs de imagem que a API devolve |
| `FRONTEND_URL` | `http://localhost:5173` | Links “Ver no site”, pré-visualização e link do cliente |
| `PROPOSAL_ACCESS_PASSWORD` | `nexo2026` | Senha que o cliente digita para abrir a proposta |
| `CORS_ALLOWED_ORIGINS` | `*` | Origens que podem chamar a API (separadas por vírgula) |
| `CMS_DISPLAY_TIMEZONE` | `America/Sao_Paulo` | Fuso exibido no admin (o banco fica em UTC) |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | — | Usuário criado pelo `php artisan db:seed` |

Em produção, defina `APP_ENV=production`, `APP_DEBUG=false`, `CORS_ALLOWED_ORIGINS` com o domínio do site e troque a `PROPOSAL_ACCESS_PASSWORD`.

## Textos-modelo

Modelos em Markdown para cases, projetos e propostas ficam em [`content/`](content/README.md), prontos para colar no editor do admin.
