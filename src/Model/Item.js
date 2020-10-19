import mongoose, { Schema } from 'mongoose'

const ItemSchema = new mongoose.Schema({
  child_sku: {
    type: String,
    required: true,
    unique: true
  },
  stock: {
    type: Number,
    required: true
  },
  color: {
    type: String,
    required: true
  },
  size: {
    type: String,
    required: true
  },
  product: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  }
})
const Item = mongoose.model('Item', ItemSchema)

export default Item
