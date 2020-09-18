import { Router } from 'express'
import UserController from '../Controller/UserController'

const route = Router()

route.post('/login', UserController.login)
route.post('/logout', UserController.logout)

export default route
