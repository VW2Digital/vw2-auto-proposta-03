# Deploy em Produção — Hostinger (MySQL / phpMyAdmin)

Este projeto é composto por duas camadas:

1. **Site React (estático em `dist/`)** — ex.: `https://seudominio.com.br`
2. **CMS + Admin Laravel/Filament (`cms-laravel/`)** — ex.: `https://cms.seudominio.com.br` (painel em `/admin` e API em `/api/*`)

---

## 1. Criar o banco MySQL na Hostinger

1. Acesse o **hPanel → Bancos de Dados → Gerenciamento**.
2. Crie um novo banco MySQL (anote **Nome do banco**, **Usuário** e **Senha** — na Hostinger geralmente começam com `u000000000_...`).
3. Confira a versão do PHP do domínio/subdomínio em **hPanel → Avançado → Configuração do PHP** e selecione **PHP 8.3** ou **PHP 8.4** com as extensões `pdo_mysql`, `intl`, `gd`, `mbstring`, `zip`, `fileinfo` ativadas.

---

## 2. Preencher as credenciais de produção

### A) CMS Laravel (`cms-laravel/.env`)

Copie `cms-laravel/.env.production.example` para `cms-laravel/.env` e preencha os campos marcados com `<< ... >>`:

| Variável | Onde encontrar na Hostinger / valor |
|---|---|
| `APP_URL` | URL do CMS (ex.: `https://cms.seudominio.com.br`) |
| `DB_CONNECTION` | `mysql` |
| `DB_HOST` | `127.0.0.1` (na mesma hospedagem) ou o host de **MySQL Remoto** (ex.: `srvXXXX.hstgr.io`) |
| `DB_PORT` | `3306` |
| `DB_DATABASE` | Nome do banco criado no hPanel / phpMyAdmin |
| `DB_USERNAME` | Usuário do banco criado no hPanel |
| `DB_PASSWORD` | Senha do banco |
| `FRONTEND_URL` | URL do site React (ex.: `https://seudominio.com.br`) |
| `CORS_ALLOWED_ORIGINS` | Domínios do site separados por vírgula (ex.: `https://seudominio.com.br,https://www.seudominio.com.br`) |
| `PROPOSAL_ACCESS_PASSWORD` | Senha que o cliente usa para abrir `/proposta/{token}` |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | Login do usuário admin inicial |
| `MAIL_*` | Dados SMTP da Hostinger (`smtp.hostinger.com`, porta `465`, `smtps`) |

### B) Site React (`.env.production` na raiz)

Copie `.env.production.example` para `.env.production` na raiz e ajuste:

```env
VITE_API_URL=https://cms.seudominio.com.br
```

---

## 3. Gerar os builds de produção

Na raiz do projeto (antes de enviar para o servidor):

```bash
npm run build
npm run build:cms
```

- O site compilado fica em `dist/` (já incluindo o `dist/.htaccess` para rotas do React Router).
- O tema compilado do admin fica em `cms-laravel/public/build/`.

---

## 4. Subir os arquivos na Hostinger

### Site React (`https://seudominio.com.br`)
- Envie **todo o conteúdo de `dist/`** (incluindo o arquivo oculto `.htaccess`) para o `public_html/` do domínio principal.

### CMS Laravel (`https://cms.seudominio.com.br`)
1. Crie um subdomínio (ex.: `cms.seudominio.com.br`) no hPanel e configure o diretório raiz dele (ou aponte o subdomínio) para a pasta `cms-laravel/public`.
2. Envie a pasta `cms-laravel/` (com `cms-laravel/.env` já preenchido e sem o `database.sqlite` local).
3. Garanta permissão de escrita em `cms-laravel/storage` e `cms-laravel/bootstrap/cache`.

---

## 5. Criar tabelas no MySQL (via SSH ou phpMyAdmin)

### Opção A — Via SSH (recomendado)

Conecte via SSH na Hostinger, entre na pasta `cms-laravel` e rode:

```bash
composer install --no-dev --optimize-autoloader
php artisan key:generate --force
php artisan migrate --force
php artisan storage:link
php artisan filament:assets
php artisan db:seed --force
php artisan optimize
php artisan filament:optimize
```

### Opção B — Via phpMyAdmin (sem rodar migrate)

1. Abra o **phpMyAdmin** pelo hPanel e selecione o banco criado.
2. Vá na aba **Importar**, selecione `cms-laravel/database/schema-mysql-hostinger.sql` e clique em **Executar**.
3. Depois, no SSH (ou terminal do hPanel), execute `php artisan key:generate --force`, `php artisan storage:link`, `php artisan db:seed --force` e `php artisan optimize`.

---

## 6. Checklist pós-deploy

- [ ] `https://cms.seudominio.com.br/up` responde `200 OK`
- [ ] `https://cms.seudominio.com.br/admin` abre a tela de login estilizada (sem erros de CSS/JS)
- [ ] Login funciona com `ADMIN_EMAIL` / `ADMIN_PASSWORD`
- [ ] Upload de imagem na **Biblioteca de mídia** salva e exibe a URL com `https://`
- [ ] `https://seudominio.com.br` carrega os dados vindos da API sem erro de CORS no console
- [ ] Recarregar `https://seudominio.com.br/projetos` ou `/cases` abre normalmente sem 404
