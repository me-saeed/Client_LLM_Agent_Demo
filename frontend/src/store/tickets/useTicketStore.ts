import { create } from 'zustand'
import { fetchTickets } from './ticket.api'

type TicketState = {
  tickets: Ticket[]
  activeTicket: Ticket | null
  search: string
  isLoading: boolean
  error: string | null
  isCreateFormOpen: boolean
  // actions
  loadTickets: () => Promise<void>
  setSearch: (search: string) => void
  setActiveTicket: (ticket: Ticket | null) => void
  updateTicketStatus: (id: string, status: Ticket['status']) => void
  openCreateForm: () => void
  closeCreateForm: () => void
}

export const useTicketStore = create<TicketState>((set, get) => ({
  tickets: [],
  activeTicket: null,
  search: '',
  isLoading: false,
  error: null,
  isCreateFormOpen: false,
  loadTickets: async () => {
    set({ isLoading: true, error: null })
    try {
      const { search } = get()
      const tickets = await fetchTickets({ search: search || undefined })
      set({ tickets, isLoading: false })
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : 'Unknown error',
        isLoading: false,
      })
    }
  },
  setSearch: (search) => set({ search }),
  setActiveTicket: (ticket) => set({ activeTicket: ticket }),
  updateTicketStatus: (id, status) =>
    set((state) => ({
      tickets: state.tickets.map((t) =>
        t.id === id ? { ...t, status } : t
      ),
    })),
  openCreateForm: () => set({ isCreateFormOpen: true }),
  closeCreateForm: () => set({ isCreateFormOpen: false }),
}))