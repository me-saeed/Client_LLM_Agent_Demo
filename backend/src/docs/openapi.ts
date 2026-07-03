import { TicketPriority, TicketStatus } from '../models/tickets.model';

const ticketStatusValues: TicketStatus[] = ['OPEN', 'IN_PROGRESS', 'RESOLVED'];
const ticketPriorityValues: TicketPriority[] = ['LOW', 'MEDIUM', 'HIGH'];

export const openApiSpec = {
  openapi: '3.0.3',
  info: {
    title: 'Aurexillion Tickets API',
    version: '1.0.0',
    description:
      'REST API for managing support tickets. Create and update actions emit Socket.IO events (`ticket:created`, `ticket:updated`).',
  },
  servers: [
    {
      url: 'http://localhost:5000',
      description: 'Local development',
    },
  ],
  tags: [
    {
      name: 'Tickets',
      description: 'Ticket CRUD operations',
    },
  ],
  paths: {
    '/api/tickets': {
      get: {
        tags: ['Tickets'],
        summary: 'List tickets',
        description:
          'Returns a filterable, sortable list of tickets. `name_title` matches title or customer name (case-insensitive).',
        parameters: [
          {
            name: 'sortBy',
            in: 'query',
            schema: {
              type: 'string',
              enum: [
                'title',
                'status',
                'priority',
                'customerName',
                'customerEmail',
                'createdAt',
                'updatedAt',
              ],
              default: 'createdAt',
            },
          },
          {
            name: 'sortOrder',
            in: 'query',
            schema: { type: 'string', enum: ['asc', 'desc'], default: 'desc' },
          },
          {
            name: 'name_title',
            in: 'query',
            description: 'Search by ticket title or customer name',
            schema: { type: 'string' },
          },
          {
            name: 'status',
            in: 'query',
            schema: { type: 'string', enum: ticketStatusValues },
          },
          {
            name: 'priority',
            in: 'query',
            schema: { type: 'string', enum: ticketPriorityValues },
          },
        ],
        responses: {
          '200': {
            description: 'Tickets retrieved successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    tickets: {
                      type: 'array',
                      items: { $ref: '#/components/schemas/Ticket' },
                    },
                  },
                  required: ['tickets'],
                },
              },
            },
          },
          '400': { $ref: '#/components/responses/ValidationError' },
          '500': { $ref: '#/components/responses/InternalError' },
        },
      },
      post: {
        tags: ['Tickets'],
        summary: 'Create a ticket',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/CreateTicketRequest' },
            },
          },
        },
        responses: {
          '201': {
            description: 'Ticket created successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    message: { type: 'string', example: 'Ticket created successfully' },
                  },
                  required: ['message'],
                },
              },
            },
          },
          '400': { $ref: '#/components/responses/ValidationError' },
          '500': { $ref: '#/components/responses/InternalError' },
        },
      },
    },
    '/api/tickets/{id}': {
      get: {
        tags: ['Tickets'],
        summary: 'Get ticket by ID',
        parameters: [{ $ref: '#/components/parameters/TicketId' }],
        responses: {
          '200': {
            description: 'Ticket retrieved successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    ticket: { $ref: '#/components/schemas/Ticket' },
                  },
                  required: ['ticket'],
                },
              },
            },
          },
          '400': { $ref: '#/components/responses/ValidationError' },
          '500': { $ref: '#/components/responses/InternalError' },
        },
      },
      patch: {
        tags: ['Tickets'],
        summary: 'Update ticket status',
        parameters: [{ $ref: '#/components/parameters/TicketId' }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/UpdateTicketRequest' },
            },
          },
        },
        responses: {
          '200': {
            description: 'Ticket updated successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    message: { type: 'string', example: 'Ticket updated successfully' },
                  },
                  required: ['message'],
                },
              },
            },
          },
          '400': { $ref: '#/components/responses/ValidationError' },
          '500': { $ref: '#/components/responses/InternalError' },
        },
      },
    },
  },
  components: {
    parameters: {
      TicketId: {
        name: 'id',
        in: 'path',
        required: true,
        description: 'MongoDB ObjectId of the ticket',
        schema: { type: 'string', example: '507f1f77bcf86cd799439011' },
      },
    },
    schemas: {
      TicketStatus: {
        type: 'string',
        enum: ticketStatusValues,
      },
      TicketPriority: {
        type: 'string',
        enum: ticketPriorityValues,
      },
      Ticket: {
        type: 'object',
        properties: {
          _id: { type: 'string', example: '507f1f77bcf86cd799439011' },
          title: { type: 'string', example: 'Cannot reset password' },
          description: {
            type: 'string',
            example: 'Customer receives an error when clicking the password reset link.',
          },
          customerName: { type: 'string', example: 'Jane Doe' },
          customerEmail: { type: 'string', format: 'email', example: 'jane.doe@example.com' },
          status: { $ref: '#/components/schemas/TicketStatus' },
          priority: { $ref: '#/components/schemas/TicketPriority' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
        required: [
          '_id',
          'title',
          'description',
          'customerName',
          'customerEmail',
          'status',
          'priority',
          'createdAt',
          'updatedAt',
        ],
      },
      CreateTicketRequest: {
        type: 'object',
        properties: {
          title: { type: 'string', example: 'Cannot reset password' },
          description: {
            type: 'string',
            example: 'Customer receives an error when clicking the password reset link.',
          },
          customerName: { type: 'string', example: 'Jane Doe' },
          customerEmail: { type: 'string', format: 'email', example: 'jane.doe@example.com' },
          status: { $ref: '#/components/schemas/TicketStatus' },
          priority: { $ref: '#/components/schemas/TicketPriority' },
        },
        required: [
          'title',
          'description',
          'customerName',
          'customerEmail',
          'status',
          'priority',
        ],
      },
      UpdateTicketRequest: {
        type: 'object',
        properties: {
          status: { $ref: '#/components/schemas/TicketStatus' },
        },
        required: ['status'],
      },
      ValidationError: {
        type: 'object',
        properties: {
          message: { type: 'string', example: 'Validation failed' },
          errors: {
            type: 'array',
            items: { type: 'string' },
            example: ['Title is required'],
          },
        },
        required: ['message', 'errors'],
      },
      ErrorMessage: {
        type: 'object',
        properties: {
          message: { type: 'string' },
        },
        required: ['message'],
      },
    },
    responses: {
      ValidationError: {
        description: 'Request validation failed',
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/ValidationError' },
          },
        },
      },
      InternalError: {
        description: 'Internal server error',
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/ErrorMessage' },
          },
        },
      },
    },
  },
} as const;
