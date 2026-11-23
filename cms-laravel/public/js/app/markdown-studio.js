/* Editor Markdown do Nexo CMS — mesma sintaxe que o site renderiza. */
;(function () {
  const SPAN_WRAP_RE = /^<span\b[^>]*\bstyle\s*=\s*("([^"]*)"|'([^']*)')[^>]*>([\s\S]*)<\/span>$/i

  const ACTIONS = {
    bold: { kind: 'wrap', before: '**', after: '**', placeholder: 'negrito' },
    italic: { kind: 'wrap', before: '*', after: '*', placeholder: 'itálico' },
    code: { kind: 'wrap', before: '`', after: '`', placeholder: 'código' },
    link: { kind: 'wrap', before: '[', after: '](https://)', placeholder: 'texto do link' },
    h1: { kind: 'heading', level: 1 },
    h2: { kind: 'heading', level: 2 },
    h3: { kind: 'heading', level: 3 },
    list: { kind: 'linePrefix', prefix: '- ' },
    quote: { kind: 'linePrefix', prefix: '> ' },
  }

  function parseStyle(raw) {
    const out = {}
    String(raw || '')
      .split(';')
      .forEach((part) => {
        const idx = part.indexOf(':')
        if (idx === -1) return
        const key = part.slice(0, idx).trim().toLowerCase()
        const value = part.slice(idx + 1).trim()
        if (key === 'color' && /^#[0-9a-f]{3,8}$/i.test(value)) out.color = value
        if (key === 'font-size' && /^\d{1,3}(px)?$/i.test(value)) out.size = value.replace(/px$/i, '')
      })
    return out
  }

  function serializeSpan(attrs, inner) {
    const styles = []
    if (attrs.color) styles.push(`color:${attrs.color}`)
    if (attrs.size) styles.push(`font-size:${attrs.size}px`)
    return `<span style="${styles.join(';')}">${inner}</span>`
  }

  function applyStyleWrap(value, start, end, patch) {
    const selected = value.slice(start, end)
    let attrs = {}
    let inner = selected || 'texto'
    const match = selected.match(SPAN_WRAP_RE)
    if (match) {
      attrs = parseStyle(match[2] || match[3] || '')
      inner = match[4]
    }
    const wrapped = serializeSpan({ ...attrs, ...patch }, inner)
    return {
      next: value.slice(0, start) + wrapped + value.slice(end),
      selStart: start + wrapped.indexOf('>') + 1,
      selEnd: start + wrapped.length - '</span>'.length,
    }
  }

  function applyAction(value, start, end, action) {
    if (action.kind === 'wrap') {
      const selected = value.slice(start, end)
      const { before, after, placeholder = '' } = action
      if (selected.startsWith(before) && selected.endsWith(after) && selected.length >= before.length + after.length) {
        const inner = selected.slice(before.length, selected.length - after.length)
        return { next: value.slice(0, start) + inner + value.slice(end), selStart: start, selEnd: start + inner.length }
      }
      if (value.slice(Math.max(0, start - before.length), start) === before && value.slice(end, end + after.length) === after) {
        return {
          next: value.slice(0, start - before.length) + selected + value.slice(end + after.length),
          selStart: start - before.length,
          selEnd: end - before.length,
        }
      }
      const insert = selected || placeholder
      return {
        next: value.slice(0, start) + before + insert + after + value.slice(end),
        selStart: start + before.length,
        selEnd: start + before.length + insert.length,
      }
    }

    const lineStart = value.lastIndexOf('\n', Math.max(0, start - 1)) + 1
    const lineEndIdx = value.indexOf('\n', end)
    const lineEnd = lineEndIdx === -1 ? value.length : lineEndIdx
    const lines = value.slice(lineStart, lineEnd).split('\n')

    let toggled
    if (action.kind === 'heading') {
      const prefix = `${'#'.repeat(action.level)} `
      toggled = lines.map((line) => {
        const bare = line.replace(/^#{1,6}\s+/, '')
        return line.startsWith(prefix) ? bare : prefix + bare
      })
    } else {
      toggled = lines.map((line) => (line.startsWith(action.prefix) ? line.slice(action.prefix.length) : action.prefix + line))
    }
    const block = toggled.join('\n')
    return { next: value.slice(0, lineStart) + block + value.slice(lineEnd), selStart: lineStart, selEnd: lineStart + block.length }
  }

  /* ---------- pré-visualização (subconjunto do Markdown.jsx do site) ---------- */
  function escapeHtml(s) {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  }

  function inline(text) {
    let s = escapeHtml(text)
    // <span style="…"> permitido (cor/tamanho) — só color e font-size.
    s = s.replace(/&lt;span\s+style=("|')([^"']*)\1\s*&gt;/gi, (_, _q, style) => {
      const a = parseStyle(style)
      const css = [a.color && `color:${a.color}`, a.size && `font-size:${a.size}px`].filter(Boolean).join(';')
      return `<span style="${css}">`
    })
    s = s.replace(/&lt;\/span&gt;/gi, '</span>')
    s = s.replace(/`([^`]+)`/g, '<code>$1</code>')
    s = s.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    s = s.replace(/(^|[^*])\*([^*\n]+)\*/g, '$1<em>$2</em>')
    s = s.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_, label, href) => {
      const safe = /^(https?:|mailto:|tel:|#|\/)/i.test(href) ? href : '#'
      return `<a href="${safe}" target="_blank" rel="noopener">${label}</a>`
    })
    return s
  }

  function render(md) {
    const lines = String(md || '').replace(/\r\n/g, '\n').split('\n')
    const html = []
    let para = []
    let list = []
    let quote = []

    const flush = () => {
      if (para.length) html.push(`<p>${para.map(inline).join('<br>')}</p>`)
      if (list.length) html.push(`<ul>${list.map((l) => `<li>${inline(l)}</li>`).join('')}</ul>`)
      if (quote.length) html.push(`<blockquote>${quote.map(inline).join('<br>')}</blockquote>`)
      para = []
      list = []
      quote = []
    }

    for (const line of lines) {
      const h = line.match(/^(#{1,3})\s+(.*)$/)
      if (h) {
        flush()
        html.push(`<h${h[1].length}>${inline(h[2])}</h${h[1].length}>`)
      } else if (/^\s*[-*]\s+/.test(line)) {
        if (para.length || quote.length) flush()
        list.push(line.replace(/^\s*[-*]\s+/, ''))
      } else if (/^>\s?/.test(line)) {
        if (para.length || list.length) flush()
        quote.push(line.replace(/^>\s?/, ''))
      } else if (!line.trim()) {
        flush()
      } else {
        if (list.length || quote.length) flush()
        para.push(line)
      }
    }
    flush()
    return html.join('') || '<p class="is-empty">Nada para visualizar ainda.</p>'
  }

  window.markdownStudio = function ({ state, color }) {
    return {
      state,
      color: color || '#0a0a0a',
      size: 16,
      mode: 'write',
      focused: false,

      get preview() {
        return render(this.state)
      },

      get stats() {
        const text = String(this.state || '')
        const words = text.trim() ? text.trim().split(/\s+/).length : 0
        return `${words} palavra${words === 1 ? '' : 's'} · ${text.length} caracteres`
      },

      commit(result) {
        this.state = result.next
        this.$nextTick(() => {
          const el = this.$refs.input
          if (!el) return
          el.focus()
          el.setSelectionRange(result.selStart, result.selEnd)
        })
      },

      selection() {
        const el = this.$refs.input
        if (this.mode === 'preview') this.mode = 'write'
        return { value: String(this.state || ''), start: el?.selectionStart ?? 0, end: el?.selectionEnd ?? 0 }
      },

      run(id) {
        const { value, start, end } = this.selection()
        this.commit(applyAction(value, start, end, ACTIONS[id]))
      },

      applyColor() {
        const { value, start, end } = this.selection()
        this.commit(applyStyleWrap(value, start, end, { color: this.color }))
      },

      applySize() {
        const size = Math.min(200, Math.max(8, Number(this.size) || 16))
        this.size = size
        const { value, start, end } = this.selection()
        this.commit(applyStyleWrap(value, start, end, { size: String(size) }))
      },
    }
  }
})()
