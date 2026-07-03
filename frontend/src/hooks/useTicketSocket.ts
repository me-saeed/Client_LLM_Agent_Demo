'use client'

import { useEffect } from 'react'
import { getSocket } from '@/src/lib/socket'
import { mapTicket } from '@/src/lib/mapTicket'
import { useTicketStore } from '@/src/store/tickets/useTicketStore'

type TicketSocketPayload = {
  ticket: Record<string, unknown> | null
}

export function useTicketSocket() {
  useEffect(() => {
    const socket = getSocket()
    socket.connect()

    const onTicketCreated = (payload: TicketSocketPayload) => {
      if (!payload.ticket) return
      useTicketStore.getState().applyTicketCreated(mapTicket(payload.ticket))
    }

    const onTicketUpdated = (payload: TicketSocketPayload) => {
      if (!payload.ticket) return
      useTicketStore.getState().applyTicketUpdated(mapTicket(payload.ticket))
    }

    socket.on('ticket:created', onTicketCreated)
    socket.on('ticket:updated', onTicketUpdated)

    return () => {
      socket.off('ticket:created', onTicketCreated)
      socket.off('ticket:updated', onTicketUpdated)
      socket.disconnect()
    }
  }, [])
}
