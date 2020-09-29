import { ErrorHandle } from '../bin/ErrorHandle'
import Item from '../Model/Item'
import Product from '../Model/Product'
import ShoppingCart from '../Model/ShoppingCart'

function subTotal (price, quantity) {
  const subtotal = price * quantity
  return subtotal.toFixed(2)
}

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
          await ShoppingCart.create({ product: [{ productId, itemId, quantity, subtotal }] }).then(cart => {
            if (!cart) throw new ErrorHandle(400, 'Something is wrong')
            res.status(201).json({ message: 'Product in cart', cart })
          })
        })
      })
        .catch(error => { throw new ErrorHandle(400, error) })
    } catch (error) {
      next(error)
    }
  }
}

export default ShoppingCartController
