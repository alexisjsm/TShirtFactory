import { Router } from 'express'
import ShoppingCartController from '../Controller/ShoppingCartController'

const route = Router()

route.post('/add', ShoppingCartController.addToCart)

export default route
