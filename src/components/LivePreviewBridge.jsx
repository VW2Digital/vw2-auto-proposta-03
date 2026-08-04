import { useEffect, useState } from 'react'
import { RefreshCw } from 'lucide-react'
import { clearCmsSessionCache } from '../lib/cmsCache'

function hardRefresh() {
  clearCmsSessionCache()
  const url = new URL(window.location.href)
  url.searchParams.set('_refresh', String(Date.now()))
  window.location.replace(url.toString())
}

function isInIframe() {
  try {
    return window.self !== window.top
  } catch {
    return true
  }
}

/**
 * Ponte com o Live Preview do Payload:
 * - avisa o admin que o front está pronto
 * - responde a "Atualizar preview" do CMS
 * - botão flutuante "Atualizar" dentro do iframe
 */
export default function LivePreviewBridge() {
  const [show, setShow] = useState(false)
  const [spinning, setSpinning] = useState(false)

  useEffect(() => {
    if (!isInIframe()) return

    setShow(true)

    window.parent.postMessage(
      { type: 'payload-live-preview', ready: true },
      '*',
    )

    const onMessage = (event) => {
      const data = event?.data
      if (!data || typeof data !== 'object') return
      if (data.type === 'nexo-preview-refresh') {
        hardRefresh()
      }
    }

    window.addEventListener('message', onMessage)
    return () => window.removeEventListener('message', onMessage)
  }, [])

  if (!show) return null

  return (
    <button
      type="button"
      onClick={() => {
        setSpinning(true)
        hardRefresh()
      }}
      className="fixed bottom-4 right-4 z-[100] inline-flex items-center gap-2 rounded-lg border border-line bg-white px-3.5 py-2 text-xs font-semibold text-ink shadow-md hover:bg-surface"
      title="Atualizar preview"
    >
      <RefreshCw size={14} className={spinning ? 'animate-spin' : ''} />
      Atualizar
    </button>
  )
}
