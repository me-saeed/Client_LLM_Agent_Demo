export function mapTicket(ticket: Record<string, unknown>): Ticket {
  return {
    id: String(ticket._id ?? ticket.id),
    title: String(ticket.title ?? ''),
    description: String(ticket.description ?? ''),
    customerName: String(ticket.customerName ?? ''),
    customerEmail: String(ticket.customerEmail ?? ''),
    status: ticket.status as Ticket['status'],
    priority: ticket.priority as Ticket['priority'],
    createdAt: ticket.createdAt ? String(ticket.createdAt) : new Date().toISOString(),
  }
}
