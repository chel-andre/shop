import mongoose from 'mongoose';
import { UserModel } from '../../models/User';
import { connectDB } from './connectDB';

export const deleteUserByUsername = async (username: string) => {
  if (mongoose.connection.readyState !== 1) {
    await connectDB();
  }
  return await UserModel.deleteOne({ username });
};

export const createUser = async (username: string, password: string) => {
  if (mongoose.connection.readyState !== 1) {
    await connectDB();
  }
  return await UserModel.create({ username, password });
};
