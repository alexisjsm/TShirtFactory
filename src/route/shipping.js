import { Router } from 'express'
import passport from 'passport'
import ShippingController from '../Controller/ShippingController'

const route = Router()

route.get(
  '/:shippingId',
  passport.authenticate('jwt', { session: false }),
  ShippingController.getShippingById
)

route.post(
  '/register/:orderId',
  passport.authenticate('jwt', { session: false }),
  ShippingController.register
)

route.put(
  '/update/status/:shippingId',
  passport.authenticate('jwt', { session: false }),
  ShippingController.statusUpdate
)

export default route
