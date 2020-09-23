import { Router } from 'express'
import ProductController from '../Controller/ProductController'

const route = Router()

route.get('/', ProductController.findAll)
route.get('/product/:id', ProductController.findProductById)
route.get('/items/:itemId', ProductController.findItemById)

route.post('/register', ProductController.register)

route.put('/change/product/:id', ProductController.updateParent)
route.put('/add/item/:id', ProductController.addItem)
route.put('/change/item/:itemId', ProductController.updateItems)

export default route
