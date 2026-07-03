/**
 * Ticket validation schemas.
 *
 * Yup schemas used by the validate middleware to enforce request rules
 * before ticket routes reach the controller.
 */
import mongoose from 'mongoose';
import * as yup from 'yup';

/** Reusable rule that checks a string is a valid MongoDB ObjectId. */
const objectId = yup
  .string()
  .required('Ticket id is required')
  .test('is-object-id', 'Invalid ticket id', (value) =>
    mongoose.Types.ObjectId.isValid(value)
  );

/** Fields allowed in `sortBy` query param for listing tickets. */
const SORTABLE_FIELDS = [
  'title',
  'status',
  'priority',
  'customerName',
  'customerEmail',
  'createdAt',
  'updatedAt',
] as const;

/**
 * Validates query params for listing tickets with filter and sort.
 *
 * Query params:
 * - `sortBy`, `sortOrder` — sorting
 * - `status`, `priority` — filters
 */
export const getTicketsQuerySchema = yup.object({
  sortBy: yup.string().oneOf(SORTABLE_FIELDS).default('createdAt'),
  sortOrder: yup.string().oneOf(['asc', 'desc']).default('desc'),
  status: yup.string().trim().optional(),
  priority: yup.string().trim().optional(),
});

/** Validates `:id` route params for single-ticket endpoints. */
export const ticketIdSchema = yup.object({
  id: objectId,
});

/** Validates the request body when creating a new ticket. All fields are required. */
export const createTicketSchema = yup.object({
  title: yup.string().trim().required('Title is required'),
  description: yup.string().trim().required('Description is required'),
  customerName: yup.string().trim().required('Customer name is required'),
  customerEmail: yup
    .string()
    .trim()
    .email('Invalid customer email')
    .required('Customer email is required'),
  status: yup.string().trim().required('Status is required'),
  priority: yup.string().trim().required('Priority is required'),
});

/** Validates the request body when updating a ticket status. */
export const updateTicketSchema = yup.object({
  status: yup.string().trim().required('Status is required'),
});
