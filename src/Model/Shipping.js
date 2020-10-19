import mongoose, { Schema } from 'mongoose'

const ShippingSchema = new mongoose.Schema({
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
    ref: 'AddressBook'
  },
  OrderId: {
    type: Schema.Types.ObjectId,
    ref: 'Order',
    required: true
  }
},
{
  timestamps: true
})

ShippingSchema.pre('save', function (next) {
  if (this.isModified('invoices_address')) return next()
  try {
    this.invoices_address = shipping_address
    return next()
  } catch (error) {
    next(error)
  }
})

const Shipping = mongoose.model('Shipping', ShippingSchema)

export default Shipping
