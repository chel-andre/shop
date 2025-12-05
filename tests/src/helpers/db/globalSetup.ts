import { connectDB } from './connectDb';
import dotenv from 'dotenv';

dotenv.config();

export default async function globalSetup() {
  console.log('Connecting to MongoDB...');
  await connectDB();
  console.log('MongoDB connected');
}
