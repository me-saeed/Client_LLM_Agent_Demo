'use client'

import React, { useEffect, useRef } from 'react'
import clsx from 'clsx'
import { useDraggable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import { useTicketStore } from '@/src/store/tickets/useTicketStore'

type TicketItemProps = {
  ticket: Ticket
  isOverlay?: boolean
}

const TicketItemContent: React.FC<{ ticket: Ticket; isDragging: boolean }> = ({
  ticket,
  isDragging,
}) => {
  const { setActiveTicket } = useTicketStore()
  const wasDraggingRef = useRef(false)

  useEffect(() => {
    if (isDragging) {
      wasDraggingRef.current = true
    }
  }, [isDragging])

  const handleClick = () => {
    if (wasDraggingRef.current) {
      wasDraggingRef.current = false
      return
    }
    setActiveTicket(ticket)
  }

  return (
    <a onClick={handleClick}>
      <div
        className={clsx(
          'absolute top-2 right-2 w-fit py-1 px-2 text-xs rounded-full capitalize text-gray-800',
          {
            'bg-green-500/50': ticket.status === 'OPEN',
            'bg-yellow-500/50': ticket.status === 'IN_PROGRESS',
            'bg-blue-500/50': ticket.status === 'RESOLVED',
          }
        )}
      >
        {ticket.status.replace('_', ' ')}
      </div>
      <h3 className="text-lg font-bold text-gray-800">{ticket.title}</h3>
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm text-gray-500">{ticket.customerName}</p>
        <div
          className={clsx('w-fit px-1 text-xs rounded-full capitalize', {
            'bg-green-500': ticket.priority === 'LOW',
            'bg-yellow-500': ticket.priority === 'MEDIUM',
            'bg-red-500': ticket.priority === 'HIGH',
          })}
        >
          {ticket.priority}
        </div>
      </div>
    </a>
  )
}

const TicketItem: React.FC<TicketItemProps> = ({ ticket, isOverlay = false }) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: ticket.id,
    data: { ticket },
    disabled: isOverlay,
  })

  const style = transform
    ? { transform: CSS.Translate.toString(transform) }
    : undefined

  return (
    <div
      ref={isOverlay ? undefined : setNodeRef}
      style={style}
      {...(isOverlay ? {} : listeners)}
      {...(isOverlay ? {} : attributes)}
      className={clsx(
        'bg-white p-4 rounded-lg shadow-md relative touch-none',
        isOverlay
          ? 'cursor-grabbing shadow-lg rotate-2'
          : 'cursor-grab active:cursor-grabbing',
        isDragging && !isOverlay && 'opacity-40'
      )}
    >
      <TicketItemContent ticket={ticket} isDragging={isDragging} />
    </div>
  )
}

export default TicketItem
