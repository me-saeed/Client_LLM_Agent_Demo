/**
 * Socket.IO module.
 *
 * Manages the real-time WebSocket server attached to the HTTP server.
 * Controllers use `getIO()` to broadcast events to connected clients.
 */
import { Server as HttpServer } from 'http';
import { Server } from 'socket.io';

/** Singleton Socket.IO server instance, set after `initSocket` runs. */
let io: Server | null = null;

/**
 * Attaches Socket.IO to the HTTP server and registers connection handlers.
 *
 * @param httpServer - The Node HTTP server created from the Express app.
 * @returns The initialized Socket.IO server instance.
 */
export function initSocket(httpServer: HttpServer) {
  io = new Server(httpServer, {
    cors: {
      origin: '*',
    },
  });

  io.on('connection', (socket) => {
    console.log(`Socket connected: ${socket.id}`);

    socket.on('disconnect', () => {
      console.log(`Socket disconnected: ${socket.id}`);
    });
  });

  return io;
}

/**
 * Returns the active Socket.IO server instance.
 *
 * @throws If called before `initSocket` has been executed.
 */
export function getIO() {
  if (!io) {
    throw new Error('Socket.io not initialized');
  }
  return io;
}
