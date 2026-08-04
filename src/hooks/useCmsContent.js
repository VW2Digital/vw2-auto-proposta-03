import { useEffect, useRef, useState } from 'react'

function readCache(key) {
  try {
    const raw = sessionStorage.getItem(key)
    if (!raw) return null
    return JSON.parse(raw)
  } catch {
    return null
  }
}

function writeCache(key, value) {
  try {
    sessionStorage.setItem(key, JSON.stringify(value))
  } catch {
    /* quota / private mode */
  }
}

/**
 * Carrega conteúdo do CMS sem flash do fallback hardcoded.
 * 1) Usa cache da sessão (último valor bom) no primeiro paint
 * 2) Busca API e atualiza
 * 3) Só cai no fallback se a API falhar e não houver cache
 */
export function useCmsContent(cacheKey, fetcher, { fallback, isValid }) {
  const [content, setContent] = useState(() => readCache(cacheKey))
  const [status, setStatus] = useState(() =>
    readCache(cacheKey) ? 'ready' : 'loading',
  )
  const fetcherRef = useRef(fetcher)
  const fallbackRef = useRef(fallback)
  const isValidRef = useRef(isValid)
  fetcherRef.current = fetcher
  fallbackRef.current = fallback
  isValidRef.current = isValid

  useEffect(() => {
    let active = true

    fetcherRef
      .current()
      .then((remote) => {
        if (!active) return
        if (remote && isValidRef.current(remote)) {
          writeCache(cacheKey, remote)
          setContent(remote)
          setStatus('ready')
          return
        }
        setContent((prev) => prev ?? fallbackRef.current)
        setStatus('ready')
      })
      .catch(() => {
        if (!active) return
        setContent((prev) => prev ?? fallbackRef.current)
        setStatus('ready')
      })

    return () => {
      active = false
    }
  }, [cacheKey])

  return { content, status, ready: status === 'ready' && Boolean(content) }
}
