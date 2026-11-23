import { create } from 'zustand'
import { persist } from 'zustand/middleware'

/** Seleção de serviços na montagem da proposta (local). As propostas vão para o CMS. */
export const useProposalStore = create(
  persist(
    (set, get) => ({
      selectedServices: {},
      toggleService: (serviceId) => {
        const current = get().selectedServices
        if (current[serviceId]) {
          const next = { ...current }
          delete next[serviceId]
          set({ selectedServices: next })
        } else {
          set({
            selectedServices: {
              ...current,
              [serviceId]: { notes: '' },
            },
          })
        }
      },
      setServiceNotes: (serviceId, notes) => {
        const current = get().selectedServices
        if (!current[serviceId]) return
        set({
          selectedServices: {
            ...current,
            [serviceId]: { ...current[serviceId], notes },
          },
        })
      },
      clearSelection: () => set({ selectedServices: {} }),
      isSelected: (serviceId) => Boolean(get().selectedServices[serviceId]),
      selectedCount: () => Object.keys(get().selectedServices).length,
    }),
    { name: 'nexo-proposal-selection' }
  )
)
