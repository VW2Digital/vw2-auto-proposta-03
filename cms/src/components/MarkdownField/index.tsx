'use client'

import React, { useCallback, useRef, useState } from 'react'
import type { TextareaFieldClientComponent } from 'payload'
import { FieldDescription, FieldError, FieldLabel, useField } from '@payloadcms/ui'
import './index.scss'

type Action =
  | { kind: 'wrap'; before: string; after: string; placeholder?: string }
  | { kind: 'heading'; level: 1 | 2 | 3 }
  | { kind: 'linePrefix'; prefix: string }

type Tool = {
  id: string
  label: string
  title: string
  className?: string
  action: Action
  dividerBefore?: boolean
}

const DEFAULT_COLOR = '#0a0a0a'
const DEFAULT_SIZE = 16
const MIN_SIZE = 8
const MAX_SIZE = 200

const SPAN_WRAP_RE =
  /^<span\b[^>]*\bstyle\s*=\s*("([^"]*)"|'([^']*)')[^>]*>([\s\S]*)<\/span>$/i
const LEGACY_WRAP_RE = /^\{([^{}]+)\}([\s\S]*)\{\/\}$/

const TOOLS: Tool[] = [
  {
    id: 'bold',
    label: 'B',
    title: 'Negrito (⌘B)',
    action: { kind: 'wrap', before: '**', after: '**', placeholder: 'negrito' },
  },
  {
    id: 'italic',
    label: 'I',
    title: 'Itálico (⌘I)',
    className: 'nexo-md__btn--italic',
    action: { kind: 'wrap', before: '*', after: '*', placeholder: 'itálico' },
  },
  {
    id: 'code',
    label: '</>',
    title: 'Código',
    className: 'nexo-md__btn--code',
    action: { kind: 'wrap', before: '`', after: '`', placeholder: 'código' },
  },
  {
    id: 'link',
    label: 'Link',
    title: 'Link',
    dividerBefore: true,
    action: { kind: 'wrap', before: '[', after: '](https://)', placeholder: 'texto do link' },
  },
  {
    id: 'h1',
    label: 'H1',
    title: 'Título H1',
    dividerBefore: true,
    action: { kind: 'heading', level: 1 },
  },
  {
    id: 'h2',
    label: 'H2',
    title: 'Título H2',
    action: { kind: 'heading', level: 2 },
  },
  {
    id: 'h3',
    label: 'H3',
    title: 'Título H3',
    action: { kind: 'heading', level: 3 },
  },
  {
    id: 'list',
    label: 'Lista',
    title: 'Lista',
    dividerBefore: true,
    action: { kind: 'linePrefix', prefix: '- ' },
  },
  {
    id: 'quote',
    label: '“”',
    title: 'Citação',
    action: { kind: 'linePrefix', prefix: '> ' },
  },
]

