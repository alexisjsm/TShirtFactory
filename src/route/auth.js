import { Router } from 'express'
import AuthController from '../Controller/AuthController'

const route = Router()

route.post('/login', AuthController.login)
route.post('/logout', AuthController.logout)

export default route
