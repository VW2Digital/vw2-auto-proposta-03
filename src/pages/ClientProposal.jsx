import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { AlertCircle, CheckCircle2, Lock, MessageCircle, ShieldCheck } from 'lucide-react'
import { cms } from '../lib/cms'
import { Markdown } from '../components/Markdown'
import Logo from '../components/Logo'

function authKey(token) {
  return `nexo-proposal-unlocked-${token}`
}

function formatDate(iso) {
  if (!iso) return ''
  return new Intl.DateTimeFormat('pt-BR', { dateStyle: 'long' }).format(new Date(iso))
}

export default function ClientProposal() {
  const { token } = useParams()
  const [mode, setMode] = useState('loading') // loading | ready | missing
  const [proposal, setProposal] = useState(null)
  const [unlocked, setUnlocked] = useState(false)
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [negotiateOpen, setNegotiateOpen] = useState(false)
  const [negotiateMsg, setNegotiateMsg] = useState('')
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    let active = true
    ;(async () => {
      try {
        await cms.unlockProposal(token, '__probe__')
      } catch (err) {
        const msg = String(err.message || '')
        if (msg.includes('Senha incorreta')) {
          if (active) setMode('ready')
          return
        }
        if (msg.includes('não encontrada') || msg.includes('404')) {
          if (active) setMode('missing')
          return
        }
      }
      if (active) setMode('ready')
    })()
    return () => {
      active = false
    }
  }, [token])

  const handleUnlock = async (e) => {
    e.preventDefault()
    setBusy(true)
    setError('')
    try {
      const data = await cms.unlockProposal(token, password.trim())
      setProposal(data)
      sessionStorage.setItem(authKey(token), '1')
      setUnlocked(true)
    } catch (err) {
      setError(err.message || 'Senha incorreta. Tente novamente.')
    } finally {
      setBusy(false)
    }
  }

  const handleAccept = async () => {
    if (!password.trim()) {
      setError('Confirme a senha para responder.')
      return
    }
    setBusy(true)
    setError('')
    try {
      const data = await cms.respondProposal(token, password.trim(), 'accept')
      setProposal((p) => ({ ...p, ...data, clientResponse: 'accept' }))
      setNegotiateOpen(false)
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  const handleNegotiate = async (e) => {
    e.preventDefault()
    if (!password.trim()) {
      setError('Confirme a senha para responder.')
      return
    }
    setBusy(true)
    setError('')
    try {
      const data = await cms.respondProposal(
        token,
        password.trim(),
        'negotiate',
        negotiateMsg.trim(),
      )
      setProposal((p) => ({
        ...p,
        ...data,
        clientResponse: 'negotiate',
        negotiateMessage: negotiateMsg.trim(),
      }))
      setNegotiateOpen(false)
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  const responded = proposal?.clientResponse

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-line">
        <div className="mx-auto flex h-16 max-w-3xl items-center justify-center px-4">
          <Logo />
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-12 sm:py-16">
        {mode === 'loading' && (
          <p className="text-center text-sm text-muted">Carregando proposta...</p>
        )}

        {mode === 'missing' && (
          <EmptyState
            title="Proposta ainda não disponível"
            text="Assim que a agência formalizar e enviar, você poderá acessá-la aqui com a senha."
          />
        )}

        {mode === 'ready' && !unlocked && (
          <div className="mx-auto max-w-md">
            <div className="mb-8 text-center">
              <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-surface text-ink">
                <Lock size={20} />
              </span>
              <h1 className="mt-4 text-2xl font-bold text-ink">Proposta protegida</h1>
              <p className="mt-2 text-sm text-muted">
                Digite a senha enviada pela Nexo Studio para visualizar sua proposta.
              </p>
            </div>

            <form onSubmit={handleUnlock} className="rounded-3xl border border-line bg-surface p-6">
              <label className="mb-1.5 block text-sm font-medium text-ink">Senha de acesso</label>
              <input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value)
                  if (error) setError('')
                }}
                autoFocus
                placeholder="••••••••"
                className="input-h w-full rounded-full border border-line bg-white px-4 text-sm outline-none focus:border-ink focus:ring-2 focus:ring-ink/10"
              />
              {error && (
                <p className="mt-2 flex items-center gap-1.5 text-sm text-red-600">
                  <AlertCircle size={14} />
                  {error}
                </p>
              )}
              <button
                type="submit"
                disabled={busy}
                className="btn-h mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full bg-ink text-sm font-semibold text-white disabled:opacity-70"
              >
                <ShieldCheck size={16} />
                {busy ? 'Validando...' : 'Acessar proposta'}
              </button>
            </form>
          </div>
        )}

        {unlocked && proposal && (
          <div>
            <p className="text-sm text-muted">
              Proposta para <span className="font-semibold text-ink">{proposal.company}</span>
              {proposal.sentAt ? ` · enviada em ${formatDate(proposal.sentAt)}` : ''}
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-ink">
              Sua proposta comercial
            </h1>
            <p className="mt-1 text-sm text-muted">Olá, {proposal.fullName}.</p>

            {proposal.formalMessage && (
              <div className="mt-8 rounded-3xl border border-line bg-surface p-6">
                <p className="text-xs font-semibold tracking-wide text-muted uppercase">
                  Mensagem da Nexo Studio
                </p>
                <div className="mt-3">
                  <Markdown content={proposal.formalMessage} />
                </div>
              </div>
            )}

            <div className="mt-8">
              <h2 className="text-lg font-bold text-ink">Serviços incluídos</h2>
              <ul className="mt-4 space-y-3">
                {proposal.services?.map((s) => (
                  <li
                    key={s.serviceId || s.id || s.title}
                    className="rounded-2xl border border-line px-4 py-3.5"
                  >
                    <p className="text-sm font-semibold uppercase text-ink">{s.title}</p>
                    {s.notes && <p className="mt-1 text-sm text-muted">Observação: {s.notes}</p>}
                  </li>
                ))}
              </ul>
            </div>

            {proposal.formalPrice && (
              <div className="mt-8 rounded-3xl bg-ink px-6 py-5 text-white">
                <p className="text-xs font-semibold tracking-wide text-white/55 uppercase">
                  Investimento
                </p>
                <p className="mt-1 font-serif text-3xl italic">{proposal.formalPrice}</p>
              </div>
            )}

            {error && (
              <p className="mt-6 flex items-center gap-1.5 text-sm text-red-600">
                <AlertCircle size={14} />
                {error}
              </p>
            )}

            {responded === 'accept' && (
              <div className="mt-10 flex flex-col items-center rounded-3xl border border-emerald-200 bg-emerald-50 px-6 py-10 text-center">
                <CheckCircle2 className="text-emerald-600" size={36} />
                <h3 className="mt-3 text-xl font-bold text-ink">Proposta aceita</h3>
                <p className="mt-2 max-w-md text-sm text-muted">
                  Obrigado! Nossa equipe foi notificada e entrará em contato para os próximos passos.
                </p>
              </div>
            )}

            {responded === 'negotiate' && (
              <div className="mt-10 flex flex-col items-center rounded-3xl border border-amber-200 bg-amber-50 px-6 py-10 text-center">
                <MessageCircle className="text-amber-600" size={36} />
                <h3 className="mt-3 text-xl font-bold text-ink">Negociação solicitada</h3>
                <p className="mt-2 max-w-md text-sm text-muted">
                  Recebemos seu pedido. Vamos analisar e retornar em breve.
                </p>
                {proposal.negotiateMessage && (
                  <p className="mt-4 max-w-md rounded-2xl bg-white px-4 py-3 text-left text-sm text-ink">
                    “{proposal.negotiateMessage}”
                  </p>
                )}
              </div>
            )}

            {!responded && (
              <div className="mt-10 border-t border-line pt-8">
                <h2 className="text-lg font-bold text-ink">Sua decisão</h2>
                <p className="mt-1 text-sm text-muted">
                  Aceite a proposta como está ou solicite uma negociação.
                </p>

                <div className="mt-4">
                  <label className="mb-1.5 block text-sm font-medium text-ink">
                    Confirme a senha para responder
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Senha da proposta"
                    className="input-h w-full max-w-sm rounded-full border border-line bg-white px-4 text-sm outline-none focus:border-ink focus:ring-2 focus:ring-ink/10"
                  />
                </div>

                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                  <button
                    type="button"
                    disabled={busy}
                    onClick={handleAccept}
                    className="btn-h inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-ink text-sm font-semibold text-white disabled:opacity-70"
                  >
                    <CheckCircle2 size={16} />
                    Aceitar proposta
                  </button>
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => setNegotiateOpen((v) => !v)}
                    className="btn-h inline-flex flex-1 items-center justify-center gap-2 rounded-full border border-line bg-white text-sm font-semibold text-ink hover:bg-surface"
                  >
                    <MessageCircle size={16} />
                    Negociar
                  </button>
                </div>

                {negotiateOpen && (
                  <form
                    onSubmit={handleNegotiate}
                    className="mt-4 rounded-3xl border border-line bg-surface p-5"
                  >
                    <label className="mb-1.5 block text-sm font-medium text-ink">
                      O que você gostaria de negociar?
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={negotiateMsg}
                      onChange={(e) => setNegotiateMsg(e.target.value)}
                      placeholder="Ex.: prazo, escopo, valores, forma de pagamento..."
                      className="w-full resize-none rounded-2xl border border-line bg-white px-3.5 py-2.5 text-sm outline-none focus:border-ink focus:ring-2 focus:ring-ink/10"
                    />
                    <button
                      type="submit"
                      disabled={busy}
                      className="btn-h mt-3 inline-flex items-center rounded-full bg-ink px-6 text-sm font-semibold text-white disabled:opacity-70"
                    >
                      Enviar pedido de negociação
                    </button>
                  </form>
                )}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  )
}

function EmptyState({ title, text }) {
  return (
    <div className="mx-auto max-w-md text-center">
      <h1 className="text-2xl font-bold text-ink">{title}</h1>
      <p className="mt-2 text-sm text-muted">{text}</p>
      <Link
        to="/"
        className="btn-h mt-6 inline-flex items-center rounded-full bg-ink px-6 text-sm font-semibold text-white"
      >
        Voltar ao site
      </Link>
    </div>
  )
}
