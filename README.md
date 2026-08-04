# Nexo Studio — Site + Payload CMS

Landing React + plataforma de propostas. Tudo gerenciado no **Payload Admin**.

## Stack

| Camada | Tecnologia |
|---|---|
| Site | React + Vite + Tailwind |
| CMS / Admin | Payload CMS 3 (Next.js) |
| Banco (dev) | SQLite (`cms/data/nexo.db`) |
| Banco (opcional) | PostgreSQL via Docker Compose |

## Como rodar

### Site
```bash
npm install
npm run dev
```
→ http://localhost:5173

### CMS
```bash
cd cms
npm install
npm run dev
```
→ Admin: http://localhost:3000/admin  
→ Preview: http://localhost:5173/preview

### Popular conteúdo (igual ao site)
```bash
cd cms && npm run seed
```

## Collections (espelham o site)

| Coleção | Uso |
|---|---|
| **Services** | Serviços + montagem de proposta (`slug` = id) |
| **Projects** | Portfólio masonry |
| **Cases** | Cards + texto longo em Markdown |
| **Audiences** | Quem ajudamos |
| **Testimonials** | Depoimentos |
| **Proposals** | Solicitações do site → formalização → link do cliente |

## Globals (seções da home)

| Global | Seção |
|---|---|
| **Hero** | 1ª — headline, tags, CTA |
| **Trust Bar** | 2ª — prova social + logos |
| **Seção de Vídeo** | 3ª — título, CTA, URL do vídeo |

## Markdown

Templates e textos prontos em `cms/content/`:

- `templates/case.md` → Cases → **Texto completo (Markdown)**
- `templates/proposta.md` → Propostas → **Mensagem para o cliente (Markdown)**
- `cases/*.md` e `proposals/*.md` → exemplos para colar no admin

## Fluxo de propostas

1. Cliente monta e envia no site → chega em **Propostas** (status Nova)
2. Equipe formaliza no Payload (preço + Markdown)
3. Status **Enviada** gera `accessToken`
4. Cliente acessa `/proposta/{token}` com a senha
5. Aceite / negociação volta para o Payload

## Variáveis

**Site**
```
VITE_API_URL=http://localhost:3000
```

**CMS (`cms/.env`)**
```
PAYLOAD_SECRET=...
FRONTEND_URL=http://localhost:5173
NEXT_PUBLIC_SERVER_URL=http://localhost:3000
PROPOSAL_ACCESS_PASSWORD=nexo2026
```
