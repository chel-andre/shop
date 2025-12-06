import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

export default async function globalSetup() {
  console.log('Connecting to MongoDB...');
  if (mongoose.connection.readyState !== 1) {
    await mongoose.connect(process.env.MONGO_URI!);
  }
  console.log('MongoDB connected');
}
