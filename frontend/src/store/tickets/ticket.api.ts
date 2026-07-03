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