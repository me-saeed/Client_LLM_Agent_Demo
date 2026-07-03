/**
 * Root application router.
 *
 * Mounts all feature routers under a single Express router
 * that is attached to the main app in `server.ts`.
 */
import { Router } from 'express';
import apiRouter from './api.router';

const appRouter = Router();

appRouter.use('/api', apiRouter);

export default appRouter;
