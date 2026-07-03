import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { defaultTickets } from '../data/default-tickets';
import Ticket from '../models/tickets.model';

dotenv.config();

const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/aurexillion';

const seedTickets = async () => {
  await Ticket.bulkWrite(
    defaultTickets.map((ticket) => ({
      updateOne: {
        filter: { customerEmail: ticket.customerEmail },
        update: { $set: ticket },
        upsert: true,
      },
    }))
  );
};

const runSetup = async () => {
  try {
    await mongoose.connect(mongoUri);

    await seedTickets();
  } catch (error) {
    console.error('Setup failed:', error);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
};

void runSetup();
