/**
 * Tickets controller.
 *
 * Handles HTTP request/response logic for ticket CRUD operations.
 * Business data is read from and written to MongoDB via the Ticket model.
 * Create and update actions also emit real-time Socket.IO events.
 */
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { QueryFilter, SortOrder } from 'mongoose';
import Ticket, { Ticket as TicketDocument } from '../models/tickets.model';
import { getIO } from '../lib/socket';

interface GetTicketsQuery {
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  status?: string;
  priority?: string;
  customerName?: string;
  customerEmail?: string;
  title?: string;
  search?: string;
}

/**
 * Builds a MongoDB filter from validated query params.
 * Exact match for `status`/`priority`; case-insensitive partial match for text fields.
 */
const buildTicketFilter = (query: GetTicketsQuery): QueryFilter<TicketDocument> => {
  const filter: QueryFilter<TicketDocument> = {};

  if (query.status) filter.status = query.status;
  if (query.priority) filter.priority = query.priority;
  if (query.customerName) filter.customerName = { $regex: query.customerName, $options: 'i' };
  if (query.customerEmail) filter.customerEmail = { $regex: query.customerEmail, $options: 'i' };
  if (query.title) filter.title = { $regex: query.title, $options: 'i' };

  if (query.search) {
    filter.$or = [
      { title: { $regex: query.search, $options: 'i' } },
      { description: { $regex: query.search, $options: 'i' } },
      { customerName: { $regex: query.search, $options: 'i' } },
      { customerEmail: { $regex: query.search, $options: 'i' } },
    ];
  }

  return filter;
};

/**
 * Returns a filterable and sortable list of tickets.
 *
 * @route GET /api/tickets
 */
export const getTickets = async (req: Request, res: Response) => {
  try {
    const query = req.query as unknown as GetTicketsQuery;
    const filter = buildTicketFilter(query);
    const sort: Record<string, SortOrder> = {
      [query.sortBy]: query.sortOrder === 'asc' ? 1 : -1,
    };

    const tickets = await Ticket.find(filter).sort(sort);

    res.status(StatusCodes.OK).json({ tickets });
  } catch {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Error fetching tickets' });
  }
};

/**
 * Returns a single ticket by its MongoDB ObjectId.
 *
 * @route GET /api/tickets/:id
 */
export const getTicketById = async (req: Request, res: Response) => {
  try {
    const ticket = await Ticket.findById(req.params.id);
    res.status(StatusCodes.OK).json({ ticket });
  } catch {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Error fetching ticket' });
  }
};

/**
 * Creates a new ticket from the validated request body and broadcasts
 * a `ticket:created` event to all connected Socket.IO clients.
 *
 * @route POST /api/tickets
 */
export const createTicket = async (req: Request, res: Response) => {
  try {
    const { title, description, customerName, customerEmail, status, priority } = req.body;
    const newTicket = new Ticket({ title, description, customerName, customerEmail, status, priority });
    await newTicket.save();
    getIO().emit('ticket:created', { ticket: newTicket });
    res.status(StatusCodes.CREATED).json({ message: 'Ticket created successfully' });
  } catch {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Error creating ticket' });
  }
};

/**
 * Partially updates an existing ticket and broadcasts a `ticket:updated`
 * event to all connected Socket.IO clients.
 *
 * @route PATCH /api/tickets/:id
 */
export const updateTicket = async (req: Request, res: Response) => {
  try {
    const { title, description, customerName, customerEmail, status, priority } = req.body;
    const updatedTicket = await Ticket.findByIdAndUpdate(
      req.params.id,
      { title, description, customerName, customerEmail, status, priority },
      { new: true }
    );
    getIO().emit('ticket:updated', { ticket: updatedTicket });
    res.status(StatusCodes.OK).json({ message: 'Ticket updated successfully' });
  } catch {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Error updating ticket' });
  }
};


/**
 * Deletes a ticket and broadcasts a `ticket:deleted` event to all connected Socket.IO clients.
 *
 * @route DELETE /api/tickets/:id
 */ 
export const deleteTicket = async (req: Request, res: Response) => {
  try {
    const deletedTicket = await Ticket.findByIdAndDelete(req.params.id);
    getIO().emit('ticket:deleted', { ticket: deletedTicket });
    res.status(StatusCodes.OK).json({ message: 'Ticket deleted successfully' });
  } catch {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Error deleting ticket' });
  }
};