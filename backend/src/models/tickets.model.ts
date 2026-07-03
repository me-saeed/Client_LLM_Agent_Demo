/**
 * Ticket data model.
 *
 * Defines the Mongoose schema and TypeScript interface for support tickets
 * stored in MongoDB. Exported as the default model used by controllers.
 */
import mongoose, { Document, Schema } from 'mongoose';

/** Shape of a ticket document in MongoDB. */
export interface Ticket extends Document {
  title: string;
  description: string;
  customerName: string;
  customerEmail: string;
  status: string;
  priority: string;
}

/** Mongoose schema with field types, constraints, and automatic timestamps. */
const ticketSchema = new Schema<Ticket>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    customerName: { type: String, required: true, trim: true },
    customerEmail: { type: String, required: true, unique: true, lowercase: true, trim: true },
    status: { type: String, required: true, trim: true },
    priority: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

export default mongoose.model<Ticket>('Ticket', ticketSchema);
