import { ErrorHandle } from '../bin/ErrorHandle'
import Item from '../Model/Item'
import Product from '../Model/Product'
import ShoppingCart from '../Model/ShoppingCart'

const ShoppingCartController = {
  addToCart: async (req, res, next) => {
    const { productId, itemId } = req.body
    const quantity = 1
    try {
      await Product.findById(productId).then(async product => {
        if (!product) throw new ErrorHandle(404, 'Not found product')
        const { items } = product
        if (!items.find(async value => value === itemId)) throw new ErrorHandle(409, 'Not found item in product')
        await Item.findById(itemId).then(async item => {
          if (!item) throw new ErrorHandle(404, 'Not found item')
          const subtotal = subTotal(product.price, quantity)
          await ShoppingCart.create({ products: [{ productId, itemId, quantity, subtotal }] }).then(cart => {
            if (!cart) throw new ErrorHandle(400, 'Something is wrong')
            res.status(201).json({ message: 'Product in cart', cart })
          })
        })
      })
        .catch(error => { throw new ErrorHandle(400, error) })
    } catch (error) {
      next(error)
    }
  },

  putOnCart: async (req, res, next) => {
    const { cartId } = req.params
    const { productId, itemId, quantity } = req.body
    try {
      const cart = await ShoppingCart.findById(cartId).populate('products.productId').populate('products.itemId')
        .then((cart) => {
          return cart
        })
        .catch(() => { throw new ErrorHandle(404, 'Not found cart') })
      const { products } = cart.toJSON()
      const subcart = products.map(element => element).find(value => value.productId._id.toString() === productId && value.itemId._id.toString() === itemId)
      if (subcart) {
        const { _id } = subcart
        const product = subcart.productId
        const { price } = product
        const subtotal = subTotal(price, quantity)

        await ShoppingCart.findOneAndUpdate({ 'products._id': _id }, { 'products.$.quantity': quantity, 'products.$.subtotal': subtotal }, { new: true, runValidators: true })
          .then(newcart => {
            res.status(200).json({ message: 'Updated cart', newcart })
          })
          .catch(() => { throw new ErrorHandle(400, 'Something is wrong') })
      } else {
        const product = await Product.findById(productId)
          .then(product => {
            return product
          })
          .catch(() => { throw new ErrorHandle(404, 'Not found product') })
        const item = await Item.findById(itemId)
          .then(item => {
            return item
          })
          .catch(() => { throw new ErrorHandle(404, 'Not found item') })
        const { price, items } = product
        if (!items.find(async value => value === itemId)) throw new ErrorHandle(400, 'Not found item on product')
        const subtotal = subTotal(price, quantity)
        await ShoppingCart.findByIdAndUpdate(cartId, { $push: { products: { productId, itemId, quantity, subtotal } } }, { new: true, runValidators: true })
          .then(newcart => {
            if (!newcart) throw new ErrorHandle(400, 'Something is wrong')
            res.status(200).json({ message: 'Add cart', newcart })
          })
      }
    } catch (error) {
      next(error)
    }
  }
}

function subTotal (price, quantity) {
  const subtotal = price * quantity
  return subtotal.toFixed(2)
}

export default ShoppingCartController
