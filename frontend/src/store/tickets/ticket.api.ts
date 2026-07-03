type FetchTicketsParams = {
  search?: string
  status?: Ticket['status']
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}


export async function fetchTickets(params: FetchTicketsParams = {}) {
  const query = new URLSearchParams()
  if (params.search) query.set('search', params.search)
  if (params.status) query.set('status', params.status)
  if (params.sortBy) query.set('sortBy', params.sortBy)
  if (params.sortOrder) query.set('sortOrder', params.sortOrder)
  const res = await fetch(`/api/ticket?${query.toString()}`)
  if (!res.ok) {
    const error = await res.json().catch(() => ({}))
    throw new Error(error.message ?? 'Failed to fetch tickets')
  }
  const data = await res.json()
  return data.tickets as Ticket[]
}

export async function createTicket(payload: Omit<Ticket, 'id' | 'createdAt'>) {
  const res = await fetch('/api/ticket', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  if (!res.ok) throw new Error('Failed to create ticket')
  return res.json()
}

export async function updateTicketStatus(id: string, status: Ticket['status']) {
  const res = await fetch(`/api/ticket/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  })
  if (!res.ok) throw new Error('Failed to update ticket')
  return res.json()
}