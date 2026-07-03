/**
 * Root application router.
 *
 * Mounts all feature routers under a single Express router
 * that is attached to the main app in `server.ts`.
 */
import { Router } from 'express';
import ticketsRouter from './tickets.router';

const appRouter = Router();

appRouter.use('/tickets', ticketsRouter);

export default appRouter;
