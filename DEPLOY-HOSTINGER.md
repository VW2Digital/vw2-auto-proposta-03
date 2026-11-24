# Deploy na Hospedagem Compartilhada Hostinger (Domínio Único + MySQL / phpMyAdmin)

Nesta arquitetura (**Opção 1 — Domínio Único Unificado**), site React, API e painel admin rodam no **mesmo domínio**:

- `https://vw2digital.com.br/` · `/projetos` · `/cases` · `/proposta/{token}` → **Site React**
- `https://vw2digital.com.br/admin` → **Painel Filament**
- `https://vw2digital.com.br/api/*` → **API JSON (mesma origem, sem CORS)**
- `https://vw2digital.com.br/storage/*` → **Uploads de mídia**

E o código Laravel + `.env` ficam **fora do `public_html/`** por segurança:

```text
domains/vw2digital.com.br/
├── nexo-cms/        # Laravel (app, config, vendor, storage, .env) — privado
└── public_html/     # index.php, .htaccess, spa.html, assets/, build/, js/, css/, storage -> symlink
```

---

## 1. Preparar o banco MySQL na Hostinger (hPanel + phpMyAdmin)

1. No **hPanel → Bancos de Dados → Gerenciamento**, crie um novo banco MySQL e anote:
   - **Nome do banco** (`DB_DATABASE`, ex.: `u123456789_nexo`)
   - **Usuário** (`DB_USERNAME`, ex.: `u123456789_nexo_user`)
   - **Senha** (`DB_PASSWORD`)
2. Em **hPanel → Avançado → Configuração do PHP**, selecione **PHP 8.3** ou **PHP 8.4** e confirme as extensões `pdo_mysql`, `intl`, `gd`, `mbstring`, `zip` e `fileinfo`.
3. **(Opcional — via phpMyAdmin sem SSH para criar tabelas):**
   - Clique em **Entrar no phpMyAdmin** no banco criado.
   - Vá na aba **Importar**, selecione o arquivo `cms-laravel/database/schema-mysql-hostinger.sql` e clique em **Executar**.
   - Todas as tabelas (`users`, `sessions`, `cache`, `jobs`, `services`, `projects`, `case_studies`, `audiences`, `testimonials`, `proposals`, `media`, `site_globals`, `migrations`) serão criadas em `InnoDB / utf8mb4_unicode_ci`.

---

## 2. Gerar o pacote pronto para upload (`release-hostinger/`)

No seu computador, a partir da raiz do projeto:

```bash
# 1. Compila o tema do Filament (se ainda não estiver compilado em cms-laravel/public/build)
docker compose run --rm cms npm run build

# 2. Compila o site React, sincroniza no Laravel e gera a pasta release-hostinger/
npm run build:hostinger
```

Isso cria a pasta `release-hostinger/` pronta para a Hostinger:
- `release-hostinger/nexo-cms/` (sem `database.sqlite`, sem caches locais, sem `public/`)
- `release-hostinger/public_html/` (com `index.php` já configurado para `../nexo-cms/`, `.htaccess` com HTTPS, `spa.html`, `assets/` do React e `build/` + `js/` + `css/` do Filament)

---

## 3. Subir os arquivos para a Hostinger

Via **Gerenciador de Arquivos do hPanel** (compactando cada pasta em `.zip`) ou via **SFTP**:

1. Suba a pasta `release-hostinger/nexo-cms` para:
   `domains/vw2digital.com.br/nexo-cms`
2. Suba **o conteúdo** de `release-hostinger/public_html/` (incluindo o arquivo oculto `.htaccess`) para:
   `domains/vw2digital.com.br/public_html/`

---

## 4. Preencher as credenciais no `.env`

Dentro de `domains/vw2digital.com.br/nexo-cms/`:

1. Renomeie (ou copie) `.env.production.example` para `.env`.
2. Preencha os campos `<< ... >>` com suas credenciais:

| Variável | Valor na Hostinger |
|---|---|
| `APP_URL` | `https://vw2digital.com.br` |
| `DB_CONNECTION` | `mysql` |
| `DB_HOST` | `127.0.0.1` (ou `localhost`) |
| `DB_PORT` | `3306` |
| `DB_DATABASE` | Nome do banco criado no hPanel / phpMyAdmin |
| `DB_USERNAME` | Usuário do banco criado no hPanel |
| `DB_PASSWORD` | Senha do banco |
| `PROPOSAL_ACCESS_PASSWORD` | Senha para clientes abrirem `/proposta/{token}` |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | Login inicial do `/admin` |
| `MAIL_*` | SMTP da Hostinger (`smtp.hostinger.com`, porta `465`, `smtps`) |

---

## 5. Finalizar no servidor (SSH do hPanel)

Acesse o terminal SSH em `domains/vw2digital.com.br/nexo-cms` e rode:

```bash
composer install --no-dev --optimize-autoloader
php artisan key:generate --force
php artisan migrate --force
php artisan storage:link
php artisan db:seed --force
php artisan optimize
php artisan filament:optimize
```

> **Dica:** como `bootstrap/app.php` detecta automaticamente `../public_html` quando `nexo-cms/public` não existe, o `php artisan storage:link` já cria o link simbólico diretamente em `public_html/storage`!
> Se você já importou `schema-mysql-hostinger.sql` no **phpMyAdmin**, o `php artisan migrate --force` simplesmente reconhecerá que todas as migrations já estão registradas (`Nothing to migrate`).

---

## 6. Checklist pós-deploy

- [ ] `https://vw2digital.com.br/` abre o site React
- [ ] `https://vw2digital.com.br/projetos` e `/cases` funcionam ao recarregar (sem 404)
- [ ] `https://vw2digital.com.br/up` responde `200 OK`
- [ ] `https://vw2digital.com.br/admin` abre o login estilizado e autentica com `ADMIN_EMAIL` / `ADMIN_PASSWORD`
- [ ] Upload na **Biblioteca de mídia** aparece acessível em `https://vw2digital.com.br/storage/...`
- [ ] A pré-visualização dentro do admin abre o próprio domínio sem bloqueio
