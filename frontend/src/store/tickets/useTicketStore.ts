import { create } from 'zustand'
import { createTicket, fetchTickets, updateTicketStatus } from './ticket.api'

const ticketMatchesFilters = (
  ticket: Ticket,
  search: string,
  priority?: Ticket['priority']
) => {
  if (priority && ticket.priority !== priority) return false
  if (!search) return true

  const term = search.toLowerCase()
  return (
    ticket.title.toLowerCase().includes(term) ||
    ticket.customerName.toLowerCase().includes(term)
  )
}

type TicketState = {
  tickets: Ticket[]
  activeTicket: Ticket | null
  search: string
  priority?: Ticket['priority']
  isLoading: boolean
  error: string | null
  loadTickets: () => Promise<void>
  setSearch: (search: string) => void
  setPriority: (priority: Ticket['priority'] | undefined) => void
  setActiveTicket: (ticket: Ticket | null) => void
  applyTicketCreated: (ticket: Ticket) => void
  applyTicketUpdated: (ticket: Ticket) => void
  createTicket: (payload: Omit<Ticket, 'id' | 'createdAt'>) => Promise<void>
  updateTicketStatus: (id: string, status: Ticket['status']) => void
}

export const useTicketStore = create<TicketState>((set, get) => ({
  tickets: [],
  activeTicket: null,
  search: '',
  priority: undefined,
  isLoading: false,
  error: null,
  loadTickets: async () => {
    set({ isLoading: true, error: null })
    try {
      const { search, priority } = get()
      const tickets = await fetchTickets({ name_title: search || undefined, priority: priority || undefined })
      set({ tickets, isLoading: false, error: null })
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : 'Unknown error',
        isLoading: false,
      })
    }
  },
  setSearch: (search) => set({ search }),
  setPriority: (priority) => set({ priority }),
  setActiveTicket: (ticket) => set({ activeTicket: ticket }),
  applyTicketCreated: (ticket) => {
    const { search, priority } = get()
    if (!ticketMatchesFilters(ticket, search, priority)) return

    set((state) => {
      if (state.tickets.some((t) => t.id === ticket.id)) return state
      return { tickets: [...state.tickets, ticket], error: null }
    })
  },
  applyTicketUpdated: (ticket) => {
    const { search, priority } = get()

    set((state) => {
      const matches = ticketMatchesFilters(ticket, search, priority)
      const exists = state.tickets.some((t) => t.id === ticket.id)

      let tickets = state.tickets
      if (!matches) {
        tickets = tickets.filter((t) => t.id !== ticket.id)
      } else if (exists) {
        tickets = tickets.map((t) => (t.id === ticket.id ? ticket : t))
      } else {
        tickets = [...tickets, ticket]
      }

      return {
        tickets,
        activeTicket: state.activeTicket?.id === ticket.id ? ticket : state.activeTicket,
        error: null,
      }
    })
  },
  createTicket: async (payload) => {
    try {
      await createTicket(payload)
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