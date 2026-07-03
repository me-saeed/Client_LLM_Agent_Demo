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
  status: "OPEN" | "IN_PROGRESS" | "RESOLVED";
  priority: "LOW" | "MEDIUM" | "HIGH";
}

/** Mongoose schema with field types, constraints, and automatic timestamps. */
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
