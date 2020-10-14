import mongoose, { Schema } from 'mongoose'

const ShippingSchema  = new mongoose.Schema({
  status: {
    type: String,
    enum: ['Paid', 'Shipped out', 'Delivered']
  },
  shipping_address: {
    type: Schema.Types.ObjectId,
    ref: 'Addressbook',
    required: true
  },
  invoices_address: {
    type: Schema.Types.ObjectId,
    ref: 'AddressBook',
    default: this.shipping_address
  },
  OrderId: {
    type: Schema.Types.ObjectId,
    ref: 'Order',
    required: true
  }
},
{
  timestamps: true
}
)

const Shipping = mongoose.model('Shipping', ShippingSchema)

export default Shipping