import { afterEach, describe, expect, it, vi } from 'vitest';
import { StatusCodes } from 'http-status-codes';
import request from 'supertest';
import { createApp } from '../src/app';
import Ticket from '../src/models/tickets.model';

vi.mock('../src/lib/socket', () => ({
  getIO: () => ({ emit: vi.fn() }),
  initSocket: vi.fn(),
}));

const app = createApp();

const validTicket = {
  title: 'Login issue',
  description: 'User cannot sign in',
  customerName: 'Jane Doe',
  customerEmail: 'jane@example.com',
  status: 'open',
  priority: 'high',
};

afterEach(async () => {
  await Ticket.deleteMany({});
});

describe('Tickets API', () => {
  it('rejects a ticket without a required title', async () => {
    const { title: omittedTitle, ...ticketWithoutTitle } = validTicket;
    void omittedTitle;

    const response = await request(app)
      .post('/api/tickets')
      .send(ticketWithoutTitle)
      .expect(StatusCodes.BAD_REQUEST);

    expect(response.body).toMatchObject({
      message: 'Validation failed',
    });
    expect(response.body.errors).toContain('Title is required');

    const count = await Ticket.countDocuments();
    expect(count).toBe(0);
  });

  it('creates a valid ticket and stores it successfully', async () => {
    const response = await request(app)
      .post('/api/tickets')
      .send(validTicket)
      .expect(StatusCodes.CREATED);

    expect(response.body).toMatchObject({
      message: 'Ticket created successfully',
    });

    const storedTicket = await Ticket.findOne({ customerEmail: validTicket.customerEmail });
    expect(storedTicket).not.toBeNull();
    expect(storedTicket?.title).toBe(validTicket.title);
    expect(storedTicket?.description).toBe(validTicket.description);
    expect(storedTicket?.customerName).toBe(validTicket.customerName);
    expect(storedTicket?.status).toBe(validTicket.status);
    expect(storedTicket?.priority).toBe(validTicket.priority);
  });

  it('saves the new status when updating a ticket', async () => {
    const created = await Ticket.create(validTicket);

    const response = await request(app)
      .patch(`/api/tickets/${created._id.toString()}`)
      .send({ status: 'closed' })
      .expect(StatusCodes.OK);

    expect(response.body).toMatchObject({
      message: 'Ticket updated successfully',
    });

    const updatedTicket = await Ticket.findById(created._id);
    expect(updatedTicket?.status).toBe('closed');
  });
});
