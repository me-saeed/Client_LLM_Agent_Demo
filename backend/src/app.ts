import express from 'express';
import cors from 'cors';
import appRouter from './routers';
import { setupSwagger } from './lib/swagger';

export function createApp() {
  const app = express();

  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  setupSwagger(app);
  app.use('/api', appRouter);

  return app;
}

export default createApp();
