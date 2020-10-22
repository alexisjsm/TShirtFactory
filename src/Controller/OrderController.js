import { ErrorHandle } from '../bin/ErrorHandle'
import Item from '../Model/Item'
import Order from '../Model/Order'
import ShoppingCart from '../Model/ShoppingCart'
import User from '../Model/User'

const OrderController = {
  register: async (req, res, next) => {
    const { id: userId, role } = req.user
    const { cartId } = req.params
    try {
      if (role !== 'user') throw new ErrorHandle(401, "You don't have access ")
      const cart = await ShoppingCart.findById(cartId)
        .populate('products.productId')
        .populate('products.itemId')
        .then((cart) => {
          if (!cart) throw new ErrorHandle(404, 'Not found cart')
          return cart
        })

      const { total_price: amount } = cart

      const products = cart.products.map((el) => {
        const { productId: product, itemId: item, quantity, subtotal } = el
        const { parent_sku: parentSku, title, description, price } = product
        const { _id, child_sku: childSku, stock, color, size } = item

        Item.findByIdAndUpdate(
          _id,
          {
            stock: stock - quantity
          },
          { new: true }
        )
          .then((item) => item.stock)
          .catch((err) => {
            throw new ErrorHandle(400, err)
          })

        const object = {
          reference: `${parentSku}-${childSku}`,
          title,
          description,
          color,
          size,
          price,
          quantity,
          subtotal
        }
        return object
      })
      const orderObj = { userId, status: 'process', products, amount }

      const order = await Order.create(orderObj)
        .then((order) => {
          if (!order) throw new ErrorHandle(503, 'Something is wrong in Server')
          return order
        })
        .catch((error) => {
          if (error.statusCode) next(error)
          throw new ErrorHandle(400, error)
        })
      const user = await User.findByIdAndUpdate(userId, {
        $push: { order: order.id }
      }).then((user) => {
        if (!user) throw new ErrorHandle(404, 'Not found user')
        return user
      })
      if (order && user)
        res.status(200).json({ message: 'Order proccess', order })
    } catch (error) {
      next(error)
    }
  },

  updateStatus: async (req, res, next) => {
    const { role } = req.user
    const { orderId } = req.params
    const { status } = req.body
    try {
      if (role === 'user') throw new ErrorHandle(401, "You don't have access")

      await Order.findOneAndUpdate(
        { _id: orderId },
        { status },
        { new: true, runValidators: true }
      )
        .then((order) => {
          if (!order) throw new ErrorHandle(404, 'Not found order')
          res.status(200).json({
            message: 'Order updated',
            status: order.status,
            orderId: order.id
          })
        })
        .catch((error) => {
          if (error.statusCode) next(error)
          throw new ErrorHandle(400, error)
        })
    } catch (error) {
      next(error)
    }
  },
  canceledUpdate: async (req, res, next) => {
    const {role } = req.user
    try {
      if(role === 'user') throw new ErrorHandle(401, "You don't have access")

      const orders = await Order.find({status: {$eq: 'canceled'}}).then(orders => {
        if (!orders.length) throw new ErrorHandle(404, 'Not found orders with canceled status')
        return orders
      })
      .catch(err => {
        if (err.statusCode) next(err)
        throw new ErrorHandle(400, err)
      })
      const products = orders.flatMap(el => el.products)

      const productsRefound = products.map(el => {
        const reference = el.reference
        const childSku = reference.split('-')
        return {
          child_sku: childSku[1],
          quantity: el.quantity
        }
      })
      const items = []
      productsRefound.forEach(async (val, index, products) => {        
        const item = await Item.findOne({child_sku: val.child_sku})
        .then(item => {
           if (!item) console.error('No found reference Item')
           return item
        })
        .then(async item => {
          const {stock } = item
          return await Item.updateOne({child_sku: val.child_sku},{stock: stock + val.quantity }).then(item => item)
        })
        .catch(error => {
          throw new ErrorHandle(400, error)
        })
        items.push(item)
        if (index === products.length - 1) res.status(200).json({item: items})
      })
    } catch (error) {
      next(error)
    }
  }
  
}

export default OrderController
