import mongoose from 'mongoose';

export default async function globalTeardown() {
  if (mongoose.connection.readyState === 1) {
    await mongoose.disconnect();
    console.log('MongoDB disconnected');
  }
}
