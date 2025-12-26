import mongoose from 'mongoose';
import dotenv from 'dotenv';

// dotenv.config();
//   console.log(process.env)

export const connectDB = async () => {
  if (mongoose.connection.readyState === 1) return;
  await mongoose.connect(process.env.MONGO_URI!);
};
