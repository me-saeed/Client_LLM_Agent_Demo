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

const buildTicketFilter = (query: GetTicketsQuery): QueryFilter<TicketDocument> => {
  const filter: QueryFilter<TicketDocument> = {};

  if (query.priority) filter.priority = query.priority as TicketDocument['priority'];

  return filter;
};

const includesNameOrTitle = (ticket: TicketDocument, term: string) => {
  const search = term.toLowerCase();
  return (
    ticket.title.toLowerCase().includes(search) ||
    ticket.customerName.toLowerCase().includes(search)
  );
};

export const getTickets = async (req: Request, res: Response) => {
  try {
    const query = req.query as unknown as GetTicketsQuery;
    const filter = buildTicketFilter(query);
    const sort: Record<string, SortOrder> = {
      [query.sortBy]: query.sortOrder === 'asc' ? 1 : -1,
    };

    let tickets = await Ticket.find(filter).sort(sort);

    if (query.name_title) {
      tickets = tickets.filter((ticket) => includesNameOrTitle(ticket, query.name_title!));
    }

    res.status(StatusCodes.OK).json({ tickets });
  } catch {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Error fetching tickets' });
  }
};

export const getTicketById = async (req: Request, res: Response) => {
  try {
    const ticket = await Ticket.findById(req.params.id);
    res.status(StatusCodes.OK).json({ ticket });
  } catch {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Error fetching ticket' });
  }
};

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
