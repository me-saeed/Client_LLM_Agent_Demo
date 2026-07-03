import type { TicketPriority, TicketStatus } from '../models/tickets.model';

export interface DefaultTicket {
  title: string;
  description: string;
  customerName: string;
  customerEmail: string;
  status: TicketStatus;
  priority: TicketPriority;
}

export const defaultTickets: DefaultTicket[] = [
  {
    title: 'Cannot reset password',
    description: 'Customer receives an error when clicking the password reset link.',
    customerName: 'Jane Doe',
    customerEmail: 'jane.doe@example.com',
    status: 'OPEN',
    priority: 'HIGH',
  },
  {
    title: 'Invoice PDF missing line items',
    description: 'The downloaded invoice PDF does not include tax and discount rows.',
    customerName: 'Michael Chen',
    customerEmail: 'michael.chen@example.com',
    status: 'IN_PROGRESS',
    priority: 'MEDIUM',
  },
  {
    title: 'Dashboard charts not loading',
    description: 'Analytics widgets stay in a loading state after login on Chrome.',
    customerName: 'Sofia Martinez',
    customerEmail: 'sofia.martinez@example.com',
    status: 'OPEN',
    priority: 'HIGH',
  },
  {
    title: 'Request to export tickets as CSV',
    description: 'Customer asked for a CSV export option on the support page.',
    customerName: 'Liam OConnor',
    customerEmail: 'liam.oconnor@example.com',
    status: 'OPEN',
    priority: 'LOW',
  },
  {
    title: 'Duplicate welcome email sent',
    description: 'New users are receiving two welcome emails after signup.',
    customerName: 'Aisha Khan',
    customerEmail: 'aisha.khan@example.com',
    status: 'RESOLVED',
    priority: 'MEDIUM',
  },
  {
    title: 'Mobile app crashes on ticket reply',
    description: 'The iOS app closes when submitting a reply from the ticket detail screen.',
    customerName: 'Noah Williams',
    customerEmail: 'noah.williams@example.com',
    status: 'OPEN',
    priority: 'HIGH',
  },
];
