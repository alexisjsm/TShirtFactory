import { ErrorHandle } from '../bin/ErrorHandle'
import Item from '../Model/Item'
import Product from '../Model/Product'
import ShoppingCart from '../Model/ShoppingCart'

const ShoppingCartController = {
  addToCart: async (req, res, next) => {
    const { productId, itemId } = req.body
    const quantity = 1
    try {
      const product = await Product.findById(productId)
        .then(product => {
          if (!product) throw new ErrorHandle(404, 'Not found product')
          return product
        })

      const { price, items } = product
      const item = await Item.findById(itemId)
        .then(item => {
          if (!item) throw new ErrorHandle(404, 'Not found item')
          return item
        })

      if (!items.find(value => value.toString() === itemId && item.id === itemId)) throw new ErrorHandle(404, 'Not found item in product')

      const subtotal = subTotal(price, quantity)
      await ShoppingCart.create({ products: [{ productId, itemId, quantity, subtotal }] })
        .then(cart => {
          res.status(201).json({ message: 'Product in cart', cart })
        })
        .catch(() => { throw new ErrorHandle(400, 'Something is wrong') })
    } catch (error) {
      next(error)
    }
  },

  pushOnCart: async (req, res, next) => {
    const { cartId } = req.params
    const { productId, itemId } = req.body
    let { quantity } = req.body
    quantity = quantity === 0 ? 1 : quantity

    try {
      const cart = await ShoppingCart.findById(cartId).populate('products.productId').populate('products.itemId')
        .then(cart => {
          if (!cart) throw new ErrorHandle(404, 'Not found cart')
          return cart
        })

      const { products } = cart
      const subcart = products.map(element => element).find(value => value.productId._id.toString() === productId && value.itemId._id.toString() === itemId)
      if (subcart) {
        const { _id } = subcart
        const product = subcart.productId
        const { price } = product
        const subtotal = subTotal(price, quantity)

        await ShoppingCart.findOneAndUpdate({ 'products._id': _id }, { 'products.$.quantity': quantity, 'products.$.subtotal': subtotal }, { new: true, runValidators: true })
          .then(cart => {
            if (!cart) throw new ErrorHandle(404, 'Not found cart')
            res.status(200).json({ message: 'Updated cart', cart })
          })
          .catch(() => { throw new ErrorHandle(400, 'Something is wrong') })
      } else {
        const product = await Product.findById(productId)
          .then(product => {
            if (!product) throw new ErrorHandle(404, 'Not found product')
            return product
          })
        const item = await Item.findById(itemId)
          .then(item => {
            if (!product) throw new ErrorHandle(404, 'Not found item')
            return item
          })

        const { price, items } = product
        if (!items.find(value => value.toString() === itemId && item.id === itemId)) throw new ErrorHandle(400, 'Not found item on product')
        const subtotal = subTotal(price, quantity)
        await ShoppingCart.findByIdAndUpdate(cartId, { $push: { products: { productId, itemId, quantity, subtotal } } }, { new: true, runValidators: true })
          .then(cart => {
            res.status(200).json({ message: 'Add cart', cart })
          })
          .catch(() => { throw new ErrorHandle(400, 'Something is wrong') })
      }
    } catch (error) {
      next(error)
    }
  },

  pullOnCart: async (req, res, next) => {
    const { cartId } = req.params
    const { subcartId } = req.body
    try {
      await ShoppingCart.findOneAndUpdate({
        _id: cartId,
        'products._id': subcartId
      },
      {
        $pull: {
          products: {
            _id: subcartId
          }
        }
      },
      {
        new: true,
        runValidators: true
      })
        .then(cart => {
          if (!cart) throw new ErrorHandle(404, 'Not Found cart')
          res.status(200).json({ message: 'removed item on cart', cart })
        })
    } catch (error) {
      next(error)
    }
  },
  removeToCart: async (req, res, next) => {
    try {
      const { cartId } = req.params
      await ShoppingCart.findByIdAndDelete(cartId).then(cart => {
        if (!cart) throw new ErrorHandle(404, 'Not found cart')
        res.status(200).json({ message: 'Removed cart' })
      })
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
