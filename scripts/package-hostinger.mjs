import fs from 'node:fs'
import path from 'node:path'

const rootDir = path.resolve(import.meta.dirname, '..')
const cmsDir = path.join(rootDir, 'cms-laravel')
const cmsPublicDir = path.join(cmsDir, 'public')
const outDir = path.join(rootDir, 'release-hostinger')
const outAppDir = path.join(outDir, 'nexo-cms')
const outPublicHtmlDir = path.join(outDir, 'public_html')

// Valida pré-requisitos de build
const requiredFiles = [
  path.join(cmsPublicDir, 'spa.html'),
  path.join(cmsPublicDir, 'build', 'manifest.json'),
]
for (const file of requiredFiles) {
  if (!fs.existsSync(file)) {
    console.error(`Arquivo obrigatório ausente: ${path.relative(rootDir, file)}`)
    console.error('Rode antes o build do tema do CMS (npm run build:cms ou via Docker) e o build do site (npm run build).')
    process.exit(1)
  }
}

fs.rmSync(outDir, { recursive: true, force: true })
fs.mkdirSync(outAppDir, { recursive: true })
fs.mkdirSync(outPublicHtmlDir, { recursive: true })

// 1. Copia a aplicação Laravel para release-hostinger/nexo-cms/ (fora do public_html!)
const appItems = [
  'app',
  'bootstrap',
  'config',
  'database',
  'lang',
  'resources',
  'routes',
  'artisan',
  'composer.json',
  'composer.lock',
  '.env.production.example',
]

for (const item of appItems) {
  const src = path.join(cmsDir, item)
  if (!fs.existsSync(src)) continue
  fs.cpSync(src, path.join(outAppDir, item), {
    recursive: true,
    filter: (p) => {
      const base = path.basename(p)
      // Nunca empacota banco SQLite local nem caches gerados localmente
      if (base === 'database.sqlite' || base.endsWith('.sqlite')) return false
      if (p.includes(path.join('bootstrap', 'cache')) && base.endsWith('.php')) return false
      return true
    },
  })
}

// 2. Cria estrutura limpa de storage/ e bootstrap/cache/
const storageDirs = [
  'storage/app/private',
  'storage/app/public',
  'storage/framework/cache/data',
  'storage/framework/sessions',
  'storage/framework/testing',
  'storage/framework/views',
  'storage/logs',
  'bootstrap/cache',
]
for (const dir of storageDirs) {
  fs.mkdirSync(path.join(outAppDir, dir), { recursive: true })
}

// 2b. Protege nexo-cms/ contra acesso web caso fique dentro de public_html/
const denyHtaccess = `<IfModule mod_authz_core.c>
    Require all denied
</IfModule>
<IfModule !mod_authz_core.c>
    Order allow,deny
    Deny from all
</IfModule>
`
fs.writeFileSync(path.join(outAppDir, '.htaccess'), denyHtaccess, 'utf8')

// 3. Copia tudo de cms-laravel/public/ para release-hostinger/public_html/ (exceto symlink local storage)
for (const entry of fs.readdirSync(cmsPublicDir, { withFileTypes: true })) {
  if (entry.name === 'storage' || entry.name === 'hot' || entry.name === 'index.php') continue
  fs.cpSync(path.join(cmsPublicDir, entry.name), path.join(outPublicHtmlDir, entry.name), {
    recursive: true,
    force: true,
  })
}

// 4. Gera public_html/index.php suportando tanto ../nexo-cms quanto ./nexo-cms
const hostingerIndexPhp = `<?php

use Illuminate\\Foundation\\Application;
use Illuminate\\Http\\Request;

define('LARAVEL_START', microtime(true));

$appRoot = is_dir(__DIR__.'/../nexo-cms')
    ? __DIR__.'/../nexo-cms'
    : __DIR__.'/nexo-cms';

if (file_exists($maintenance = $appRoot.'/storage/framework/maintenance.php')) {
    require $maintenance;
}

require $appRoot.'/vendor/autoload.php';

/** @var Application $app */
$app = require_once $appRoot.'/bootstrap/app.php';
$app->usePublicPath(__DIR__);

$app->handleRequest(Request::capture());
`
fs.writeFileSync(path.join(outPublicHtmlDir, 'index.php'), hostingerIndexPhp, 'utf8')

console.log('✓ Pacote Hostinger gerado em release-hostinger/')
console.log('  ├── nexo-cms/     -> subir para domains/vw2digital.com.br/nexo-cms')
console.log('  └── public_html/  -> subir conteúdo para domains/vw2digital.com.br/public_html')
