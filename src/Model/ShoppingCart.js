import mongoose, { Schema } from 'mongoose'

const ShoppingCartSchema = new mongoose.Schema({

  product: [{
    productId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Product'
    },
    itemId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Item'
    },
    quantity: {
      type: Number,
      required: true
    },
    subtotal: {
      type: Schema.Types.Decimal128,
      required: true
    }
  }],

  total_price: {
    type: Schema.Types.Decimal128
  }
},
{
  timestamps: true
})

const ShoppingCart = mongoose.model('ShoppingCart', ShoppingCartSchema)

export default ShoppingCart
