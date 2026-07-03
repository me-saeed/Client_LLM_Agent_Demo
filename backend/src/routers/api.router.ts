/**
 * API router.
 *
 * Groups versionless REST endpoints under `/api`.
 * Each resource (e.g. tickets) gets its own sub-router.
 */
import { Router } from 'express';
import ticketsRouter from './tickets.router';

const apiRouter = Router();

apiRouter.use('/tickets', ticketsRouter);

export default apiRouter;
