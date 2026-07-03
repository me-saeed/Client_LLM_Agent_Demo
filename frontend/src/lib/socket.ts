import { io, type Socket } from 'socket.io-client'

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL ?? 'http://localhost:5000'

let socket: Socket | null = null

export function getSocket() {
  if (!socket) {
    socket = io(BACKEND_URL, { autoConnect: false })
  }
  return socket
}
