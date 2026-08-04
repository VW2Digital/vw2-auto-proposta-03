/** Renderiza Markdown básico (títulos, listas, negrito, itálico, citações, links, parágrafos). */
export function Markdown({ content, className = '' }) {
  if (!content?.trim()) return null

  const html = markdownToHtml(content)

  return (
    <div
      className={`markdown-body space-y-3 text-sm leading-relaxed text-ink ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}

function escapeHtml(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function inlineFormat(text) {
  let s = escapeHtml(text)
  s = s.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="underline underline-offset-2" target="_blank" rel="noreferrer">$1</a>')
  s = s.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
  s = s.replace(/\*([^*]+)\*/g, '<em>$1</em>')
  s = s.replace(/`([^`]+)`/g, '<code class="rounded bg-black/5 px-1 py-0.5 text-[0.9em]">$1</code>')
  return s
}

function markdownToHtml(md) {
  const lines = md.replace(/\r\n/g, '\n').split('\n')
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

    if (trimmed.startsWith('```')) {
      closeList()
      const code = []
      i += 1
      while (i < lines.length && !lines[i].trim().startsWith('```')) {
        code.push(escapeHtml(lines[i]))
        i += 1
      }
      out.push(`<pre class="overflow-x-auto rounded-2xl bg-black/5 p-4 text-xs"><code>${code.join('\n')}</code></pre>`)
      i += 1
      continue
    }

    const heading = trimmed.match(/^(#{1,3})\s+(.+)$/)
    if (heading) {
      closeList()
      const level = heading[1].length
      const cls =
        level === 1
          ? 'text-xl font-bold'
          : level === 2
            ? 'text-lg font-bold'
            : 'text-base font-semibold'
      out.push(`<h${level} class="${cls} mt-4 first:mt-0">${inlineFormat(heading[2])}</h${level}>`)
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
