import { Router } from 'express'
import passport from 'passport'
import OrderController from '../Controller/OrderController'
const route = Router()

route.post('/register/:cartId', passport.authenticate('jwt', { session: false }), OrderController.register)

route.patch('/update/status/:orderId', passport.authenticate('jwt', { session: false }), OrderController.updateStatus)

export default route
