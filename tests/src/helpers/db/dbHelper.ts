import { UserModel, IUser } from '../../models/User';

export const createUser = async (username: string, password: string): Promise<IUser> => {
  return await UserModel.create({ username, password });
};

export const deleteUserByUsername = async (username: string): Promise<{ deletedCount?: number }> => {
  return await UserModel.deleteOne({ username });
};