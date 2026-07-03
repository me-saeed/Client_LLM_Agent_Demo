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
  name_title?: string;
  priority?: string;
}

/**
 * Builds a MongoDB filter from validated query params.
 * Exact match for `status` and `priority`.
 */
const buildTicketFilter = (query: GetTicketsQuery): QueryFilter<TicketDocument> => {
  const filter: QueryFilter<TicketDocument> = {};

  if (query.name_title) filter.$or = [
    { title: { $regex: query.name_title, $options: 'i' } },
    { customerName: { $regex: query.name_title, $options: 'i' } },
  ];
  if (query.priority) filter.priority = query.priority;

  console.log(filter);
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
    console.log(tickets);
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
 * Updates a ticket's status and broadcasts a `ticket:updated`
 * event to all connected Socket.IO clients.
 *
 * @route PATCH /api/tickets/:id
 */
export const updateTicketStatus = async (req: Request, res: Response) => {
  try {
    const { status } = req.body;
    const updatedTicket = await Ticket.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    getIO().emit('ticket:updated', { ticket: updatedTicket });
    res.status(StatusCodes.OK).json({ message: 'Ticket updated successfully' });
  } catch {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Error updating ticket' });
  }
};