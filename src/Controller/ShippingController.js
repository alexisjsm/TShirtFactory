import { ErrorHandle } from "../bin/ErrorHandle"
import AddressBook from "../Model/Addressbook"
import Order from "../Model/Order"
import Shipping from "../Model/Shipping"

const ShippingController = {
  register: async (req, res, next) =>{
    const {role} = req.user
    const {orderId} = req.params 
    const {shipping_addressId: shippingAddressId, invoices_addressId: invoicesAddressId } = req.body
  try{
    let invoicesAddress
  if (role === 'user') throw new ErrorHandle(401, "You don't have access") 
    
    const shippingAddress = await AddressBook.findOne({
      $or:[{
        _id: shippingAddressId
      }, 
      {
        isDefault: {$eq: true}
      }
    ]
  }).then(shippingAddress => {
      if(!shippingAddress) throw new ErrorHandle(404, 'Not found shipping address')
      return shippingAddress
    })
    .catch(error => {
      if (error.statusCode) next(error)
      throw new ErrorHandle(400, error)
    })
    const {userId} = shippingAddress
    if (invoicesAddressId){
      invoicesAddress = await AddressBook.findOne({
        $or:[{
          _id: invoicesAddressId
        }, 
        {
          isDefault: {$eq: true}
        }
      ]
    })
      .then(invoicesAddress => {
        if (!shippingAddressId) throw new ErrorHandle(404, 'Not found invoices address')
        return invoicesAddress
      })
      .catch(error => {
        if (error.statusCode) next(error)
        throw new ErrorHandle(400, error)
      })
    } else {
      invoicesAddress = shippingAddress
    }    
    const order = await Order.findOne({
        _id: orderId,
        userId: {$eq: userId},
        status: { $eq: "confirm"}
      })
    .then(order => {
      if (!order) throw new ErrorHandle(406, "Order isn't yet available")
      return order
    })
    const shipping = await Shipping.create({
      status: 'pedding',
      shipping_address: shippingAddress._id, 
      invoices_address: invoicesAddress._id, 
      orderId: order._id 
    })
      .then(shipping => shipping)
      .catch(error => {
        if (error.code) next(error)
        throw new ErrorHandle(400, error)
      })
    if(shipping) res.status(200).json({message: 'Order pedding for shipping', shipping})
  
  } catch (error) {
    next(error)
  }
 },
 statusUpdate: async (req, res, next) => {
   const {role} = req.user
   const {shippingId} = req.params
try {
  if (role === 'user') throw new ErrorHandle(401, "You don't have access")

  const shipping = await Shipping.findById(shippingId).then(shipping => {
    if (!shipping) throw new ErrorHandle(404, 'Not found shipping')
    return shipping
  })
  .catch(error => {
    if (error.statusCode) next(error)
    throw new ErrorHandle(400, error) 
  })
  const {orderId } = shipping
  const order = await Order.findById(orderId).then(order => {
    if (!order) throw new ErrorHandle(404, 'Not found  order')
    return order
  })
  .catch(error => {
    if (error.statusCode) next(error)
    throw new ErrorHandle(400, error)
  })
  const {status: statusOrder} = order
  let newStatusShipping
  

  switch (statusOrder){
    case 'confirm'| 'paid':
      newStatusShipping = 'pedding'
      break
    case 'shipping':
      newStatusShipping = 'shipped out'
      break
    default:
      throw new ErrorHandle(409, "Order isn't yet available to shipping")
  }

  await Shipping.findByIdAndUpdate(shippingId, {status: newStatusShipping}, {new: true, runValidators: true}).then(newShipping =>{
    if (!newShipping) throw new ErrorHandle(404, 'Not found order')
    res.status(200).json({message: 'shipping change', newShipping})
  })
} catch (error) {
  next(error)
}


   
 },
 getShippingById: async (req, res, next) => {
   const {shippingId} = req.params
   const {id: userId} = req.user
   try {
    await Shipping.findOne({_id: shippingId}).populate('shipping_address', null, AddressBook).populate('invoices_address',null,AddressBook).populate('orderId').then(shipping => {
      if (!shipping) {
        throw new ErrorHandle(404, 'Not found order')
      }
      const {orderId} = shipping
      if (userId !== orderId.userId.toString()) {
        throw new ErrorHandle(401, "You don't have access")
      }
      res.status(200).json({message: `View order: ${shippingId}`, shipping})
    })

   } catch (error) {
     next(error) 
   }
 }
 
}

export default ShippingController