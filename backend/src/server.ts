/**
 * Application entry point.
 *
 * Boots the Express HTTP server, connects to MongoDB, attaches Socket.IO,
 * and registers global middleware plus all API routes.
 */
import http from 'http';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { createApp } from './app';
import { initSocket } from './lib/socket';

const port = process.env.PORT || 5000;

dotenv.config();

const app = createApp();
const httpServer = http.createServer(app);
initSocket(httpServer);

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/aurexillion');
console.log(`Connected to MongoDB on ${process.env.MONGODB_URI}`);

httpServer.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
