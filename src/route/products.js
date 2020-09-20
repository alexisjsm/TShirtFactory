import { Router } from 'express'
import ProductController from '../Controller/ProductController'

const route = Router()

route.post('/register', ProductController.register)
route.put('/change/product/:id', ProductController.updateParent)
route.put('/add/items/:id', ProductController.addItem)
route.put('/change/items/:itemId', ProductController.updateItems)
route.get('/', ProductController.findAll)

export default route