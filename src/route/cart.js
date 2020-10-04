import { Router } from 'express'
import ShoppingCartController from '../Controller/ShoppingCartController'

const route = Router()

route.post('/add', ShoppingCartController.addToCart)
route.patch('/push/:cartId', ShoppingCartController.pushOnCart)
route.patch('/pull/:cartId', ShoppingCartController.pullOnCart)

export default route
