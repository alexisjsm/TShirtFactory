import { Router } from 'express'
import ShoppingCartController from '../Controller/ShoppingCartController'

const route = Router()

route.get('/:cartId', ShoppingCartController.getCartById)

route.post('/add', ShoppingCartController.addToCart)

route.patch('/push/:cartId', ShoppingCartController.pushOnCart)
route.patch('/pull/:cartId', ShoppingCartController.pullOnCart)

route.delete('/remove/:cartId', ShoppingCartController.removeToCart)

export default route
