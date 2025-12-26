const mongoose = require('mongoose');
const { Schema } = mongoose;

const productSchema = new Schema({
  name: String,
  desc: String,
  price: Number,
  image: String,
  discount: Number,
  user_id: Schema.Types.ObjectId,
  is_delete: { type: Boolean, default: false },
  date: { type: Date, default: Date.now },
});

const product = mongoose.model('product', productSchema);

module.exports = product;
