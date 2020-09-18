import UserController from '../Controller/UserController'
import { Router } from 'express'
import passport from 'passport'

const route = Router()

route.post('/register', UserController.register)
route.put('/change/:id', UserController.update)
route.put('/change/role/:id', UserController.updateRol)
route.delete('/delete/:id', UserController.remove)

route.get('/profile', passport.authenticate('jwt', { session: false }), UserController.findUserById)

export default route
