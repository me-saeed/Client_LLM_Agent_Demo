import mongoose, { Document, Schema } from 'mongoose';

export type TicketStatus = 'OPEN' | 'IN_PROGRESS' | 'RESOLVED';
export type TicketPriority = 'LOW' | 'MEDIUM' | 'HIGH';

export interface Ticket extends Document {
  title: string;
  description: string;
  customerName: string;
  customerEmail: string;
  status: TicketStatus;
  priority: TicketPriority;
}

const ticketSchema = new Schema<Ticket>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    customerName: { type: String, required: true, trim: true },
    customerEmail: { type: String, required: true, unique: true, lowercase: true, trim: true },
    status: { type: String, enum: ["OPEN", "IN_PROGRESS", "RESOLVED"], required: true },
    priority: { type: String, enum: ["LOW", "MEDIUM", "HIGH"], required: true },
  },
  { timestamps: true }
);

export default mongoose.model<Ticket>('Ticket', ticketSchema);
