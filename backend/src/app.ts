/**
 * Express application factory.
 *
 * Builds and configures the Express app without starting the HTTP server.
 * Used by `server.ts` at runtime and by automated tests via Supertest.
 */
import express from 'express';
import cors from 'cors';
import appRouter from './routers';

export function createApp() {
  const app = express();

  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(appRouter);

  return app;
}

export default createApp();
