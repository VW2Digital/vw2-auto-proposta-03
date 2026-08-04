import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, Loader2, AlertCircle } from 'lucide-react'
import { useProposalStore } from '../store/proposalStore'
import { useServices } from '../hooks/useServices'
import { cms } from '../lib/cms'

const initialForm = {
  fullName: '',
  email: '',
  whatsapp: '',
  company: '',
  website: '',
  message: '',
}

function validate(form) {
  const errors = {}
  if (!form.fullName.trim() || form.fullName.trim().length < 3) {
    errors.fullName = 'Informe seu nome completo'
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
    errors.email = 'E-mail inválido'
  }
  const digits = form.whatsapp.replace(/\D/g, '')
  if (digits.length < 10 || digits.length > 13) {
    errors.whatsapp = 'WhatsApp inválido'
  }
  if (!form.company.trim()) {
    errors.company = 'Informe o nome da empresa'
  }
  if (form.website && form.website.trim()) {
    try {
      const url = form.website.startsWith('http') ? form.website : `https://${form.website}`
      new URL(url)
    } catch {
      errors.website = 'URL inválida'
    }
  }
  return errors
}

function formatWhatsapp(value) {
  const digits = value.replace(/\D/g, '').slice(0, 11)
  if (digits.length <= 2) return digits
  if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`
}

export default function ProposalForm() {
  const [form, setForm] = useState(initialForm)
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle')
  const [submitError, setSubmitError] = useState('')
  const selectedServices = useProposalStore((s) => s.selectedServices)
  const clearSelection = useProposalStore((s) => s.clearSelection)
  const services = useServices()

  const selectedList = services.filter((s) => selectedServices[s.id])

  const handleChange = (field) => (e) => {
    let value = e.target.value
    if (field === 'whatsapp') value = formatWhatsapp(value)
    setForm((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitError('')
    if (selectedList.length === 0) {
      setStatus('error')
      return
    }
    const nextErrors = validate(form)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) {
      setStatus('idle')
      return
    }

    setStatus('loading')

    const servicesPayload = selectedList.map((s) => ({
      id: s.id,
      serviceId: s.id,
      title: s.title,
      notes: selectedServices[s.id]?.notes || '',
    }))

    try {
      await cms.createProposal({
        fullName: form.fullName,
        email: form.email,
        whatsapp: form.whatsapp,
        company: form.company,
        website: form.website || undefined,
        message: form.message || undefined,
        services: servicesPayload,
        status: 'nova',
      })
      setStatus('success')
      setForm(initialForm)
      clearSelection()
    } catch (err) {
      setStatus('error')
      setSubmitError(
        err.message ||
          'Não foi possível enviar. Verifique se o CMS está online e tente novamente.',
      )
    }
  }

  if (status === 'success') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center rounded-3xl border border-line bg-white p-8 text-center"
      >
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
          <CheckCircle2 size={28} />
        </span>
        <h3 className="mt-4 text-xl font-bold text-ink">Proposta solicitada!</h3>
        <p className="mt-2 max-w-md text-sm text-muted">
          Recebemos seus dados. Nossa equipe analisa no CMS e retorna com a proposta formalizada
          em breve.
        </p>
        <button
          type="button"
          onClick={() => setStatus('idle')}
          className="btn-h mt-6 inline-flex items-center rounded-full bg-ink px-6 text-sm font-semibold text-white"
        >
          Montar nova proposta
        </button>
      </motion.div>
    )
  }

  return (
    <form
      id="proposal-form"
      onSubmit={handleSubmit}
      className="rounded-3xl border border-line bg-white p-6 sm:p-8"
      noValidate
    >
      <h3 className="text-lg font-bold text-ink">Seus dados</h3>
      <p className="mt-1 text-sm text-muted">
        Preencha para recebermos e formalizarmos sua proposta.
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <Field
          label="Nome completo"
          required
          error={errors.fullName}
          value={form.fullName}
          onChange={handleChange('fullName')}
          placeholder="Seu nome"
        />
        <Field
          label="E-mail"
          type="email"
          required
          error={errors.email}
          value={form.email}
          onChange={handleChange('email')}
          placeholder="voce@empresa.com"
        />
        <Field
          label="WhatsApp"
          required
          error={errors.whatsapp}
          value={form.whatsapp}
          onChange={handleChange('whatsapp')}
          placeholder="(11) 99999-9999"
        />
        <Field
          label="Nome da empresa"
          required
          error={errors.company}
          value={form.company}
          onChange={handleChange('company')}
          placeholder="Sua empresa"
        />
        <Field
          label="Site atual"
          className="sm:col-span-2"
          error={errors.website}
          value={form.website}
          onChange={handleChange('website')}
          placeholder="www.exemplo.com.br (opcional)"
        />
        <div className="sm:col-span-2">
          <label className="mb-1.5 block text-sm font-medium text-ink">Mensagem adicional</label>
          <textarea
            rows={3}
            value={form.message}
            onChange={handleChange('message')}
            placeholder="Conte um pouco sobre seus objetivos..."
            className="w-full resize-none rounded-2xl border border-line bg-white px-3.5 py-2.5 text-sm outline-none transition placeholder:text-muted-light focus:border-ink focus:ring-2 focus:ring-ink/10"
          />
        </div>
      </div>

      <AnimatePresence>
        {status === 'error' && selectedList.length === 0 && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-4 flex items-center gap-2 text-sm text-red-600"
          >
            <AlertCircle size={16} />
            Selecione ao menos um serviço antes de enviar.
          </motion.p>
        )}
        {submitError && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-4 flex items-center gap-2 text-sm text-red-600"
          >
            <AlertCircle size={16} />
            {submitError}
          </motion.p>
        )}
      </AnimatePresence>

      <button
        type="submit"
        disabled={status === 'loading'}
        className="btn-h mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-ink text-sm font-semibold text-white transition hover:bg-ink-soft disabled:opacity-70 sm:w-auto sm:px-8"
      >
        {status === 'loading' ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            Enviando...
          </>
        ) : (
          'Solicitar Proposta'
        )}
      </button>
    </form>
  )
}

function Field({ label, error, required, className = '', type = 'text', ...props }) {
  return (
    <div className={className}>
      <label className="mb-1.5 block text-sm font-medium text-ink">
        {label}
        {required && <span className="text-muted"> *</span>}
      </label>
      <input
        type={type}
        className={`input-h w-full rounded-full border bg-white px-4 text-sm outline-none transition placeholder:text-muted-light focus:ring-2 ${
          error
            ? 'border-red-400 focus:border-red-400 focus:ring-red-100'
            : 'border-line focus:border-ink focus:ring-ink/10'
        }`}
        {...props}
      />
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  )
}
