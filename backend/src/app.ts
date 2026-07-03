import express from 'express';
import cors from 'cors';
import appRouter from './routers';

export function createApp() {
  const app = express();

  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use('/api', appRouter);

  return app;
}

export default createApp();
