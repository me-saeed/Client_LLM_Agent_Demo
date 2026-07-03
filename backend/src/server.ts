import http from 'http';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { createApp } from './app';
import { initSocket } from './lib/socket';
import cors from 'cors';

const corsOptions = {
  origin: 'http://localhost:3000',
  credentials: true,
};
const port = process.env.PORT || 5000;

dotenv.config();

const app = createApp();
app.use(cors(corsOptions));
const httpServer = http.createServer(app);
initSocket(httpServer);

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/aurexillion');

httpServer.listen(port);
