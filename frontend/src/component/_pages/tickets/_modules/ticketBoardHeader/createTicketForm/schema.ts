import * as yup from 'yup'

export const createTicketSchema = yup.object({
  title: yup
    .string()
    .required('Title is required')
    .min(3, 'Title must be at least 3 characters'),
  description: yup
    .string()
    .required('Description is required')
    .min(10, 'Description must be at least 10 characters'),
  customerName: yup.string().required('Customer name is required'),
  customerEmail: yup
    .string()
    .required('Email is required')
    .email('Enter a valid email address'),
  priority: yup
    .string()
    .oneOf(['LOW', 'MEDIUM', 'HIGH'], 'Select a valid priority')
    .required('Priority is required'),
})

export type CreateTicketFormValues = yup.InferType<typeof createTicketSchema>
