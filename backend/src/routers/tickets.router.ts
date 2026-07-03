import { Router } from 'express';
import {
  createTicket,
  getTicketById,
  getTickets,
  updateTicketStatus,
} from '../controllers/tickets.controller';
import { validate } from '../middleware/validate.middleware';
import {
  createTicketSchema,
  getTicketsQuerySchema,
  ticketIdSchema,
  updateTicketSchema,
} from '../validations/tickets.validation';

const ticketsRouter = Router();

ticketsRouter.get('/', validate(getTicketsQuerySchema, 'query'), getTickets);
ticketsRouter.get('/:id', validate(ticketIdSchema, 'params'), getTicketById);
ticketsRouter.post('/', validate(createTicketSchema), createTicket);
ticketsRouter.patch(
  '/:id',
  validate(ticketIdSchema, 'params'),
  validate(updateTicketSchema),
  updateTicketStatus
);

export default ticketsRouter;
