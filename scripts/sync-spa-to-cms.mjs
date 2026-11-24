import fs from 'node:fs'
import path from 'node:path'

const rootDir = path.resolve(import.meta.dirname, '..')
const distDir = path.join(rootDir, 'dist')
const cmsPublicDir = path.join(rootDir, 'cms-laravel', 'public')

if (!fs.existsSync(path.join(distDir, 'index.html'))) {
  console.error('dist/index.html não encontrado. Rode `vite build` primeiro.')
  process.exit(1)
}

// 1. Limpa e sincroniza assets compilados do React em cms-laravel/public/assets
const targetAssetsDir = path.join(cmsPublicDir, 'assets')
fs.rmSync(targetAssetsDir, { recursive: true, force: true })
if (fs.existsSync(path.join(distDir, 'assets'))) {
  fs.cpSync(path.join(distDir, 'assets'), targetAssetsDir, { recursive: true })
}

// 2. Copia arquivos estáticos da raiz de dist/ (imagens, svg) sem sobrescrever arquivos do Laravel
const skipFiles = new Set(['index.html', '.htaccess', 'index.php', 'robots.txt', 'favicon.ico'])
for (const entry of fs.readdirSync(distDir, { withFileTypes: true })) {
  if (entry.name === 'assets' || skipFiles.has(entry.name)) continue
  fs.cpSync(path.join(distDir, entry.name), path.join(cmsPublicDir, entry.name), {
    recursive: true,
    force: true,
  })
}

// 3. Salva index.html como spa.html para ser servido pelas rotas web.php do Laravel
fs.copyFileSync(path.join(distDir, 'index.html'), path.join(cmsPublicDir, 'spa.html'))

console.log('✓ SPA React sincronizado em cms-laravel/public (spa.html + assets/)')
