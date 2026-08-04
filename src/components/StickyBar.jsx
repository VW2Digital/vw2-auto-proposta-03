import { useEffect, useState } from 'react'
import { useProposalStore } from '../store/proposalStore'
import { AnimatePresence, motion } from 'framer-motion'
import { FileText } from 'lucide-react'

export default function StickyBar() {
  const selectedServices = useProposalStore((s) => s.selectedServices)
  const count = Object.keys(selectedServices).length
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => {
      const proposal = document.querySelector('#proposta')
      if (!proposal) return
      const rect = proposal.getBoundingClientRect()
      const inProposal =
        rect.top < window.innerHeight * 0.6 && rect.bottom > window.innerHeight * 0.3
      setVisible(count > 0 && !inProposal)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [count])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          className="fixed inset-x-0 bottom-0 z-40 p-4 md:hidden"
        >
          <button
            type="button"
            onClick={() =>
              document.querySelector('#proposta')?.scrollIntoView({ behavior: 'smooth' })
            }
            className="btn-h flex w-full items-center justify-center gap-2 rounded-full bg-ink text-sm font-semibold text-white shadow-xl shadow-black/20"
          >
            <FileText size={16} />
            {count} serviço{count > 1 ? 's' : ''} — Ver proposta
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
