'use client'

import { useEffect, useState } from 'react'
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
import { useTicketStore } from '@/src/store/tickets/useTicketStore'
import TicketDetailForm from './_modules/ticketDetailForm'
import Banner from '../../_basic/banner'

const COLUMN_STATUSES: Ticket['status'][] = ['OPEN', 'IN_PROGRESS', 'RESOLVED']

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
  const { loadTickets, tickets, updateTicketStatus, error, activeTicket, setActiveTicket } =
    useTicketStore()
  const [draggedTicket, setDraggedTicket] = useState<Ticket | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    })
  )

  const handleDragStart = (event: DragStartEvent) => {
    const ticket = tickets.find((t) => t.id === event.active.id)
    setDraggedTicket(ticket ?? null)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    setDraggedTicket(null)

    if (!over) return

    const ticketId = active.id
    const newStatus = getTargetStatus(over.id, tickets)
    if (!newStatus) return

    updateTicketStatus(ticketId as string, newStatus)
  }

  useEffect(() => {
    loadTickets()
  }, [])

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
        {draggedTicket ? <TicketItem ticket={draggedTicket} isOverlay /> : null}
      </DragOverlay>
      {!error ? <Banner description={error ?? "dd"} variant="error" /> : null}
      <TicketDetailForm open={!!activeTicket} onClose={() => setActiveTicket(null)} ticket={activeTicket} />
    </DndContext>
  )
}
