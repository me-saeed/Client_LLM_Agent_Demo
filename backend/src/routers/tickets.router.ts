/**
 * Tickets router.
 *
 * Maps HTTP methods and paths to ticket controller handlers.
 * Yup validation middleware runs before create, read-by-id, update, and delete routes.
 */
import { Router } from 'express';
import {
  createTicket,
  deleteTicket,
  getTicketById,
  getTickets,
  updateTicket,
} from '../controllers/tickets.controller';
import { validate } from '../middleware/validate.middleware';
import {
  createTicketSchema,
  getTicketsQuerySchema,
  ticketIdSchema,
  updateTicketSchema,
} from '../validations/tickets.validation';

const ticketsRouter = Router();

/** List tickets with filter and sort. Query params are validated first. */
ticketsRouter.get('/', validate(getTicketsQuerySchema, 'query'), getTickets);

/** Get one ticket by id. Params are validated before the controller runs. */
ticketsRouter.get('/:id', validate(ticketIdSchema, 'params'), getTicketById);

/** Create a ticket. Request body is validated before the controller runs. */
ticketsRouter.post('/', validate(createTicketSchema), createTicket);

/** Update a ticket. Params and body are validated before the controller runs. */
ticketsRouter.patch(
  '/:id',
  validate(ticketIdSchema, 'params'),
  validate(updateTicketSchema),
  updateTicket
);

/** Delete a ticket. Params are validated before the controller runs. */
ticketsRouter.delete('/:id', validate(ticketIdSchema, 'params'), deleteTicket);

export default ticketsRouter;
