/**
 * Database setup script.
 *
 * Seeds the database with default ticket records.
 * Run with: pnpm run setup
 */
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { defaultTickets } from '../data/default-tickets';
import Ticket from '../models/tickets.model';

dotenv.config();

const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/aurexillion';

const seedTickets = async () => {
  const result = await Ticket.bulkWrite(
    defaultTickets.map((ticket) => ({
      updateOne: {
        filter: { customerEmail: ticket.customerEmail },
        update: { $set: ticket },
        upsert: true,
      },
    }))
  );

  console.log(`Seeded ${defaultTickets.length} default tickets.`);
  console.log(`Upserted: ${result.upsertedCount}, modified: ${result.modifiedCount}`);
};

const runSetup = async () => {
  try {
    await mongoose.connect(mongoUri);
    console.log(`Connected to MongoDB on ${mongoUri}`);

    await seedTickets();
  } catch (error) {
    console.error('Setup failed:', error);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
};

void runSetup();
