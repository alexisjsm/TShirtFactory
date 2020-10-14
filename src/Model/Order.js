import mongoose, { Schema } from 'mongoose'

const OrderSchema  = new mongoose.Schema({

  UserId: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },

  products: [{
    reference: {
      type: String,
      unique: true,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
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
    type: Schema.Types.Decimal128,
    required: true
  }
},
{
  timestamps: true
})

const Order = mongoose.model('Order', OrderSchema)

export default Order