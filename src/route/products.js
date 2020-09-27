import { Router } from 'express'
import passport from 'passport'
import ProductController from '../Controller/ProductController'

const route = Router()

route.get('/', ProductController.findAll)
route.get('/product/:id', ProductController.findProductById)
route.get('/items/:itemId', ProductController.findItemById)

route.post('/register', passport.authenticate('jwt', { session: false }), ProductController.register)

route.put('/change/product/:id', passport.authenticate('jwt', { session: false }), ProductController.updateProduct)
route.put('/add/item/:id', passport.authenticate('jwt', { session: false }), ProductController.addItem)
route.put('/change/item/:itemId', passport.authenticate('jwt', { session: false }), ProductController.updateItem)

export default route
