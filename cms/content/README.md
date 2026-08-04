# Conteúdo Markdown — Nexo Studio

Templates e textos prontos para colar no **Payload Admin**.

## Templates

| Arquivo | Uso no Payload |
|---|---|
| `templates/case.md` | Cases → campo **Texto completo (Markdown)** |
| `templates/proposta.md` | Propostas → campo **Mensagem para o cliente (Markdown)** |

## Cases prontos

| Arquivo | Cliente |
|---|---|
| `cases/novatech.md` | NovaTech Solutions |
| `cases/casa-aurora.md` | Casa Aurora |
| `cases/clinica-vitalis.md` | Clínica Vitalis |
| `cases/atlas-imoveis.md` | Atlas Imóveis |

## Propostas

| Arquivo | Uso |
|---|---|
| `proposals/exemplo-novatech.md` | Exemplo de mensagem formal (NovaTech) |

## Fluxo de propostas

1. Cliente envia pelo site → aparece em **Propostas** com status **Nova**
2. Equipe analisa → **Em análise**
3. Preenche investimento + mensagem Markdown → status **Enviada** (gera token)
4. Envia ao cliente: `{FRONTEND}/proposta/{accessToken}` + senha configurada
5. Cliente aceita ou negocia → resposta aparece na aba **Resposta do cliente**
