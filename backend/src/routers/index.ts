import { Router } from 'express';
import ticketsRouter from './tickets.router';

const appRouter = Router();

appRouter.use('/tickets', ticketsRouter);

export default appRouter;
