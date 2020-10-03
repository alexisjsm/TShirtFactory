import mongoose, { Schema } from 'mongoose'

const ShoppingCartSchema = new mongoose.Schema({

  products: [{
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
  }]
},
{
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
  timestamps: true
})

ShoppingCartSchema.virtual('total_price').get(function () {
  return this.products.map(({ subtotal }) => subtotal).reduce((a, b) => parseFloat(a) + parseFloat(b))
})

const ShoppingCart = mongoose.model('ShoppingCart', ShoppingCartSchema)

export default ShoppingCart
