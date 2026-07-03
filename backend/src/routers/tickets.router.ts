/**
 * Tickets router.
 *
 * Maps HTTP methods and paths to ticket controller handlers.
 * Yup validation middleware runs before create, read-by-id, and update routes.
 */
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

/** List tickets with filter and sort. Query params are validated first. */
ticketsRouter.get('/', validate(getTicketsQuerySchema, 'query'), getTickets);

/** Get one ticket by id. Params are validated before the controller runs. */
ticketsRouter.get('/:id', validate(ticketIdSchema, 'params'), getTicketById);

/** Create a ticket. Request body is validated before the controller runs. */
ticketsRouter.post('/', validate(createTicketSchema), createTicket);

/** Update a ticket's status. Params and body are validated before the controller runs. */
ticketsRouter.patch(
  '/:id',
  validate(ticketIdSchema, 'params'),
  validate(updateTicketSchema),
  updateTicketStatus
);

export default ticketsRouter;
