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