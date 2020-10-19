import mongoose, { Schema } from 'mongoose'

const ProductSchema = new mongoose.Schema({
  parent_sku: {
    type: String,
    required: true,
    unique: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true,
    default: ''
  },
  price: {
    type: Schema.Types.Decimal128,
    required: true
  },

  categories: {
    type: [String]
  },
  items: {
    type: [Schema.Types.ObjectId],
    ref: 'Item'
  }
})

const Product = mongoose.model('Product', ProductSchema)

export default Product
