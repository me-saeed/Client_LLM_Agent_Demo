'use client'

import { useState } from 'react'
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
  type UniqueIdentifier,
} from '@dnd-kit/core'
import TicketColumn from './_modules/ticketColumn'
import TicketBoardHeader from './_modules/ticketBoardHeader'
import TicketItem from './_modules/ticketItem'

const COLUMN_STATUSES: Ticket['status'][] = ['OPEN', 'IN_PROGRESS', 'RESOLVED']

const INITIAL_TICKETS: Ticket[] = [
  {
    id: 1,
    title: 'Ticket 1',
    description: 'Description 1',
    customerName: 'Customer 1',
    customerEmail: 'customer1@example.com',
    status: 'OPEN',
    priority: 'LOW',
    createdAt: '2021-01-01',
  },
  {
    id: 2,
    title: 'Ticket 2',
    description: 'Description 2',
    customerName: 'Customer 2',
    customerEmail: 'customer2@example.com',
    status: 'IN_PROGRESS',
    priority: 'MEDIUM',
    createdAt: '2021-01-02',
  },
  {
    id: 3,
    title: 'Ticket 3',
    description: 'Description 3',
    customerName: 'Customer 3',
    customerEmail: 'customer3@example.com',
    status: 'RESOLVED',
    priority: 'HIGH',
    createdAt: '2021-01-03',
  },
]

const getTargetStatus = (
  overId: UniqueIdentifier,
  tickets: Ticket[]
): Ticket['status'] | null => {
  if (COLUMN_STATUSES.includes(overId as Ticket['status'])) {
    return overId as Ticket['status']
  }

  const ticket = tickets.find((t) => t.id === overId)
  return ticket?.status ?? null
}

export default function TicketBoard() {
  const [tickets, setTickets] = useState<Ticket[]>(INITIAL_TICKETS)
  const [activeTicket, setActiveTicket] = useState<Ticket | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    })
  )

  const handleDragStart = (event: DragStartEvent) => {
    const ticket = tickets.find((t) => t.id === event.active.id)
    setActiveTicket(ticket ?? null)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    setActiveTicket(null)

    if (!over) return

    const ticketId = active.id
    const newStatus = getTargetStatus(over.id, tickets)
    if (!newStatus) return

    setTickets((prev) =>
      prev.map((ticket) =>
        ticket.id === ticketId ? { ...ticket, status: newStatus } : ticket
      )
    )
  }

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <TicketBoardHeader />
      <div className="container mx-auto px-4 py-8 h-full">
        <main className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-full">
          <TicketColumn
            title="Open"
            status="OPEN"
            tickets={tickets.filter((t) => t.status === 'OPEN')}
          />
          <TicketColumn
            title="In Progress"
            status="IN_PROGRESS"
            tickets={tickets.filter((t) => t.status === 'IN_PROGRESS')}
          />
          <TicketColumn
            title="Resolved"
            status="RESOLVED"
            tickets={tickets.filter((t) => t.status === 'RESOLVED')}
          />
        </main>
      </div>
      <DragOverlay>
        {activeTicket ? <TicketItem ticket={activeTicket} isOverlay /> : null}
      </DragOverlay>
    </DndContext>
  )
}
