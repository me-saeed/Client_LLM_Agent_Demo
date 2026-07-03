'use client'

import React from 'react'
import clsx from 'clsx'
import { useDroppable } from '@dnd-kit/core'
import TicketItem from '../ticketItem'

type TicketColumnProps = {
  title: string
  status: Ticket['status']
  tickets: Ticket[]
}

const TicketColumn: React.FC<TicketColumnProps> = ({ title, status, tickets }) => {
  const { setNodeRef, isOver } = useDroppable({
    id: status,
    data: { status },
  })

  return (
    <div
      ref={setNodeRef}
      className={clsx(
        'bg-gray-100 p-4 rounded-lg h-fit max-h-screen lg:h-full min-h-48 transition-colors',
        isOver && 'ring-2 ring-blue-500 bg-blue-50'
      )}
    >
      <h2 className="text-lg font-bold text-center text-gray-800">{title}</h2>
      <div className="flex flex-col gap-2 mt-4 w-full">
        {tickets.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-8">Drop tickets here</p>
        ) : (
          tickets.map((ticket) => <TicketItem key={ticket.id} ticket={ticket} />)
        )}
      </div>
    </div>
  )
}

export default TicketColumn