function parseStyleDeclaration(raw: string): { color?: string; size?: string } {
  const out: { color?: string; size?: string } = {}
  for (const part of String(raw || '').split(';')) {
    const idx = part.indexOf(':')
    if (idx === -1) continue
    const key = part.slice(0, idx).trim().toLowerCase().replace(/\s+/g, '')
    const value = part.slice(idx + 1).trim().replace(/\s*!important\s*/gi, '')
    if (key === 'color' && /^#[0-9a-fA-F]{3,8}$/.test(value)) out.color = value
    if ((key === 'font-size' || key === 'size') && /^\d{1,3}(?:px)?$/.test(value)) {
      out.size = value.replace(/px$/i, '')
    }
  }
  return out
}

function serializeSpan(attrs: { color?: string; size?: string }, inner: string) {
  const styles: string[] = []
  if (attrs.color) styles.push(`color:${attrs.color}`)
  if (attrs.size) styles.push(`font-size:${attrs.size}px`)
  return `<span style="${styles.join(';')}">${inner}</span>`
}

function applyStyleWrap(
  value: string,
  start: number,
  end: number,
  patch: { color?: string; size?: string },
): { next: string; selStart: number; selEnd: number } {
  const selected = value.slice(start, end)
  let attrs: { color?: string; size?: string } = {}
  let inner = selected || 'texto'

  const spanMatch = selected.match(SPAN_WRAP_RE)
  const legacyMatch = selected.match(LEGACY_WRAP_RE)
  if (spanMatch) {
    attrs = parseStyleDeclaration(spanMatch[2] || spanMatch[3] || '')
    inner = spanMatch[4]
  } else if (legacyMatch) {
    attrs = parseStyleDeclaration(legacyMatch[1])
    inner = legacyMatch[2]
  }

  const nextAttrs = {
    ...attrs,
    ...(patch.color ? { color: patch.color } : {}),
    ...(patch.size ? { size: patch.size } : {}),
  }
  const wrapped = serializeSpan(nextAttrs, inner)
  return {
    next: value.slice(0, start) + wrapped + value.slice(end),
    selStart: start + wrapped.indexOf('>') + 1,
    selEnd: start + wrapped.length - '</span>'.length,
  }
}

function applyAction(
  value: string,
  start: number,
  end: number,
  action: Action,
): { next: string; selStart: number; selEnd: number } {
  if (action.kind === 'wrap') {
    const selected = value.slice(start, end)
    const { before, after, placeholder = '' } = action

    if (
      selected.startsWith(before) &&
      selected.endsWith(after) &&
      selected.length >= before.length + after.length
    ) {
      const inner = selected.slice(before.length, selected.length - after.length)
      return {
        next: value.slice(0, start) + inner + value.slice(end),
        selStart: start,
        selEnd: start + inner.length,
      }
    }

    if (
      value.slice(Math.max(0, start - before.length), start) === before &&
      value.slice(end, end + after.length) === after
    ) {
      return {
        next: value.slice(0, start - before.length) + selected + value.slice(end + after.length),
        selStart: start - before.length,
        selEnd: end - before.length,
      }
    }

    const insert = selected || placeholder
    const next = value.slice(0, start) + before + insert + after + value.slice(end)
    return {
      next,
      selStart: start + before.length,
      selEnd: start + before.length + insert.length,
    }
  }

  const lineStart = value.lastIndexOf('\n', Math.max(0, start - 1)) + 1
  const lineEndIdx = value.indexOf('\n', end)
  const lineEnd = lineEndIdx === -1 ? value.length : lineEndIdx
  const block = value.slice(lineStart, lineEnd)
  const lines = block.split('\n')

  if (action.kind === 'heading') {
    const prefix = `${'#'.repeat(action.level)} `
    const toggled = lines.map((line) => {
      const bare = line.replace(/^#{1,6}\s+/, '')
      if (line.startsWith(prefix)) return bare
      return `${prefix}${bare}`
    })
    const nextBlock = toggled.join('\n')
    return {
      next: value.slice(0, lineStart) + nextBlock + value.slice(lineEnd),
      selStart: lineStart,
      selEnd: lineStart + nextBlock.length,
    }
  }

  const toggled = lines.map((line) =>
    line.startsWith(action.prefix) ? line.slice(action.prefix.length) : `${action.prefix}${line}`,
  )
  const nextBlock = toggled.join('\n')
  return {
    next: value.slice(0, lineStart) + nextBlock + value.slice(lineEnd),
    selStart: lineStart,
    selEnd: lineStart + nextBlock.length,
  }
}

export const MarkdownField: TextareaFieldClientComponent = (props) => {
  const { field, path, readOnly } = props
  const { value, setValue, showError, errorMessage } = useField<string>({
    path,
  })
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const rows = typeof field.admin?.rows === 'number' ? field.admin.rows : 8
  const initialColor =
    typeof field.admin?.custom?.defaultColor === 'string'
      ? field.admin.custom.defaultColor
      : DEFAULT_COLOR
  const [color, setColor] = useState(initialColor)
  const [size, setSize] = useState(DEFAULT_SIZE)

  const commit = useCallback(
    (next: string, selStart: number, selEnd: number) => {
      setValue(next)
      requestAnimationFrame(() => {
        const el = textareaRef.current
        if (!el) return
        el.focus()
        el.setSelectionRange(selStart, selEnd)
      })
    },
    [setValue],
  )

  const run = useCallback(
    (action: Action) => {
      if (readOnly) return
      const el = textareaRef.current
      const current = value || ''
      const start = el?.selectionStart ?? current.length
      const end = el?.selectionEnd ?? current.length
      const result = applyAction(current, start, end, action)
      commit(result.next, result.selStart, result.selEnd)
    },
    [commit, readOnly, value],
  )

  const applyColor = (nextColor: string) => {
    setColor(nextColor)
    if (readOnly) return
    const el = textareaRef.current
    const current = value || ''
    const start = el?.selectionStart ?? current.length
    const end = el?.selectionEnd ?? current.length
    const result = applyStyleWrap(current, start, end, { color: nextColor })
    commit(result.next, result.selStart, result.selEnd)
  }

  const applySize = (nextSize: number) => {
    const clamped = Math.min(MAX_SIZE, Math.max(MIN_SIZE, Math.round(nextSize)))
    setSize(clamped)
    if (readOnly) return
    const el = textareaRef.current
    const current = value || ''
    const start = el?.selectionStart ?? current.length
    const end = el?.selectionEnd ?? current.length
    const result = applyStyleWrap(current, start, end, { size: String(clamped) })
    commit(result.next, result.selStart, result.selEnd)
  }

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const mod = e.metaKey || e.ctrlKey
    if (!mod) return
    if (e.key.toLowerCase() === 'b') {
      e.preventDefault()
      run(TOOLS[0].action)
    } else if (e.key.toLowerCase() === 'i') {
      e.preventDefault()
      run(TOOLS[1].action)
    }
  }

  return (
    <div className="field-type textarea nexo-md">
      <FieldLabel label={field.label} path={path} required={field.required} />
      <FieldError showError={showError} message={errorMessage} />

      <div className="nexo-md__toolbar" role="toolbar" aria-label="Formatação Markdown">
        {TOOLS.map((item) => (
          <React.Fragment key={item.id}>
            {item.dividerBefore ? <span className="nexo-md__divider" aria-hidden /> : null}
            <button
              type="button"
              className={`nexo-md__btn ${item.className || ''}`}
              title={item.title}
              aria-label={item.title}
              disabled={Boolean(readOnly)}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => run(item.action)}
            >
              {item.label}
            </button>
          </React.Fragment>
        ))}

        <span className="nexo-md__divider" aria-hidden />

        <div className="nexo-md__control" title="Cor do texto">
          <input
            type="color"
            className="nexo-md__color"
            value={color}
            disabled={Boolean(readOnly)}
            aria-label="Cor do texto"
            onChange={(e) => applyColor(e.target.value)}
          />
        </div>

        <div className="nexo-md__control" title="Tamanho em pixels">
          <button
            type="button"
            className="nexo-md__size-btn"
            disabled={Boolean(readOnly) || size <= MIN_SIZE}
            aria-label="Diminuir tamanho"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => applySize(size - 1)}
          >
            −
          </button>
          <input
            type="number"
            className="nexo-md__size"
            min={MIN_SIZE}
            max={MAX_SIZE}
            step={1}
            value={size}
            disabled={Boolean(readOnly)}
            aria-label="Tamanho do texto em pixels"
            onChange={(e) => {
              const n = Number(e.target.value)
              if (Number.isFinite(n)) applySize(n)
            }}
          />
          <span className="nexo-md__unit">px</span>
          <button
            type="button"
            className="nexo-md__size-btn"
            disabled={Boolean(readOnly) || size >= MAX_SIZE}
            aria-label="Aumentar tamanho"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => applySize(size + 1)}
          >
            +
          </button>
        </div>
      </div>

      <textarea
        ref={textareaRef}
        id={`field-${path.replace(/\./g, '__')}`}
        className="nexo-md__textarea"
        value={value || ''}
        rows={rows}
        disabled={Boolean(readOnly)}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={onKeyDown}
      />

      <FieldDescription description={field.admin?.description} path={path} />
      <p className="nexo-md__hint">
        Selecione o texto e use cor/tamanho. Atalhos: ⌘/Ctrl+B e ⌘/Ctrl+I
      </p>
    </div>
  )
}

export default MarkdownField
