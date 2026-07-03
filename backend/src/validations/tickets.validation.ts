import mongoose from 'mongoose';
import * as yup from 'yup';

const objectId = yup
  .string()
  .required('Ticket id is required')
  .test('is-object-id', 'Invalid ticket id', (value) =>
    mongoose.Types.ObjectId.isValid(value)
  );

const SORTABLE_FIELDS = [
  'title',
  'status',
  'priority',
  'customerName',
  'customerEmail',
  'createdAt',
  'updatedAt',
] as const;

export const getTicketsQuerySchema = yup.object({
  sortBy: yup.string().oneOf(SORTABLE_FIELDS).default('createdAt'),
  sortOrder: yup.string().oneOf(['asc', 'desc']).default('desc'),
  name_title: yup.string().trim().optional(),
  status: yup.string().trim().optional(),
  priority: yup.string().trim().optional(),
});

export const ticketIdSchema = yup.object({
  id: objectId,
});

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

export const updateTicketSchema = yup.object({
  status: yup.string().trim().required('Status is required'),
});
