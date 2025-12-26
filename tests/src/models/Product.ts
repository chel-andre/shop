import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  desc: string;
  price: number;
  discount: number;
  image?: string;
  user_id: mongoose.Types.ObjectId;
  is_delete: boolean;
  date: Date;
}

const ProductSchema: Schema<IProduct> = new Schema({
  name: { type: String, required: true },
  desc: { type: String, required: true },
  price: { type: Number, required: true },
  discount: { type: Number, required: true },
  image: { type: String },
  user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  is_delete: { type: Boolean, default: false },
  date: { type: Date, default: Date.now },
});

export const ProductModel: Model<IProduct> = mongoose.model<IProduct>('Product', ProductSchema);
