/** Renderiza Markdown básico (títulos, listas, negrito, itálico, citações, links, cor, tamanho). */
export function Markdown({ content, className = '' }) {
  if (!content?.trim()) return null

  const html = markdownToHtml(content)

  return (
    <div
      className={['markdown-body', className].filter(Boolean).join(' ')}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}

function escapeHtml(text) {
  return String(text || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function sanitizeCssColor(value) {
  const v = String(value || '').trim()
  if (!/^#[0-9a-fA-F]{3,8}$/.test(v)) return ''
  const hex =
    v.length === 4 ? `#${v[1]}${v[1]}${v[2]}${v[2]}${v[3]}${v[3]}` : v.slice(0, 7)
  const n = Number.parseInt(hex.slice(1), 16)
  const r = (n >> 16) & 255
  const g = (n >> 8) & 255
  const b = n & 255
  const luminance = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255
  if (luminance < 0.18) return ''
  return v
}

function sanitizeCssSize(value) {
  const n = Number(String(value || '').replace(/px$/i, '').trim())
  if (!Number.isFinite(n) || n < 8 || n > 200) return ''
  return `${Math.round(n)}px`
}

function attrsToInlineStyle(attrs) {
  const styles = []
  if (attrs.color) styles.push(`color:${attrs.color}`)
  if (attrs.size) styles.push(`font-size:${attrs.size}`)
  return styles.join(';')
}

function parseLegacyStyleAttrs(raw) {
  const out = {}
  for (const part of String(raw || '').split(';')) {
    const idx = part.indexOf(':')
    if (idx === -1) continue
    const key = part.slice(0, idx).trim()
    const value = part.slice(idx + 1).trim()
    if (key === 'color') {
      const color = sanitizeCssColor(value)
      if (color) out.color = color
    }
    if (key === 'size') {
      const size = sanitizeCssSize(value)
      if (size) out.size = size
    }
  }
  return out
}

function expandLegacyStyleMarkers(text) {
  return String(text || '').replace(
    /\{([^{}]+)\}([\s\S]*?)\{\/\}/g,
    (_, raw, inner) => {
      const attrs = parseLegacyStyleAttrs(raw)
      const css = attrsToInlineStyle(attrs)
      if (!css) return inner
      return `<span style="${css}">${inner}</span>`
    },
  )
}

function parseSpanStyleAttr(attrText) {
  const styleMatch = String(attrText).match(/\bstyle\s*=\s*("([^"]*)"|'([^']*)')/i)
  const styleRaw = styleMatch ? styleMatch[2] || styleMatch[3] || '' : ''
  const parsed = {}
  for (const part of styleRaw.split(';')) {
    const idx = part.indexOf(':')
    if (idx === -1) continue
    const key = part.slice(0, idx).trim().toLowerCase()
    const value = part.slice(idx + 1).trim().replace(/\s*!important\s*/gi, '')
    if (key === 'color') {
      const color = sanitizeCssColor(value)
      if (color) parsed.color = color
    }
    if (key === 'font-size') {
      const size = sanitizeCssSize(value)
      if (size) parsed.size = size
    }
  }
  return parsed
}

/**
 * Extrai spans (inclusive multilinha) do documento inteiro antes do parse por linhas,
 * para o HTML não vazar como texto.
 */
function extractSafeSpans(text) {
  const tokens = []
  let expanded = expandLegacyStyleMarkers(String(text || ''))
  let prev = ''
  while (expanded !== prev) {
    prev = expanded
    expanded = expanded.replace(/<span\b([^>]*)>([\s\S]*?)<\/span>/gi, (_, attrs, inner) => {
      const css = attrsToInlineStyle(parseSpanStyleAttr(attrs))
      if (!css) return inner
      const id = tokens.length
      tokens.push({ css, inner })
      return `%%MDSPAN${id}%%`
    })
  }
  return { text: expanded, tokens }
}

function inlineFormatPlain(text) {
  let s = escapeHtml(text)
  s = s.replace(
    /\[([^\]]+)\]\(([^)]+)\)/g,
    '<a href="$2" class="underline underline-offset-2" target="_blank" rel="noreferrer">$1</a>',
  )
  s = s.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
  s = s.replace(/\*([^*]+)\*/g, '<em>$1</em>')
  s = s.replace(
    /`([^`]+)`/g,
    '<code class="rounded bg-black/5 px-1 py-0.5 text-[0.9em]">$1</code>',
  )
  return s
}

/** Formata inline preservando placeholders %%MDSPAN n%%. */
function inlineFormat(text) {
  const parts = String(text || '').split(/(%%MDSPAN\d+%%)/g)
  return parts
    .map((part) => (/^%%MDSPAN\d+%%$/.test(part) ? part : inlineFormatPlain(part)))
    .join('')
}

function renderMarkdownLines(md) {
  const lines = String(md || '').replace(/\r\n/g, '\n').split('\n')
  const out = []
  let i = 0
  let listType = null

  const closeList = () => {
    if (listType) {
      out.push(listType === 'ol' ? '</ol>' : '</ul>')
      listType = null
    }
  }

  while (i < lines.length) {
    const line = lines[i]
    const trimmed = line.trim()

    if (!trimmed) {
      closeList()
      i += 1
      continue
    }

    const onlySpan = trimmed.match(/^%%MDSPAN(\d+)%%$/)
    if (onlySpan) {
      closeList()
      out.push(trimmed)
      i += 1
      continue
    }

    if (trimmed.startsWith('```')) {
      closeList()
      const code = []
      i += 1
      while (i < lines.length && !lines[i].trim().startsWith('```')) {
        code.push(escapeHtml(lines[i]))
        i += 1
      }
      out.push(
        `<pre class="overflow-x-auto rounded-2xl bg-black/5 p-4 text-xs"><code>${code.join('\n')}</code></pre>`,
      )
      i += 1
      continue
    }

    const heading = trimmed.match(/^(#{1,3})\s+(.+)$/)
    if (heading) {
      closeList()
      const level = heading[1].length
      out.push(
        `<h${level} class="md-h md-h${level}">${inlineFormat(heading[2])}</h${level}>`,
      )
      i += 1
      continue
    }

    if (trimmed.startsWith('> ')) {
      closeList()
      const quote = []
      while (i < lines.length && lines[i].trim().startsWith('>')) {
        quote.push(lines[i].trim().replace(/^>\s?/, ''))
        i += 1
      }
      out.push(
        `<blockquote class="border-l-2 border-ink/20 pl-4 text-muted italic">${inlineFormat(quote.join(' '))}</blockquote>`,
      )
      continue
    }

    const ol = trimmed.match(/^\d+\.\s+(.+)$/)
    if (ol) {
      if (listType !== 'ol') {
        closeList()
        out.push('<ol class="list-decimal space-y-1 pl-5">')
        listType = 'ol'
      }
      out.push(`<li>${inlineFormat(ol[1])}</li>`)
      i += 1
      continue
    }

    const ul = trimmed.match(/^[-*]\s+(.+)$/)
    if (ul) {
      if (listType !== 'ul') {
        closeList()
        out.push('<ul class="list-disc space-y-1 pl-5">')
        listType = 'ul'
      }
      out.push(`<li>${inlineFormat(ul[1])}</li>`)
      i += 1
      continue
    }

    if (trimmed === '---' || trimmed === '***') {
      closeList()
      out.push('<hr class="border-line" />')
      i += 1
      continue
    }

    closeList()
    out.push(`<p>${inlineFormat(trimmed)}</p>`)
    i += 1
  }

  closeList()
  return out.join('\n')
}

function renderSpanInner(inner) {
  const trimmed = String(inner || '').trim()
  if (!trimmed) return ''
  if (!trimmed.includes('\n')) return inlineFormat(trimmed)
  return renderMarkdownLines(trimmed)
}

function markdownToHtml(md) {
  const { text, tokens } = extractSafeSpans(String(md || '').replace(/\r\n/g, '\n'))
  let html = renderMarkdownLines(text)

  for (let i = tokens.length - 1; i >= 0; i -= 1) {
    const token = tokens[i]
    const replacement = `<span class="md-style" style="${token.css}">${renderSpanInner(token.inner)}</span>`
    const placeholder = `%%MDSPAN${i}%%`
    html = html.split(placeholder).join(replacement)
    html = html.split(escapeHtml(placeholder)).join(replacement)
  }

  return html
}
