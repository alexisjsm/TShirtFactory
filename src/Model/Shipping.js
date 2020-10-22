import mongoose, { Schema } from 'mongoose'

const ShippingSchema = new mongoose.Schema(
  {
    status: {
      type: String,
      enum: ['pending', 'shipped out', 'pending delivered', 'delivered', 'undelivered']
    },
    shipping_address: {
      type: Schema.Types.ObjectId,
      ref: 'Addressbook',
      required: true
    },
    invoices_address: {
      type: Schema.Types.ObjectId,
      ref: 'AddressBook'
    },
    orderId:{
      type: Schema.Types.ObjectId,
      unique: true,
      required: true,
      ref: 'Order'
    }
  },
  {
    timestamps: true
  }
)

const Shipping = mongoose.model('Shipping', ShippingSchema)

export default Shipping
