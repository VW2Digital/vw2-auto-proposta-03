'use client'

import React, { useCallback, useState } from 'react'
import { Button } from '@payloadcms/ui'

/**
 * Recarrega o iframe do Live Preview (limpa cache no front via `?_refresh=`).
 */
export function RefreshPreviewButton() {
  const [busy, setBusy] = useState(false)

  const refresh = useCallback(() => {
    const iframe = document.getElementById(
      'live-preview-iframe',
    ) as HTMLIFrameElement | null

    if (!iframe) {
      window.alert('Abra o Live Preview para atualizar o preview.')
      return
    }

    setBusy(true)

    try {
      iframe.contentWindow?.postMessage({ type: 'nexo-preview-refresh' }, '*')
    } catch {
      /* cross-origin — o reload abaixo cobre */
    }

    const src = iframe.getAttribute('src') || iframe.src
    if (src) {
      const url = new URL(src, window.location.href)
      url.searchParams.set('_refresh', String(Date.now()))
      iframe.src = url.toString()
    }

    window.setTimeout(() => setBusy(false), 800)
  }, [])

  return (
    <Button buttonStyle="secondary" disabled={busy} onClick={refresh} size="small">
      {busy ? 'Atualizando…' : 'Atualizar preview'}
    </Button>
  )
}
