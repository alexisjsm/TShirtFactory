import UserController from '../Controller/UserController'
import { Router } from 'express'
import passport from 'passport'

const route = Router()

route.post('/register', UserController.register)

route.put(
  '/change/',
  passport.authenticate('jwt', { session: false }),
  UserController.update
)
route.put(
  '/change/role/:id',
  passport.authenticate('jwt', { session: false }),
  UserController.updateRol
)

route.delete(
  '/remove/:id',
  passport.authenticate('jwt', { session: false }),
  UserController.remove
)

route.get(
  '/profile',
  passport.authenticate('jwt', { session: false }),
  UserController.findUserById
)

export default route
