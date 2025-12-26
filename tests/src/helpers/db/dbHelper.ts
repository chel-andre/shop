import mongoose from 'mongoose';
import { connectDB } from './connectDb';
import { UserModel, IUser } from '../../models/User';
import { ProductModel, IProduct } from '../../models/Product';

async function ensureConnection<T>(fn: () => Promise<T>): Promise<T> {
  if (mongoose.connection.readyState !== 1) {
    await connectDB();
  }
  return fn();
}

export const dbHelper = {
  // ---------------- USERS ----------------
  createUser: (username: string, password: string): Promise<IUser> =>
    ensureConnection(() => UserModel.create({ username, password })),

  deleteUserByUsername: (username: string) =>
    ensureConnection(() => UserModel.deleteOne({ username })),

  deleteUserById: (userId: string) => ensureConnection(() => UserModel.deleteOne({ _id: userId })),

  // ---------------- PRODUCTS ----------------
  createProduct: (data: {
    name: string;
    desc: string;
    price: number;
    discount: number;
    user_id: mongoose.Types.ObjectId;
    image: string;
  }): Promise<IProduct> => ensureConnection(() => ProductModel.create(data)),

  deleteProductsByUser: (user_id: string) =>
    ensureConnection(() => ProductModel.deleteMany({ user_id })),
};
