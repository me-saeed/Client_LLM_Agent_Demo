import { create } from 'zustand'
import { createTicket, fetchTickets, updateTicketStatus } from './ticket.api'

type TicketState = {
  tickets: Ticket[]
  activeTicket: Ticket | null
  search: string
  isLoading: boolean
  error: string | null
  loadTickets: () => Promise<void>
  setSearch: (search: string) => void
  setActiveTicket: (ticket: Ticket | null) => void
  createTicket: (payload: Omit<Ticket, 'id' | 'createdAt'>) => Promise<void>
  updateTicketStatus: (id: string, status: Ticket['status']) => void
}

export const useTicketStore = create<TicketState>((set, get) => ({
  tickets: [],
  activeTicket: null,
  search: '',
  isLoading: false,
  error: null,
  loadTickets: async () => {
    set({ isLoading: true, error: null })
    try {
      const { search } = get()
      const tickets = await fetchTickets({ search: search || undefined })
      set({ tickets, isLoading: false, error: null })
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : 'Unknown error',
        isLoading: false,
      })
    }
  },
  setSearch: (search) => set({ search }),
  setActiveTicket: (ticket) => set({ activeTicket: ticket }),
  createTicket: async (payload) => {
    try {
      const newTicket = await createTicket(payload)
      set((state) => ({
        tickets: [...state.tickets, newTicket],
        error: null,
      }))
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : 'Unknown error',
      })
    }
  },
  updateTicketStatus: async (id, status) => {
    try {
      set((state) => ({
        tickets: state.tickets.map((t) =>
          t.id === id ? { ...t, status } : t
        ),
        error: null,
      }))
      await updateTicketStatus(id, status)
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : 'Unknown error',
      })
    }
  },
}))